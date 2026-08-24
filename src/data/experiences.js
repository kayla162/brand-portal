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
 * ============================================================================
 */

export const experiences = [
  {
    id: "attractions",
    emoji: "📍",
    title: "附近景點",
    description: "探索度假小屋附近值得造訪的景點。",
  },
  {
    id: "day-trip",
    emoji: "🌄",
    title: "一日遊",
    description: "幫你安排輕鬆的一日旅行。",
  },
  {
    id: "transport",
    emoji: "🚗",
    title: "交通",
    description: "從車站、機場到度假小屋的交通方式。",
  },
  {
    id: "travel-info",
    emoji: "📖",
    title: "旅遊資訊",
    description: "住在度假小屋時需要知道的實用資訊。",
  },
];

export default experiences;
