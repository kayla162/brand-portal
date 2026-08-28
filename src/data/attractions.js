/**
 * ============================================================================
 *  附近景點（/attractions 頁面）
 * ----------------------------------------------------------------------------
 *  欄位說明：
 *    id          唯一代號
 *    name        景點名稱
 *    group       所屬分組代號，必須是下面 attractionGroups 其中一個的 id
 *    emoji       名稱前面的小圖示
 *    highlight   true 會顯示「最推薦」標籤（原本清單裡標 ⭐⭐⭐⭐⭐ 的景點）
 *    description 推薦理由
 *    mapUrl      Google Maps 連結（外部網址，不需要 API 金鑰）
 *                如果打開後找到的地點不對，直接改這裡的網址即可
 * ============================================================================
 */

/** 分組。顯示順序就是這個陣列的順序。 */
export const attractionGroups = [
  { id: "nearby", emoji: "🌿", title: "最靠近、最推薦" },
  { id: "seaside", emoji: "🌊", title: "往海邊走" },
  { id: "heritage", emoji: "🏛️", title: "很值得特別去的景點" },
  { id: "further", emoji: "🚗", title: "如果願意開遠一點" },
];

export const attractions = [
  // ---------- 🌿 最靠近、最推薦 ----------
  {
    id: "jingang-boulevard",
    name: "金剛大道",
    group: "nearby",
    emoji: "🌾",
    highlight: true,
    description:
      "這裡是離度假小屋最近、最值得去的景點之一。筆直的東 13 線穿過長光部落與農田，視野可以看到梯田、山景與太平洋，很適合清晨或傍晚拍照。",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=金剛大道 台東長濱",
  },
  {
    id: "changguang-terrace",
    name: "長光梯田",
    group: "nearby",
    emoji: "🌾",
    highlight: true,
    description:
      "如果喜歡自然景色，建議把它跟金剛大道排在一起。這一帶就是長濱非常有代表性的山海梯田景觀。",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=長光梯田 台東長濱",
  },
  {
    id: "zhongyong-bikeway",
    name: "忠勇社區自行車道",
    group: "nearby",
    emoji: "🚲",
    highlight: false,
    description: "很適合慢慢騎、散步看田野與山海景色的路線。",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=忠勇社區自行車道 台東長濱",
  },
  {
    id: "jingang-pavilion",
    name: "金剛望海亭",
    group: "nearby",
    emoji: "🌊",
    highlight: false,
    description: "適合單純想找個地方看太平洋、吹海風。可以和金剛大道一起安排。",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=金剛望海亭 台東長濱",
  },

  // ---------- 🌊 往海邊走 ----------
  {
    id: "lovers-beach",
    name: "長濱情人沙灘",
    group: "seaside",
    emoji: "🏖️",
    highlight: false,
    description:
      "適合看海、散步、拍照。和金剛大道、長光遺址、八仙洞都在同一個長濱沿海景點群。",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=長濱情人沙灘 台東長濱",
  },
  {
    id: "baxiandong-beach",
    name: "八仙洞海灘",
    group: "seaside",
    emoji: "🏖️",
    highlight: false,
    description: "如果想找比較原始的東海岸海景，可以順路去看看。",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=八仙洞海灘 台東長濱",
  },
  {
    id: "zhangyuan-bridge",
    name: "樟原橋休憩區",
    group: "seaside",
    emoji: "🌉",
    highlight: false,
    description: "比較偏向「開車途中停一下、看看海岸景色」的景點。",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=樟原橋休憩區 台東長濱",
  },

  // ---------- 🏛️ 很值得特別去的景點 ----------
  {
    id: "baxiandong",
    name: "八仙洞",
    group: "heritage",
    emoji: "🕳️",
    highlight: true,
    description:
      "最推薦一定要去。這裡不只是海蝕洞，也是著名的長濱文化考古遺址。海岸山壁上的海蝕洞非常特殊，考古發現也讓八仙洞成為台灣重要的史前遺址。",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=八仙洞 台東長濱",
  },
  {
    id: "changguang-site",
    name: "長光遺址",
    group: "heritage",
    emoji: "🏺",
    highlight: false,
    description:
      "如果對原住民文化、史前文化有興趣，可以順路安排。長濱除了八仙洞之外，忠勇、長光一帶也有史前文物與遺址。",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=長光遺址 台東長濱",
  },

  // ---------- 🚗 如果願意開遠一點 ----------
  {
    id: "sanxiantai",
    name: "三仙台",
    group: "further",
    emoji: "🌉",
    highlight: true,
    description:
      "如果有開車，很推薦排進行程。八拱跨海步橋、海岸岩石與太平洋景觀都很有代表性。",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=三仙台 台東",
  },
  {
    id: "east-coast-lookout",
    name: "東部海岸國家風景區瞭望台",
    group: "further",
    emoji: "🔭",
    highlight: false,
    description: "位於長濱寧埔一帶，適合跟沿海公路一起安排。",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=東部海岸國家風景區瞭望台 台東長濱寧埔",
  },
];

export default attractions;
