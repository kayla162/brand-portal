import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { site } from "../data/site.js";
import { stay } from "../data/stay.js";
import { transport } from "../data/transport.js";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import TransportCard from "../components/TransportCard.jsx";

/**
 * 交通頁（/transport）
 *
 * 地址從 site.js 讀，導航連結從 stay.js 讀，
 * 這一頁只放「怎麼來」的說明文字，不重複存地址。
 */
export default function TransportPage() {
  useEffect(() => {
    document.title = "交通方式｜和顏悦舍";
  }, []);

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-3xl">
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
          emoji={transport.intro.emoji}
          eyebrow="交通方式"
          title={transport.intro.title}
          description={transport.intro.description}
          titleId="transport-heading"
          level={1}
          className="mt-6"
        />

        {/* 地址 + 導航 */}
        <Reveal>
          <div className="mt-10 rounded-[1.5rem] bg-forest p-6 text-white sm:p-7">
            <p className="text-[0.7rem] font-medium tracking-[0.22em] text-white/50">
              地址
            </p>

            <p className="mt-3 flex items-start gap-2.5 text-[1.05rem] leading-relaxed">
              <MapPin
                size={19}
                strokeWidth={1.75}
                aria-hidden="true"
                className="mt-1 shrink-0 text-white/60"
              />
              {site.contact.address}
            </p>

            <a
              href={stay.location.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-forest transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)]"
            >
              <Navigation size={16} strokeWidth={2} aria-hidden="true" />
              開始導航
            </a>
          </div>
        </Reveal>

        {/* 各種交通方式 */}
        <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:gap-6">
          {transport.routes.map((route, index) => (
            <Reveal key={route.id} delay={index * 80}>
              <TransportCard route={route} />
            </Reveal>
          ))}
        </div>

        {/* 小提醒 */}
        <Reveal>
          <div className="mt-8 rounded-[1.5rem] bg-brass/10 p-6 sm:mt-10 sm:p-7">
            <h2 className="text-lg font-medium">
              <span aria-hidden="true" className="mr-2.5">
                {transport.tip.emoji}
              </span>
              {transport.tip.title}
            </h2>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
              {transport.tip.text}
            </p>
          </div>
        </Reveal>

        {/* 結尾 */}
        <Reveal>
          <div className="mt-12 text-center sm:mt-16">
            <h2 className="font-serif text-2xl font-medium sm:text-3xl">
              <span aria-hidden="true" className="mr-2.5">
                {transport.closing.emoji}
              </span>
              {transport.closing.title}
            </h2>

            <div className="mt-5 space-y-1.5 text-[0.95rem] leading-relaxed text-muted">
              {transport.closing.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
