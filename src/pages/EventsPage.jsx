import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Info } from "lucide-react";
import { events, eventsPage } from "../data/events.js";
import EventCard from "../components/EventCard.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

/**
 * 台東最新活動頁（/events）
 *
 * 活動資訊會過期，所以這一頁的重點是「只顯示還沒結束的活動」：
 * endDate 早於今天的自動隱藏，不用手動刪資料。
 */

/**
 * 取得今天的日期字串，格式 "YYYY-MM-DD"。
 *
 * 這裡刻意不用 toISOString()，因為它會轉成 UTC 時間，
 * 台灣是 UTC+8，晚上八點之後會被算成「昨天」，判斷會差一天。
 */
function getTodayString() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function EventsPage() {
  useEffect(() => {
    document.title = "台東最新活動｜和顏悦舍";
  }, []);

  const today = getTodayString();

  // 只留下還沒結束的活動，再依開始日期由近到遠排序。
  // 日期是 "YYYY-MM-DD" 格式，字串直接比大小就等於比日期。
  const visibleEvents = events
    .filter((event) => event.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

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
          emoji={eventsPage.emoji}
          eyebrow={eventsPage.eyebrow}
          title={eventsPage.title}
          description={eventsPage.description}
          titleId="events-heading"
          level={1}
          className="mt-6"
        />

        {/* 提醒 */}
        <p className="mt-6 flex max-w-2xl items-start gap-2.5 text-[0.875rem] leading-relaxed text-muted">
          <Info
            size={17}
            strokeWidth={1.75}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-brass"
          />
          {eventsPage.note}
        </p>

        {/* 活動卡片 */}
        {visibleEvents.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event, index) => (
              <Reveal key={event.id} delay={index * 80} className="h-full">
                <EventCard
                  event={event}
                  status={event.startDate <= today ? "ongoing" : "upcoming"}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-[1.5rem] bg-surface p-6 text-[0.95rem] text-muted ring-1 ring-black/[0.06] sm:mt-12">
            {eventsPage.emptyText}
          </p>
        )}

        {/* 看完整活動列表 */}
        <Reveal>
          <div className="mt-12 rounded-[1.5rem] bg-brass/10 p-6 sm:mt-14 sm:p-7">
            <h2 className="text-lg font-medium">想看更多台東的活動？</h2>
            <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">
              這裡只整理我們覺得值得推薦的活動。完整的活動列表可以到官方網站查看。
            </p>
            <a
              href={eventsPage.moreLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest-soft"
            >
              {eventsPage.moreLink.label}
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
