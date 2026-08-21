import BusinessGrid from "./components/BusinessGrid.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";

/**
 * 首頁組裝層。
 * App.jsx 只負責「把區塊排好」，不放任何內容文字與樣式細節。
 */
export default function App() {
  return (
    <div className="min-h-dvh bg-canvas">
      {/* 鍵盤使用者的跳過導覽連結：用 Tab 進入頁面時才會出現 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        跳至主要內容
      </a>

      <Header />

      <main id="main">
        <Hero />
        <BusinessGrid />
      </main>

      <Footer />
    </div>
  );
}
