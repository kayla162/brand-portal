import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { foodCategories, foodNotes, foodShops } from "../data/food.js";
import FoodCard from "../components/FoodCard.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

/**
 * 美食地圖頁（/food-map）
 *
 * V2 先不做真正的互動地圖，只做「分類 + 店家卡片 + Google Maps 外部連結」。
 *
 * 唯一的狀態就是「目前選了哪個分類」，用最單純的 useState 就夠了，
 * 不需要 Context、reducer 或任何狀態管理套件。
 */
export default function FoodMapPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    document.title = "美食地圖｜和顏悦舍";
  }, []);

  // 選「全部」就顯示全部，否則只留下同分類的店家
  const visibleShops =
    activeCategory === "all"
      ? foodShops
      : foodShops.filter((shop) => shop.category === activeCategory);

  // 篩選按鈕 = 「全部」加上所有分類
  const filterButtons = [
    { id: "all", label: "全部", emoji: "🍽️" },
    ...foodCategories,
  ];

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        {/* 返回度假小屋頁 */}
        <Link
          to="/stay"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium text-muted transition-colors duration-300 hover:text-forest"
        >
          <ArrowLeft
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
          />
          返回度假小屋
        </Link>

        {/* 頁面標題 */}
        <SectionHeading
          emoji="🍜"
          eyebrow="度假小屋主人推薦"
          title="美食地圖"
          description="從早餐、咖啡下午茶，到家常菜與無菜單料理，探索度假小屋主人推薦的在地美食。"
          titleId="food-map-heading"
          level={1}
          className="mt-6"
        />

        {/* 營業時間提醒 */}
        <p className="mt-6 flex max-w-2xl items-start gap-2.5 text-[0.875rem] leading-relaxed text-muted">
          <Info
            size={17}
            strokeWidth={1.75}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-brass"
          />
          {foodNotes.general}
        </p>

        {/* 分類篩選 */}
        <div
          role="group"
          aria-label="美食分類篩選"
          className="mt-9 flex flex-wrap gap-2.5"
        >
          {filterButtons.map((button) => {
            const isActive = activeCategory === button.id;

            return (
              <button
                key={button.id}
                type="button"
                onClick={() => setActiveCategory(button.id)}
                aria-pressed={isActive}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[translate,background-color,color] duration-300 ease-out hover:-translate-y-0.5 ${
                  isActive
                    ? "bg-forest text-white"
                    : "bg-surface text-muted ring-1 ring-black/[0.06] hover:text-forest"
                }`}
              >
                <span aria-hidden="true">{button.emoji}</span>
                {button.label}
              </button>
            );
          })}
        </div>

        {/* 店家卡片 */}
        {visibleShops.length > 0 ? (
          <div
            aria-labelledby="food-map-heading"
            className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleShops.map((shop, index) => (
              <Reveal key={shop.id} delay={index * 80} className="h-full">
                <FoodCard shop={shop} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-[0.95rem] text-muted">
            這個分類還沒有推薦的店家。
          </p>
        )}

        {/* 小提醒 */}
        <Reveal>
          <div className="mt-12 rounded-[1.5rem] bg-brass/10 p-6 sm:mt-14 sm:p-7">
            <h2 className="text-lg font-medium">
              <span aria-hidden="true" className="mr-2.5">
                {foodNotes.tip.emoji}
              </span>
              {foodNotes.tip.title}
            </h2>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
              {foodNotes.tip.text}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
