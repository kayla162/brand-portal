import { ArrowRight, BedDouble, Store } from "lucide-react";
import { businessTypes } from "../data/businesses.js";
import SocialLinks from "./SocialLinks.jsx";

/**
 * ============================================================================
 *  可重複使用的品牌卡片
 * ----------------------------------------------------------------------------
 *  只接收一筆 business 資料物件，完全不知道有幾個品牌、也不知道品牌叫什麼。
 *  未來新增賣場只要在 businesses.js 加資料，這個元件不用改。
 *
 *  variant:
 *    'default' 直式卡片（桌機 2 欄的其中一格）
 *    'wide'    橫式卡片（品牌數量為奇數時，最後一張跨滿兩欄，避免右邊留白）
 * ============================================================================
 */

/** 依品牌類型切換標籤樣式與 icon：賣場＝白底黃銅字，民宿＝墨綠實心 */
const TYPE_STYLES = {
  store: {
    Icon: Store,
    badge: "bg-white/92 text-brass ring-1 ring-black/[0.06]",
  },
  stay: {
    Icon: BedDouble,
    badge: "bg-forest text-white ring-1 ring-white/25",
  },
};

export default function BusinessCard({ business, index = 0, variant = "default" }) {
  const {
    name,
    type,
    category,
    description,
    image,
    imageAlt,
    links = {},
    primary,
    primaryLabel = "前往",
  } = business;

  const style = TYPE_STYLES[type] ?? TYPE_STYLES.store;
  const TypeIcon = style.Icon;
  const typeLabel = businessTypes[type]?.label ?? category;

  const isWide = variant === "wide";
  const primaryHref = links[primary] ?? "#";
  const isExternal = /^https?:\/\//i.test(primaryHref);
  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface p-2.5",
        "ring-1 ring-black/[0.06]",
        "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-16px_rgba(16,24,40,0.12)]",
        "transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_36px_60px_-24px_rgba(16,24,40,0.28)]",
        "focus-within:-translate-y-1.5",
        isWide ? "lg:flex-row lg:items-stretch" : "",
      ].join(" ")}
    >
      {/* ---------- 圖片（統一 16:9，object-cover 不變形） ---------- */}
      <div
        className={[
          "relative shrink-0 overflow-hidden rounded-[1.375rem] bg-forest/10",
          isWide ? "lg:w-[54%] lg:self-center" : "",
        ].join(" ")}
      >
        <div className="aspect-video">
          <img
            src={image}
            alt={imageAlt ?? name}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </div>

        {/* 讓標籤與編號在任何圖片上都看得清楚 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent"
        />

        {/* 類型標籤：民宿與賣場使用不同視覺 */}
        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.14em] backdrop-blur-sm ${style.badge}`}
        >
          <TypeIcon size={13} strokeWidth={2} aria-hidden="true" />
          {typeLabel}
        </span>

        {/* 編排感的序號 */}
        <span
          aria-hidden="true"
          className="absolute right-5 top-4 font-serif text-sm tracking-[0.2em] text-white/75"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* ---------- 文字內容 ---------- */}
      <div
        className={[
          "flex flex-1 flex-col px-4 pb-3 pt-6 sm:px-6",
          isWide ? "lg:justify-center lg:px-9 lg:py-8" : "",
        ].join(" ")}
      >
        <p className="text-[0.7rem] font-medium tracking-[0.22em] text-brass">
          {category}
        </p>

        <h3 className="mt-2.5 text-2xl font-medium sm:text-[1.75rem]">
          <a
            href={primaryHref}
            {...externalProps}
            className="rounded-sm transition-colors duration-300 hover:text-forest"
          >
            {name}
          </a>
        </h3>

        <p
          className={[
            "mt-3 text-[0.95rem] leading-relaxed text-muted",
            isWide ? "" : "flex-1",
          ].join(" ")}
        >
          {description}
        </p>

        {/* ---------- 連結區 ---------- */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-hairline pt-4">
          <SocialLinks links={links} label={name} />

          <a
            href={primaryHref}
            {...externalProps}
            aria-label={`${primaryLabel}：${name}`}
            className="group/cta inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white transition-[translate,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest-soft hover:shadow-[0_10px_22px_-10px_rgba(30,59,51,0.75)]"
          >
            {primaryLabel}
            <ArrowRight
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
            />
          </a>
        </div>
      </div>
    </article>
  );
}
