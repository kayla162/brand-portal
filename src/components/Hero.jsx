import { ChevronDown, Sparkles } from "lucide-react";
import { site } from "../data/site.js";

/**
 * 首頁 Hero 區：主標題、副標題、向下捲動提示。
 * 背景由多層柔和漸層 + 兩顆緩慢飄移的光暈組成（不使用大圖，載入快）。
 */
export default function Hero() {
  const { eyebrow, title, subtitle, scrollLabel } = site.hero;

  return (
    <section
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:min-h-[92svh]"
    >
      {/* ---------- 背景裝飾（純視覺，對輔助科技隱藏） ---------- */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* 底層漸層 */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FDFCFA_0%,#FBF9F6_45%,#F4F1EA_100%)]" />
        {/* 墨綠光暈 */}
        <div className="animate-drift absolute -left-[18%] top-[-12%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(30,59,51,0.16),transparent_65%)] blur-2xl" />
        {/* 黃銅光暈 */}
        <div className="animate-drift-slow absolute -right-[14%] top-[22%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(169,131,78,0.16),transparent_65%)] blur-2xl" />
        {/* 細緻網格，增加質感層次 */}
        <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,rgba(30,59,51,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,59,51,0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
        {/* 底部收邊，銜接下方卡片區 */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#FBF9F6)]" />
      </div>

      <div className="mx-auto w-full max-w-3xl text-center">
        {/* 小標籤 */}
        <p className="animate-rise inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[0.7rem] font-medium tracking-[0.24em] text-forest ring-1 ring-forest/12 backdrop-blur-sm">
          <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
          {eyebrow}
        </p>

        {/* 主標題 */}
        <h1
          className="animate-rise mt-7 text-[2.5rem] font-medium leading-[1.15] sm:text-6xl lg:text-[4.25rem]"
          style={{ animationDelay: "120ms" }}
        >
          {title}
        </h1>

        {/* 副標題 */}
        <p
          className="animate-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "240ms" }}
        >
          {subtitle}
        </p>

        {/* 向下捲動提示 */}
        <div
          className="animate-rise mt-14 flex justify-center sm:mt-16"
          style={{ animationDelay: "380ms" }}
        >
          <a
            href="#brands"
            className="group inline-flex min-h-11 flex-col items-center gap-2 rounded-full px-4 text-[0.7rem] font-medium tracking-[0.24em] text-muted transition-colors duration-300 hover:text-forest"
          >
            {scrollLabel}
            <span className="animate-nudge flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-forest/15 transition-colors duration-300 group-hover:bg-forest group-hover:text-white group-hover:ring-forest">
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
