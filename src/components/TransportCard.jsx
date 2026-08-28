import { Star } from "lucide-react";
import RouteSteps from "./RouteSteps.jsx";

/**
 * 交通路線卡片（從玉里 / 花蓮 / 台東 / 機場來、自己開車）。
 * 資料來自 src/data/transport.js，這個元件只負責顯示。
 */
export default function TransportCard({ route }) {
  const { emoji, title, recommended, steps, alongTheWay, notes } = route;

  return (
    <article className="rounded-[1.5rem] bg-surface p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_48px_-24px_rgba(16,24,40,0.22)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium sm:text-xl">
          <span aria-hidden="true" className="mr-2.5">
            {emoji}
          </span>
          {title}
        </h2>

        {recommended ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brass/12 px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.1em] text-brass">
            <Star
              size={13}
              strokeWidth={2}
              aria-hidden="true"
              className="fill-brass"
            />
            最推薦
          </span>
        ) : null}
      </div>

      {steps.length > 0 ? (
        <div className="mt-5">
          <RouteSteps steps={steps} />
        </div>
      ) : null}

      {alongTheWay ? (
        <div className="mt-5">
          <p className="text-[0.7rem] font-medium tracking-[0.22em] text-brass">
            沿途可以順遊
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {alongTheWay.map((place) => (
              <li
                key={place}
                className="rounded-full bg-brass/10 px-3 py-1.5 text-[0.85rem] text-ink"
              >
                {place}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {notes.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {notes.map((note) => (
            <li
              key={note}
              className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-muted"
            >
              <span aria-hidden="true" className="mt-px shrink-0">
                💡
              </span>
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
