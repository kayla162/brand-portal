import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

/**
 * 活動卡片。
 * 版面與附近景點、美食店家一致：圖示 + 狀態標籤 → 名稱 → 日期地點 → 介紹 → 按鈕。
 *
 * status 由 EventsPage 算好後傳進來（"ongoing" 進行中 / "upcoming" 即將登場），
 * 這個元件只負責顯示，不做日期判斷。
 */

/** 把 "2026-10-05" 顯示成 "2026/10/05" */
function formatDate(isoDate) {
  return isoDate.replaceAll("-", "/");
}

const STATUS_STYLES = {
  ongoing: { label: "進行中", className: "bg-forest text-white" },
  upcoming: { label: "即將登場", className: "bg-brass/12 text-brass" },
};

export default function EventCard({ event, status }) {
  const { name, startDate, endDate, location, description, link, mapUrl } = event;

  const statusInfo = STATUS_STYLES[status] ?? STATUS_STYLES.upcoming;

  // 只有一天的活動就不顯示「起 ～ 迄」
  const dateText =
    startDate === endDate
      ? formatDate(startDate)
      : `${formatDate(startDate)} － ${formatDate(endDate)}`;

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] bg-surface p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_48px_-24px_rgba(16,24,40,0.22)] focus-within:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest/8 text-2xl"
        >
          🎪
        </span>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.1em] ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <h2 className="mt-5 text-lg font-medium">{name}</h2>

      {/* 日期與地點 */}
      <div className="mt-3 space-y-2 text-[0.85rem] text-muted">
        <p className="flex items-start gap-2">
          <CalendarDays
            size={15}
            strokeWidth={1.75}
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          />
          <span>
            <span className="sr-only">活動日期：</span>
            {dateText}
          </span>
        </p>

        {location ? (
          <p className="flex items-start gap-2">
            <MapPin
              size={15}
              strokeWidth={1.75}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            <span>
              <span className="sr-only">地點：</span>
              {location}
            </span>
          </p>
        ) : null}
      </div>

      <p className="mt-3.5 flex-1 text-[0.9rem] leading-relaxed text-muted">
        {description}
      </p>

      {/* 按鈕：兩個都是選填，沒填就不會出現 */}
      {link || mapUrl ? (
        <div className="mt-6 flex flex-wrap gap-2.5">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`前往「${name}」活動頁`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-white transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest-soft"
            >
              活動頁
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}

          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`在 Google 地圖查看「${name}」的地點`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest/8 px-4 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
            >
              <MapPin size={16} strokeWidth={2} aria-hidden="true" />
              查看地圖
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
