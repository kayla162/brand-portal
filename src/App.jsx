import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import FoodMapPage from "./pages/FoodMapPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import StayPage from "./pages/StayPage.jsx";

/**
 * 網站外框：每一頁共用的 Header 與 Footer 放這裡，
 * 中間的 <Routes> 決定要顯示哪一頁。
 *
 * 要新增頁面時，只要在下面多加一行 <Route>，
 * 再到 src/pages/ 建立對應的頁面元件即可。
 */
export default function App() {
  return (
    <div id="top" className="min-h-dvh bg-canvas">
      <ScrollToTop />

      {/* 鍵盤使用者的跳過導覽連結：用 Tab 進入頁面時才會出現 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        跳至主要內容
      </a>

      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stay" element={<StayPage />} />
          <Route path="/food-map" element={<FoodMapPage />} />
          {/* 網址打錯時顯示首頁 */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
