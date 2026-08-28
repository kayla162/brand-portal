import { Clock, Map, TriangleAlert } from "lucide-react";
import { itineraryTypes } from "../data/itineraries.js";
import RouteSteps from "./RouteSteps.jsx";

/**
 * 行程建議卡片（半日遊 / 一日遊）。
 *
 * 路線用一連串「站點」呈現，會自動換行，手機上也讀得順。
 * 資料來自 src/data/itineraries.js，這個元件只負責顯示。
 */
export default function ItineraryCard({ itinerary }) {
  const { type, title, suitableFor, duration, stops, note, warning, mapUrl } =
    itinerary;

  const typeInfo = itineraryTypes[type] ?? itineraryTypes.half;

  return (
    <article className="rounded-[1.75rem] bg-surface p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-22px_rgba(16,24,40,0.14)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_32px_56px_-26px_rgba(16,24,40,0.24)] focus-within:-translate-y-1 sm:p-8">
      {/* 類型標籤 + 總時間 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-[0.7rem] font-medium tracking-[0.14em] text-white">
          <span aria-hidden="true">{typeInfo.emoji}</span>
          {typeInfo.label}
        </span>

        {duration ? (
          <span className="inline-flex items-center gap-1.5 text-[0.85rem] text-muted">
            <Clock size={15} strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">預估總時間</span>
            {duration}
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 text-xl font-medium sm:text-2xl">{title}</h2>

      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">
        <span className="font-medium text-ink">適合：</span>
        {suitableFor}
      </p>

      {/* 路線 */}
      <div className="mt-6 border-t border-hairline pt-5">
        <RouteSteps steps={stops} />
      </div>

      {/* 補充說明 */}
      {note ? (
        <p className="mt-5 flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-px shrink-0">
            💡
          </span>
          {note}
        </p>
      ) : null}

      {/* 出發前注意 */}
      {warning ? (
        <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-brass/10 p-4 text-[0.875rem] leading-relaxed text-ink">
          <TriangleAlert
            size={17}
            strokeWidth={2}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-brass"
          />
          <span>
            <span className="sr-only">出發前注意：</span>
            {warning}
          </span>
        </p>
      ) : null}

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`在 Google 地圖開啟「${title}」的路線`}
        className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-forest/8 px-4 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
      >
        <Map size={16} strokeWidth={2} aria-hidden="true" />
        在 Google 地圖開啟路線
      </a>
    </article>
  );
}
