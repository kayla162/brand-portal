import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, MapPin, Navigation } from "lucide-react";
import { businesses } from "../data/businesses.js";
import { experiences } from "../data/experiences.js";
import { foodShops } from "../data/food.js";
import { site } from "../data/site.js";
import { stay } from "../data/stay.js";
import ExperienceCard from "../components/ExperienceCard.jsx";
import FoodCard from "../components/FoodCard.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import SocialLinks from "../components/SocialLinks.jsx";

/**
 * 度假小屋頁（/stay）
 *
 * 定位不是「度假小屋介紹頁」，而是「體驗中心」：
 *   Hero → 度假小屋主人推薦 → 美食地圖入口 → 在地體驗 → 我們的位置
 */
export default function StayPage() {
  // 度假小屋的名稱與訂房連結都來自 businesses.js，不在這裡重複寫一次
  const hotel = businesses.find((business) => business.type === "stay");

  // 只顯示標記為 featured 的店家；完整清單在美食地圖頁
  const recommendedShops = foodShops.filter((shop) => shop.featured);

  useEffect(() => {
    document.title = `${hotel.name}｜住進來，開始探索這座城市`;
  }, [hotel.name]);

  return (
    <>
      {/* ==================== Hero ==================== */}
      <section className="relative isolate overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#FDFCFA_0%,#FBF9F6_55%,#F4F1EA_100%)]" />
          <div className="animate-drift absolute -left-[16%] top-[-16%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(30,59,51,0.15),transparent_65%)] blur-2xl" />
          <div className="animate-drift-slow absolute -right-[12%] top-[28%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(169,131,78,0.14),transparent_65%)] blur-2xl" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* 文字 */}
          <div>
            <p className="animate-rise text-[0.7rem] font-medium tracking-[0.24em] text-brass">
              {hotel.category}
            </p>

            <h1
              className="animate-rise mt-3 text-[2.25rem] font-medium leading-[1.15] sm:text-5xl lg:text-[3.5rem]"
              style={{ animationDelay: "100ms" }}
            >
              <span aria-hidden="true" className="mr-3">
                {stay.hero.emoji}
              </span>
              {hotel.name}
            </h1>

            <p
              className="animate-rise mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
              style={{ animationDelay: "200ms" }}
            >
              {stay.hero.subtitle}
            </p>

            {/* 主要 CTA：導向外部訂房網站 */}
            <div
              className="animate-rise mt-9 flex flex-wrap items-center gap-x-3 gap-y-4"
              style={{ animationDelay: "300ms" }}
            >
              <a
                href={hotel.links.booking}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${stay.hero.ctaLabel}：${hotel.name}`}
                className="group/cta inline-flex min-h-12 items-center gap-2.5 rounded-full bg-forest px-7 py-3 text-[0.95rem] font-medium text-white transition-[translate,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-[0_14px_28px_-12px_rgba(30,59,51,0.75)]"
              >
                <CalendarCheck size={18} strokeWidth={2} aria-hidden="true" />
                {stay.hero.ctaLabel}
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                />
              </a>

              <SocialLinks links={hotel.links} label={hotel.name} />
            </div>
          </div>

          {/* 照片 */}
          <div
            className="animate-rise overflow-hidden rounded-[1.75rem] bg-forest/10 ring-1 ring-black/[0.06] shadow-[0_24px_60px_-28px_rgba(16,24,40,0.4)]"
            style={{ animationDelay: "180ms" }}
          >
            <div className="aspect-video">
              <img
                src={hotel.image}
                alt={hotel.imageAlt ?? hotel.name}
                width={1280}
                height={720}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 度假小屋主人推薦 ==================== */}
      <section
        aria-labelledby="recommend-heading"
        className="px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              emoji={stay.recommend.emoji}
              title={stay.recommend.title}
              description={stay.recommend.subtitle}
              titleId="recommend-heading"
            />
          </Reveal>

          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedShops.map((shop, index) => (
              <Reveal key={shop.id} delay={index * 100} className="h-full">
                <FoodCard shop={shop} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 美食地圖入口 ==================== */}
      <section
        aria-labelledby="food-map-entry-heading"
        className="px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-forest px-6 py-12 text-center sm:px-12 sm:py-16">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(169,131,78,0.35),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(143,191,168,0.25),transparent_55%)]"
              />

              <h2
                id="food-map-entry-heading"
                className="text-3xl font-medium text-white sm:text-[2.5rem]"
              >
                <span aria-hidden="true" className="mr-3">
                  {stay.foodMapEntry.emoji}
                </span>
                {stay.foodMapEntry.title}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/70 sm:text-base">
                {stay.foodMapEntry.description}
              </p>

              <Link
                to="/food-map"
                className="group/cta mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white px-7 py-3 text-[0.95rem] font-medium text-forest transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(0,0,0,0.5)]"
              >
                <span aria-hidden="true">{stay.foodMapEntry.emoji}</span>
                {stay.foodMapEntry.ctaLabel}
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== 在地體驗 ==================== */}
      <section
        aria-labelledby="experience-heading"
        className="px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              emoji={stay.experience.emoji}
              title={stay.experience.title}
              description={stay.experience.subtitle}
              titleId="experience-heading"
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((experience, index) => (
              <Reveal key={experience.id} delay={index * 90} className="h-full">
                <ExperienceCard experience={experience} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 我們的位置 ==================== */}
      <section
        aria-labelledby="location-heading"
        className="px-5 pb-24 sm:px-8 sm:pb-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-[1.75rem] bg-surface p-7 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-22px_rgba(16,24,40,0.16)] sm:p-10">
              <SectionHeading
                emoji={stay.location.emoji}
                title={stay.location.title}
                titleId="location-heading"
              />

              <p className="mt-5 flex items-start gap-2.5 text-[0.95rem] text-muted">
                <MapPin
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-forest"
                />
                <span>
                  <span className="sr-only">地址：</span>
                  {site.contact.address}
                </span>
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={stay.location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest-soft"
                >
                  <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                  查看地圖
                </a>

                <a
                  href={stay.location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest/8 px-5 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
                >
                  <Navigation size={16} strokeWidth={2} aria-hidden="true" />
                  開始導航
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
