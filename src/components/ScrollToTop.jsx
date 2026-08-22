import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 換頁時自動捲回頁面最上方。
 *
 * React Router 切換頁面時不會自己捲動，
 * 沒有這個元件的話：在民宿頁滑到最下面點「探索美食地圖」，
 * 新頁面會停在中間，看起來像壞掉。
 *
 * 這個元件不顯示任何東西，只負責這件事。
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
