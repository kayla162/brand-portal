/**
 * ============================================================================
 *  在地體驗（度假小屋頁「🗺️ 在地體驗」區塊）
 * ----------------------------------------------------------------------------
 *  想增加或刪除項目，直接改這個陣列，ExperienceCard 會自動跟著變。
 *
 *  欄位說明：
 *    id          唯一代號
 *    emoji       卡片上的圖示
 *    title       標題
 *    description 一句話說明
 *    link        （選填）站內頁面網址。有填的話卡片下方會出現「查看」連結
 * ============================================================================
 */

export const experiences = [
  {
    id: "attractions",
    emoji: "📍",
    title: "附近景點",
    description: "探索度假小屋附近值得造訪的景點。",
    link: "/attractions",
  },
  {
    id: "day-trip",
    emoji: "🌄",
    title: "一日遊",
    description: "四條路線，從半天輕鬆拍照到整天縱谷深度遊。",
    link: "/itineraries",
  },
  {
    id: "transport",
    emoji: "🚗",
    title: "交通",
    description: "從玉里、花蓮、台東到度假小屋，五種抵達方式。",
    link: "/transport",
  },
  {
    id: "travel-info",
    emoji: "📖",
    title: "旅遊資訊",
    description: "住在度假小屋時需要知道的實用資訊。",
  },
];

export default experiences;
