import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ============================================================================
 *  空房月曆
 * ----------------------------------------------------------------------------
 *  資料來自 src/data/availability.generated.json（GitHub Actions 每小時更新），
 *  文案與房間清單來自 src/data/availability.js。這個元件只負責顯示。
 *
 *  每一格用「點」而不是文字表示狀態：手機 375px 寬、七欄格線，每格只有約
 *  45px，塞不下「剩 1 間」這種字。點也是語言無關的，日後增加房間只要多一顆點。
 *
 *  手機顯示一個月，桌機並排兩個月（一次看得到更多日期比較好挑）。
 *  切換一次移動一個月，所以桌機上翻頁會有一個月的重疊，這是刻意的。
 *
 *  ⚠️ 顏色與形狀不能是唯一的資訊來源，所以每一格另外給 aria-label，
 *     讓讀屏軟體念得出「10 月 22 日，2 間中剩 1 間」。
 * ============================================================================
 */

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 台灣時間的今天。民宿在台東，不能跟著瀏覽器所在時區跑 */
function taipeiToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

/** 某個月的格線：前面補 null 對齊星期，最後補滿整週 */
function monthCells(year, month) {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isoDate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** 單一個月的格線。桌機會並排兩個 */
function MonthGrid({ year, month, today, rooms, booked, className = "" }) {
  const cells = monthCells(year, month);

  return (
    <div className={className}>
      <p className="text-center font-serif text-lg font-medium sm:text-xl">
        {year} 年 {month + 1} 月
      </p>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label) => (
          <div key={label} className="pb-1 text-[0.7rem] font-medium text-muted">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} />;

          const date = isoDate(year, month, day);
          const past = date < today;
          const bookedRooms = booked[date] ?? [];
          const free = rooms.length - bookedRooms.length;

          return (
            <div
              key={date}
              aria-label={
                past
                  ? `${month + 1} 月 ${day} 日，已過`
                  : `${month + 1} 月 ${day} 日，${rooms.length} 間中剩 ${free} 間`
              }
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl ${
                past
                  ? "text-muted/35"
                  : free === 0
                    ? "bg-forest/[0.04] text-muted"
                    : "bg-forest/8 text-ink"
              }`}
            >
              <span className="text-[0.8rem] font-medium leading-none">{day}</span>

              {past ? null : (
                <span aria-hidden="true" className="flex gap-0.5">
                  {rooms.map((room) => (
                    <span
                      key={room.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        bookedRooms.includes(room.id)
                          ? "ring-1 ring-forest/30"
                          : "bg-forest"
                      }`}
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({ rooms, booked, generatedAt, copy }) {
  const today = useMemo(taipeiToday, []);
  const [thisYear, thisMonth] = today.split("-").map(Number);

  // offset 是「距離當月幾個月」。不提供往回翻 —— 看過去的日期對訂房沒有意義，
  // 還會讓人以為訂得到
  const [offset, setOffset] = useState(0);

  const first = new Date(Date.UTC(thisYear, thisMonth - 1 + offset, 1));
  const second = new Date(Date.UTC(thisYear, thisMonth + offset, 1));

  return (
    <div className="rounded-[1.75rem] bg-surface p-4 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-22px_rgba(16,24,40,0.16)] sm:p-8">
      {/* 導覽按鈕放在月曆「上方」而不是左右兩側。
          手機 375px 扣掉頁面與卡片留白只剩約 295px，若再被兩顆 44px 的按鈕
          夾住，七欄每格只剩 29px，數字加點根本塞不下。 */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOffset((value) => value - 1)}
          disabled={offset === 0}
          aria-label={copy.previousMonth}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest transition duration-300 ease-out hover:bg-forest/8 disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setOffset((value) => value + 1)}
          disabled={offset >= copy.monthsAhead - 1}
          aria-label={copy.nextMonth}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest transition duration-300 ease-out hover:bg-forest/8 disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <MonthGrid
          year={first.getUTCFullYear()}
          month={first.getUTCMonth()}
          today={today}
          rooms={rooms}
          booked={booked}
        />
        <MonthGrid
          year={second.getUTCFullYear()}
          month={second.getUTCMonth()}
          today={today}
          rooms={rooms}
          booked={booked}
          className="hidden lg:block"
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8rem] text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-forest" />
          {copy.legendAvailable}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full ring-1 ring-forest/30" />
          {copy.legendBooked}
        </span>
        <span>
          {rooms.map((room) => room.name).join("、")}　共 {rooms.length} 間
        </span>
      </div>

      <p className="mt-5 text-center text-[0.8rem] leading-relaxed text-muted">
        {copy.updatedPrefix} {generatedAt.slice(0, 16).replace("T", " ")}
        <br />
        {copy.disclaimer}
      </p>
    </div>
  );
}
