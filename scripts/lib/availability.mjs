/**
 * ============================================================================
 *  空房資料的純邏輯（不碰網路、不碰檔案，方便用 node:test 驗）
 * ----------------------------------------------------------------------------
 *  ⚠️ 這裡刻意只讀 DTSTART / DTEND，絕對不讀 SUMMARY、ATTENDEE 之類的欄位。
 *     日曆目前設定為「只顯示空/忙」，但那是 Google 那一端的設定；
 *     哪天被改掉的話，這一層就是最後一道防線 —— 客人姓名不會寫進公開 repo。
 * ============================================================================
 */

const DAY_MS = 86400000;

/** "20260713" → 該日 UTC 零點的毫秒數。用 UTC 是為了避開日光節約與時區位移 */
function toUtcMs(compactDate) {
  const year = Number(compactDate.slice(0, 4));
  const month = Number(compactDate.slice(4, 6));
  const day = Number(compactDate.slice(6, 8));
  return Date.UTC(year, month - 1, day);
}

/** 毫秒數 → "YYYY-MM-DD" */
function toIsoDate(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * 從 .ics 內容取出「被佔用的夜晚」。
 *
 * ⚠️ 全天事件的 DTEND 是「不包含」的：9/10 入住、9/12 退房，
 *    佔用的是 9/10 與 9/11 兩晚，9/12 早上就空出來了。
 *    所以下面的迴圈條件是 ms < end，不是 ms <= end。
 *    寫成 <= 會讓退房日被誤標客滿，白白少接一天生意。
 */
export function occupiedNights(icsText) {
  const nights = new Set();

  for (const chunk of icsText.split("BEGIN:VEVENT").slice(1)) {
    const event = chunk.split("END:VEVENT")[0];

    // 只認全天事件。有時間的事件不是訂房（可能是屋主自己的提醒），略過
    const start = event.match(/^DTSTART;VALUE=DATE:(\d{8})/m)?.[1];
    const end = event.match(/^DTEND;VALUE=DATE:(\d{8})/m)?.[1];
    if (!start || !end) continue;

    for (let ms = toUtcMs(start); ms < toUtcMs(end); ms += DAY_MS) {
      nights.add(toIsoDate(ms));
    }
  }

  return nights;
}

/**
 * 把每間房的佔用夜晚合併成要寫出去的 JSON。
 *
 * 只記「被訂走的日期」，沒出現的日期就是全空 ——
 * 否則得決定「未來要列到哪一天」，而且檔案會無限長。
 *
 * 日期與房間代號都排序過。順序不穩定的話，內容明明沒變 JSON 也會不同，
 * 排程就會每小時 commit 一次假異動。
 */
export function buildPayload({ rooms, occupancyByRoom, today, generatedAt }) {
  const booked = {};

  for (const room of rooms) {
    for (const night of occupancyByRoom[room.id] ?? []) {
      // "YYYY-MM-DD" 是等寬格式，字串比較就等於日期比較
      if (night < today) continue;
      (booked[night] ??= []).push(room.id);
    }
  }

  const sorted = {};
  for (const date of Object.keys(booked).sort()) {
    sorted[date] = booked[date].sort();
  }

  return { generatedAt, rooms, booked: sorted };
}
