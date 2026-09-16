/**
 * ============================================================================
 *  活動「進行中」的純邏輯（不碰網路、不碰檔案，方便用 node:test 驗）
 * ----------------------------------------------------------------------------
 *  這一段本來是交給 TDX 用 $filter 在伺服器端算的，2026/9/9 起 TDX 只要
 *  $filter 裡出現 StartDateTime / EndDateTime 的時間比較就回 HTTP 500，
 *  整支腳本因此中止。改成抓回來自己算：臺東縣的活動總共才一百多筆，
 *  一次就抓得完，也不必再依賴對方那個會壞的條件。
 * ============================================================================
 */

const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * 台北時區的今天，格式 "YYYY-MM-DD"。
 *
 * ⚠️ 不能用 new Date().getFullYear() / getHours() 這種本機時間的寫法：
 *    GitHub Actions 的 runner 是 UTC，台灣早上 5 點跑的時候那邊還是前一天，
 *    算出來的「今天」會整整差 8 小時，昨天結束的活動會多留一天。
 *    台灣沒有日光節約時間，固定 +8 小時再取 UTC 的日期就是台北的日期。
 */
export function taipeiToday(now = new Date()) {
  return new Date(now.getTime() + TAIPEI_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * 這筆活動在 today 當天是否進行中。
 *
 * 頭尾兩天都算進行中：活動辦到 9/16 結束，9/16 當天整天都還看得到，
 * 跟網站端 EventsPage 的 endDate >= today 是同一套判斷，兩邊不會打架。
 */
export function isOngoing(event, today) {
  const { startDate, endDate } = event;
  if (!startDate || !endDate) return false;

  // 日期都是 "YYYY-MM-DD"，字串直接比大小就等於比日期
  return startDate <= today && endDate >= today;
}
