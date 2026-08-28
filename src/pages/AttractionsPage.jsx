import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { attractionGroups, attractions } from "../data/attractions.js";
import AttractionCard from "../components/AttractionCard.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

/**
 * 附近景點頁（/attractions）
 *
 * 依 attractions.js 的分組把景點排出來。
 * 沒有篩選按鈕，因為分組本身就是最好讀的排列方式（由近到遠）。
 */
export default function AttractionsPage() {
  useEffect(() => {
    document.title = "附近景點｜和顏悦舍";
  }, []);

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
          emoji="📍"
          eyebrow="度假小屋主人推薦"
          title="附近景點"
          description="從走路就到的金剛大道，到開車一段路的三仙台，依距離由近到遠整理。"
          titleId="attractions-heading"
          level={1}
          className="mt-6"
        />

        {/* 依分組列出景點 */}
        {attractionGroups.map((group) => {
          const groupAttractions = attractions.filter(
            (attraction) => attraction.group === group.id
          );

          if (groupAttractions.length === 0) return null;

          return (
            <div key={group.id} className="mt-14 sm:mt-16">
              <h2 className="text-xl font-medium sm:text-2xl">
                <span aria-hidden="true" className="mr-2.5">
                  {group.emoji}
                </span>
                {group.title}
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {groupAttractions.map((attraction, index) => (
                  <Reveal
                    key={attraction.id}
                    delay={index * 80}
                    className="h-full"
                  >
                    <AttractionCard attraction={attraction} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
