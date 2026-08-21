import { useEffect, useRef, useState } from "react";

/**
 * ============================================================================
 *  捲動進場動畫的包裝元件
 * ----------------------------------------------------------------------------
 *  元素進入畫面時淡入 + 向上浮起，只播一次，離開畫面不會倒退。
 *
 *  刻意做成 fail-safe：內容「絕對不會」因為動畫沒觸發而永遠看不見。
 *    1. 掛載時先同步判斷是否已在畫面內 → 直接顯示（不必等 observer，也不會閃一下）
 *    2. 其餘交給 IntersectionObserver
 *    3. 若頁面在背景分頁載入（此時瀏覽器不跑 observer 與 rAF），
 *       等分頁回到前景再重新判斷一次
 *    4. 瀏覽器不支援 IntersectionObserver → 直接顯示
 *
 *  使用者若在系統關閉動畫（prefers-reduced-motion），index.css 會停用過場效果。
 * ============================================================================
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // 已經在畫面內（或視窗很高、一次看到整頁）就立刻顯示
    const isOnScreen = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
    };

    if (isOnScreen()) {
      setVisible(true);
      return;
    }

    // 舊瀏覽器沒有 IntersectionObserver：直接顯示，不要讓內容消失
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const reveal = () => setVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) reveal();
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);

    // 背景分頁載入時瀏覽器不會跑 observer，回到前景時補判斷一次
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && isOnScreen()) reveal();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // 一旦顯示就把 observer 相關的事情忘掉，之後永遠保持可見
  useEffect(() => {
    if (!visible) return;
    const node = ref.current;
    if (node) node.dataset.revealed = "true";
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
