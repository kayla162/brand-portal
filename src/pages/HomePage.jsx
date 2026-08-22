import { useEffect } from "react";
import BusinessGrid from "../components/BusinessGrid.jsx";
import Hero from "../components/Hero.jsx";

/** 首頁：Hero + 三張品牌卡片。 */
export default function HomePage() {
  useEffect(() => {
    document.title = "和顏悦舍｜官方品牌入口";
  }, []);

  return (
    <>
      <Hero />
      <BusinessGrid />
    </>
  );
}
