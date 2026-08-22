/**
 * 在地體驗卡片（附近景點 / 一日遊 / 交通 / 旅遊資訊）。
 * 資料來自 src/data/experiences.js。
 */
export default function ExperienceCard({ experience }) {
  const { emoji, title, description } = experience;

  return (
    <article className="h-full rounded-[1.5rem] bg-surface p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_48px_-24px_rgba(16,24,40,0.22)]">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/8 text-2xl"
      >
        {emoji}
      </span>

      <h3 className="mt-5 text-lg font-medium">{title}</h3>

      <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
        {description}
      </p>
    </article>
  );
}
