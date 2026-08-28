import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * 在地體驗卡片（附近景點 / 一日遊 / 交通 / 旅遊資訊）。
 * 資料來自 src/data/experiences.js。
 *
 * 資料裡有 link 就會在卡片下方出現「查看」連結；沒有就只顯示文字。
 * 之後做好「一日遊」「交通」等子頁面時，只要在資料裡補上 link 即可。
 */
export default function ExperienceCard({ experience }) {
  const { emoji, title, description, link } = experience;

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] bg-surface p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_48px_-24px_rgba(16,24,40,0.22)] focus-within:-translate-y-1">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/8 text-2xl"
      >
        {emoji}
      </span>

      <h3 className="mt-5 text-lg font-medium">{title}</h3>

      <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-muted">
        {description}
      </p>

      {link ? (
        <Link
          to={link}
          aria-label={`查看${title}`}
          className="group/cta mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-forest/8 px-4 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
        >
          查看
          <ArrowRight
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
          />
        </Link>
      ) : null}
    </article>
  );
}
