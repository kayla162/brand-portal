import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { site } from "../data/site.js";
import Logo from "./Logo.jsx";

/**
 * 網站頁首：Logo + 品牌名稱 + 品牌標語。
 * 在最上方時是透明的（讓 Hero 漸層完整露出），一往下捲就變成毛玻璃。
 *
 * 右邊的導覽會看目前在哪一頁：
 *   首頁 → 顯示「品牌一覽」，捲到卡片區
 *   其他頁 → 顯示「回首頁」
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass =
    "group inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink transition-colors duration-300 hover:text-forest sm:px-4";

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
        <Link
          to="/"
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
        </Link>

        {/* 品牌標語（空間夠才顯示） */}
        <p className="ml-2 hidden border-l border-hairline pl-5 text-sm text-muted md:block">
          {site.tagline}
        </p>

        {/* 導覽 */}
        <nav aria-label="主要導覽" className="ml-auto">
          {isHomePage ? (
            <a href="#brands" className={navLinkClass}>
              品牌一覽
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            </a>
          ) : (
            <Link to="/" className={navLinkClass}>
              回首頁
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
