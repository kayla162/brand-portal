/**
 * ============================================================================
 *  半日遊 / 一日遊 行程建議（/itineraries 頁面）
 * ----------------------------------------------------------------------------
 *  欄位說明：
 *    id          唯一代號
 *    type        'half'（半日遊）或 'full'（一日遊）→ 決定卡片標籤
 *    title       行程名稱
 *    suitableFor 適合什麼樣的人
 *    duration    預估總時間，沒有就留空字串
 *    stops       路線上的每一站 { emoji, name }
 *                第一站與最後一站請保留度假小屋，行程才看得出是從哪裡出發
 *    note        補充說明（顯示為 💡）
 *    warning     出發前要注意的事（顯示為 ⚠️），沒有就設為空字串
 *    mapUrl      Google Maps 路線規劃連結（外部網址，不需要 API 金鑰）
 *                起訖點用度假小屋的座標（文字地址 Google 解析不出來）
 *                waypoints 之間用 | 分隔；地點找錯就直接改這一行
 * ============================================================================
 */

/** 行程類型標籤 */
export const itineraryTypes = {
  half: { label: "半日遊", emoji: "🌤️" },
  full: { label: "一日遊", emoji: "☀️" },
};

export const itineraries = [
  {
    id: "half-a",
    type: "half",
    title: "長濱精華「山海梯田線」",
    suitableFor: "第一次來、想輕鬆拍照，不想一直開車",
    duration: "約 4～5 小時",
    stops: [
      { emoji: "🏡", name: "度假小屋" },
      { emoji: "🚲", name: "忠勇自行車道" },
      { emoji: "🌾", name: "金剛大道" },
      { emoji: "🌾", name: "長光梯田" },
      { emoji: "🌊", name: "金剛望海亭" },
      { emoji: "🏛️", name: "八仙洞" },
      { emoji: "🏡", name: "度假小屋" },
    ],
    note: "八仙洞很值得前往，因為它同時具有海蝕洞地形和重要的長濱文化史前遺址。",
    warning: "",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&origin=23.324271,121.442431&destination=23.324271,121.442431&waypoints=忠勇社區自行車道|金剛大道|長光梯田|金剛望海亭|八仙洞",
  },
  {
    id: "half-b",
    type: "half",
    title: "長濱 → 成功「海岸線攝影」",
    suitableFor: "喜歡海景、拍照、咖啡、慢慢開車",
    duration: "約 4～5 小時",
    stops: [
      { emoji: "🏡", name: "度假小屋" },
      { emoji: "🏛️", name: "八仙洞" },
      { emoji: "🌊", name: "沿台 11 線往成功方向" },
      { emoji: "🏝️", name: "三仙台" },
      { emoji: "🎨", name: "比西里岸部落" },
      { emoji: "☕", name: "海景咖啡" },
      { emoji: "🏡", name: "度假小屋" },
    ],
    note: "三仙台是東海岸最經典的景區之一，環島步道完整走一圈約 2 小時。",
    warning:
      "三仙台八拱橋目前正在整修，官方公告施工期間暫時封閉，預計 2027 年底完工。所以現在比較適合看海岸、岩礁與周邊景觀，不能把「走八拱橋登島」當成主要行程。",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&origin=23.324271,121.442431&destination=23.324271,121.442431&waypoints=八仙洞|長濱海岸|三仙台|比西里岸部落",
  },
  {
    id: "full-a",
    type: "full",
    title: "東海岸經典線",
    suitableFor: "不喜歡山路，沿著台 11 線看太平洋",
    duration: "",
    stops: [
      { emoji: "🏡", name: "度假小屋" },
      { emoji: "🌾", name: "金剛大道" },
      { emoji: "🏛️", name: "八仙洞" },
      { emoji: "🏝️", name: "三仙台／成功" },
      { emoji: "🎨", name: "比西里岸" },
      { emoji: "🪞", name: "都歷海灘" },
      { emoji: "🏭", name: "都蘭新東糖廠" },
      { emoji: "💧", name: "水往上流" },
      { emoji: "🌊", name: "都蘭觀海平台" },
      { emoji: "🏡", name: "度假小屋" },
    ],
    note: "東部海岸國家風景區沿著花蓮、台東海岸線延伸；其中都歷海灘退潮前後還有「天空之鏡」效果。",
    warning: "",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&origin=23.324271,121.442431&destination=23.324271,121.442431&waypoints=金剛大道|八仙洞|三仙台|比西里岸部落|都歷海灘|都蘭新東糖廠|水往上流|都蘭觀海平台",
  },
  {
    id: "full-b",
    type: "full",
    title: "花東縱谷「池上＋玉里」線",
    suitableFor: "想把「花東」也玩進來，這一天會比較累，尤其山路較多",
    duration: "",
    stops: [
      { emoji: "🏡", name: "度假小屋" },
      { emoji: "🏘️", name: "玉里" },
      { emoji: "🌼", name: "六十石山" },
      { emoji: "⛰️", name: "赤科山" },
      { emoji: "🌾", name: "富里" },
      { emoji: "🌾", name: "池上" },
      { emoji: "🛣️", name: "伯朗大道" },
      { emoji: "🏞️", name: "大坡池" },
      { emoji: "🏘️", name: "關山" },
      { emoji: "🏡", name: "度假小屋" },
    ],
    note: "六十石山通常 8～9 月是金針花盛放期，2026 年花季為 8/8～10/11。",
    warning: "這條路線山路較多，比較推薦開汽車。",
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&origin=23.324271,121.442431&destination=23.324271,121.442431&waypoints=玉里|六十石山|赤科山|富里|池上|伯朗大道|大坡池|關山",
  },
];

export default itineraries;
