import { businesses } from "../data/businesses.js";
import { site } from "../data/site.js";
import BusinessCard from "./BusinessCard.jsx";
import Reveal from "./Reveal.jsx";

/**
 * 品牌卡片區。
 *
 * 排版規則：
 *   手機 → 單欄
 *   桌機 → 2 欄（2 × 2 網格）
 *   品牌數量為奇數時，最後一張自動跨滿兩欄改成橫式卡片，
 *   右下角就不會出現一塊空白 —— 以後加到 4、5、6 個品牌都不用改程式。
 */
export default function BusinessGrid() {
  const { eyebrow, title, description } = site.brandsSection;
  const isOddCount = businesses.length % 2 === 1;

  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      className="scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* 區塊標題 */}
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] font-medium tracking-[0.24em] text-brass">
            {eyebrow}
          </p>
          <h2
            id="brands-heading"
            className="mt-3 text-3xl font-medium sm:text-[2.5rem]"
          >
            {title}
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        </Reveal>

        {/* 卡片網格 */}
        <div className="mt-12 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-2">
          {businesses.map((business, index) => {
            const isLastAndOdd = isOddCount && index === businesses.length - 1;

            return (
              <Reveal
                key={business.id}
                delay={index * 110}
                className={isLastAndOdd ? "h-full lg:col-span-2" : "h-full"}
              >
                <BusinessCard
                  business={business}
                  index={index}
                  variant={isLastAndOdd ? "wide" : "default"}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
