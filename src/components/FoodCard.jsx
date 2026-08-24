import { MapPin, Star } from "lucide-react";
import { foodCategories } from "../data/food.js";

/**
 * 美食店家卡片。
 * 度假小屋頁的「度假小屋主人推薦」和美食地圖頁都用這一個元件。
 *
 * 資料來自 src/data/food.js，這個元件只負責顯示。
 */
export default function FoodCard({ shop }) {
  const { name, category, description, rating, distance, image, imageAlt, mapUrl } = shop;

  // 從分類代號找出要顯示的中文標籤與圖示
  const categoryInfo = foodCategories.find((item) => item.id === category);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-surface p-2.5 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_32px_54px_-24px_rgba(16,24,40,0.26)] focus-within:-translate-y-1.5">
      {/* 圖片：統一 16:9，不變形 */}
      <div className="relative overflow-hidden rounded-[1.15rem] bg-forest/10">
        <div className="aspect-video">
          <img
            src={image}
            alt={imageAlt ?? name}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </div>

        {categoryInfo ? (
          <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.1em] text-ink ring-1 ring-black/[0.06] backdrop-blur-sm">
            <span aria-hidden="true">{categoryInfo.emoji}</span>
            {categoryInfo.label}
          </span>
        ) : null}
      </div>

      {/* 文字內容 */}
      <div className="flex flex-1 flex-col px-3.5 pb-2.5 pt-5">
        <h3 className="text-lg font-medium">{name}</h3>

        {/* 評價與距離 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.85rem] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Star
              size={15}
              strokeWidth={2}
              aria-hidden="true"
              className="fill-brass text-brass"
            />
            <span className="sr-only">Google 評價</span>
            {rating}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">與度假小屋的距離</span>
            {distance}
          </span>
        </div>

        <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">
          {description}
        </p>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`在 Google 地圖查看 ${name}`}
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-forest/8 px-4 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
        >
          <MapPin size={16} strokeWidth={2} aria-hidden="true" />
          查看地圖
        </a>
      </div>
    </article>
  );
}
