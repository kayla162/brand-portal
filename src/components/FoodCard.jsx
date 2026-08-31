import { MapPin, Star } from "lucide-react";
import { foodCategories } from "../data/food.js";

/**
 * 美食店家卡片。
 * 度假小屋頁的「度假小屋主人推薦」和美食地圖頁都用這一個元件。
 *
 * 版面與 AttractionCard（附近景點卡片）一致：
 * 分類圖示 + 最推薦標籤 → 店名 → 介紹 → 查看地圖。
 *
 * 刻意不放照片：這些都是真實店家，用示意圖會誤導。
 *
 * 資料來自 src/data/food.js，這個元件只負責顯示。
 */
export default function FoodCard({ shop }) {
  const { name, category, description, highlight, mapUrl } = shop;

  // 從分類代號找出要顯示的圖示與名稱
  const categoryInfo = foodCategories.find((item) => item.id === category);

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] bg-surface p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_48px_-24px_rgba(16,24,40,0.22)] focus-within:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest/8 text-2xl"
        >
          {categoryInfo?.emoji}
        </span>

        {highlight ? (
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

      <h3 className="mt-5 text-lg font-medium">
        {/* 圖示是裝飾性的，分類名稱留給螢幕閱讀器 */}
        {categoryInfo ? (
          <span className="sr-only">{categoryInfo.label}：</span>
        ) : null}
        {name}
      </h3>

      <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-muted">
        {description}
      </p>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`在 Google 地圖查看 ${name}`}
        className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-forest/8 px-4 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
      >
        <MapPin size={16} strokeWidth={2} aria-hidden="true" />
        查看地圖
      </a>
    </article>
  );
}
