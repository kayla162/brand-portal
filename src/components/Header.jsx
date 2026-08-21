import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "../data/site.js";
import Logo from "./Logo.jsx";

/**
 * 網站頁首：Logo + 品牌名稱 + 品牌標語。
 * 在最上方時是透明的（讓 Hero 漸層完整露出），一往下捲就變成毛玻璃。
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out ${
        scrolled
          ? "border-b border-hairline/70 bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8 sm:py-4">
        {/* Logo + 品牌名稱 */}
        <a
          href="#top"
          className="flex shrink-0 items-center gap-3 rounded-xl"
          aria-label={`${site.brandName} 首頁`}
        >
          <Logo className="h-10 w-10 sm:h-11 sm:w-11" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-medium tracking-wide sm:text-xl">
              {site.brandName}
            </span>
            {site.brandNameLatin ? (
              <span className="mt-1 text-[0.6rem] font-medium tracking-[0.28em] text-muted">
                {site.brandNameLatin}
              </span>
            ) : null}
          </span>
        </a>

        {/* 品牌標語（空間夠才顯示） */}
        <p className="ml-2 hidden border-l border-hairline pl-5 text-sm text-muted md:block">
          {site.tagline}
        </p>

        {/* 導覽 */}
        <nav aria-label="主要導覽" className="ml-auto">
          <a
            href="#brands"
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink transition-colors duration-300 hover:text-forest sm:px-4"
          >
            品牌一覽
            <ArrowRight
              size={15}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </a>
        </nav>
      </div>
    </header>
  );
}
