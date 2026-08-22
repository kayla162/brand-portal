/**
 * 區塊標題（小標籤 + 主標題 + 說明）。
 * 首頁、民宿頁、美食地圖頁都用同一個，避免每個區塊重複寫一次一樣的樣式。
 *
 * 所有欄位都可以不給：沒給就不會顯示。
 */
export default function SectionHeading({
  emoji,
  eyebrow,
  title,
  description,
  titleId,
  className = "",
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? (
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-brass">
          {eyebrow}
        </p>
      ) : null}

      <h2
        id={titleId}
        className={`text-3xl font-medium sm:text-[2.5rem] ${eyebrow ? "mt-3" : ""}`}
      >
        {emoji ? (
          <span aria-hidden="true" className="mr-3">
            {emoji}
          </span>
        ) : null}
        {title}
      </h2>

      {description ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
