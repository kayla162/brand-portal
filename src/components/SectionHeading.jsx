/**
 * 區塊標題（小標籤 + 主標題 + 說明）。
 * 首頁、度假小屋頁、美食地圖頁、附近景點頁都用同一個，
 * 避免每個區塊重複寫一次一樣的樣式。
 *
 * level：
 *   2（預設）→ 用 <h2>，適合頁面中的其中一個區塊
 *   1        → 用 <h1>，適合整個頁面的主標題（子頁面用這個）
 *
 * 其他欄位都可以不給：沒給就不會顯示。
 */
export default function SectionHeading({
  emoji,
  eyebrow,
  title,
  description,
  titleId,
  level = 2,
  className = "",
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? (
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-brass">
          {eyebrow}
        </p>
      ) : null}

      <Heading
        id={titleId}
        className={`text-3xl font-medium sm:text-[2.5rem] ${eyebrow ? "mt-3" : ""}`}
      >
        {emoji ? (
          <span aria-hidden="true" className="mr-3">
            {emoji}
          </span>
        ) : null}
        {title}
      </Heading>

      {description ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
