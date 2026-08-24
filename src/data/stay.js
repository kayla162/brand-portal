/**
 * ============================================================================
 *  度假小屋頁面（/stay）的文字內容
 * ----------------------------------------------------------------------------
 *  度假小屋的「名稱」與「訂房連結」不放在這裡 —— 那些在 businesses.js，
 *  這樣改訂房網址時只要改一個地方，首頁卡片和度假小屋頁會同時更新。
 * ============================================================================
 */

export const stay = {
  /** Hero 區 */
  hero: {
    emoji: "🏡",
    subtitle: "住進來，開始探索這座城市。",
    ctaLabel: "立即訂房",
  },

  /** 度假小屋主人推薦區 */
  recommend: {
    emoji: "🍜",
    title: "度假小屋主人推薦",
    subtitle: "這些是我們自己也會去吃的店。",
  },

  /** 美食地圖入口區 */
  foodMapEntry: {
    emoji: "🍜",
    title: "探索美食地圖",
    description:
      "從早餐、午餐、晚餐，到咖啡與甜點，探索度假小屋主人推薦的在地美食。",
    ctaLabel: "探索美食地圖",
  },

  /** 在地體驗區 */
  experience: {
    emoji: "🗺️",
    title: "在地體驗",
    subtitle: "住在度假小屋的期間，這些是你可以安排的事。",
  },

  /** 我們的位置 */
  location: {
    emoji: "📍",
    title: "我們的位置",
    /** ← 請改成完整地址（會顯示在頁面上，也用來組 Google Maps 連結） */
    address: "台東縣長濱鄉",
    /** 查看地圖／導航：直接用 Google Maps 的公開網址，不需要 API 金鑰 */
    mapUrl: "https://www.google.com/maps/search/?api=1&query=和顏悦舍",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=和顏悦舍",
  },
};

export default stay;
