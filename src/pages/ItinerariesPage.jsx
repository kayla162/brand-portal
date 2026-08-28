import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { itineraries } from "../data/itineraries.js";
import ItineraryCard from "../components/ItineraryCard.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

/**
 * 半日遊 / 一日遊 行程頁（/itineraries）
 *
 * 行程內容比較長，所以用單欄滿版卡片，讀起來像一份行程建議，
 * 不像景點那樣做成多欄格狀。
 */
export default function ItinerariesPage() {
  useEffect(() => {
    document.title = "半日遊・一日遊｜和顏悦舍";
  }, []);

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-4xl">
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
          emoji="🌄"
          eyebrow="度假小屋主人推薦"
          title="半日遊・一日遊"
          description="四條從度假小屋出發的路線，從半天的輕鬆拍照，到整天的縱谷深度行程。"
          titleId="itineraries-heading"
          level={1}
          className="mt-6"
        />

        {/* 行程卡片 */}
        <div className="mt-12 flex flex-col gap-6 sm:mt-14 sm:gap-8">
          {itineraries.map((itinerary, index) => (
            <Reveal key={itinerary.id} delay={index * 90}>
              <ItineraryCard itinerary={itinerary} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
