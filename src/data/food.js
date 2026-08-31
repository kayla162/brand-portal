/**
 * ============================================================================
 *  美食地圖資料（度假小屋主人推薦 + /food-map 頁面共用同一份）
 * ----------------------------------------------------------------------------
 *  必填欄位：
 *    id          唯一代號（英文小寫）
 *    name        店家名稱
 *    category    分類代號，必須是下面 foodCategories 其中一個的 id
 *    mapUrl      Google Maps 連結（外部網址，不需要 API 金鑰）
 *                打開後找到的店不對，直接改這一行即可
 *    featured    true 的店家會出現在度假小屋頁的「度假小屋主人推薦」區
 *
 *  選填欄位（沒有就不會顯示，卡片會自動調整）：
 *    description 一句話推薦理由
 *    rating      Google 評價分數，例如 4.5
 *    distance    與度假小屋的距離，例如「步行 5 分鐘」
 *    image       店家照片（16:9），例如 "/images/food/xxx.jpg"
 *    imageAlt    圖片替代文字（有 image 就一定要填）
 *
 *  ⚠️ 評價與距離請填實際查證過的數字，不要憑印象填。
 *     照片請用自己拍的或店家授權的，不要用網路上抓的。
 * ============================================================================
 */

/** 分類。顯示順序＝這個陣列的順序。 */
export const foodCategories = [
  { id: "breakfast", label: "早餐", emoji: "🥟" },
  { id: "cafe", label: "咖啡與下午茶", emoji: "☕" },
  { id: "homestyle", label: "想吃家常菜", emoji: "🍚" },
  { id: "chef", label: "無菜單料理", emoji: "🐟" },
];

/** 頁面上的提醒文字 */
export const foodNotes = {
  general:
    "長濱的店家多為在地小店，營業時間可能依店家狀況調整，出發前建議先電話或官方社群確認。",
  tip: {
    emoji: "🌊",
    title: "小提醒",
    text: "晚上選擇會比白天少，如果晚上抵達，建議提前吃飯或先詢問店家營業狀況。",
  },
};

/** 用店名 + 台東長濱組 Google Maps 搜尋連結 */
const mapUrl = (name) =>
  `https://www.google.com/maps/search/?api=1&query=${name} 台東長濱`;

export const foodShops = [
  // ---------- 🥟 早餐 ----------
  {
    id: "breakfast-baozi",
    name: "長濱包子店",
    category: "breakfast",
    mapUrl: mapUrl("長濱包子店"),
    featured: true,
  },
  {
    id: "breakfast-xiaoayi",
    name: "小阿姨早餐店",
    category: "breakfast",
    mapUrl: mapUrl("小阿姨早餐店"),
    featured: false,
  },
  {
    id: "breakfast-sinfood",
    name: "sin-food 好食",
    category: "breakfast",
    mapUrl: mapUrl("sin-food 好食"),
    featured: false,
  },
  {
    id: "breakfast-sanjianwu",
    name: "三間屋早餐店",
    category: "breakfast",
    mapUrl: mapUrl("三間屋早餐店"),
    featured: false,
  },
  {
    id: "breakfast-jiazouwan",
    name: "早點加走灣",
    category: "breakfast",
    mapUrl: mapUrl("早點加走灣"),
    featured: false,
  },

  // ---------- ☕ 咖啡與下午茶 ----------
  {
    id: "cafe-huazhai",
    name: "花宅咖啡",
    category: "cafe",
    mapUrl: mapUrl("花宅咖啡"),
    featured: true,
  },
  {
    id: "cafe-zaihaiyifang",
    name: "在海一芳",
    category: "cafe",
    mapUrl: mapUrl("在海一芳"),
    featured: false,
  },
  {
    id: "cafe-judashaonian",
    name: "巨大少年",
    category: "cafe",
    mapUrl: mapUrl("巨大少年"),
    featured: false,
  },

  // ---------- 🍚 想吃家常菜 ----------
  {
    id: "homestyle-xinjia",
    name: "馨家小廚",
    category: "homestyle",
    mapUrl: mapUrl("馨家小廚"),
    featured: true,
  },
  {
    id: "homestyle-hadila",
    name: "哈地喇",
    category: "homestyle",
    mapUrl: mapUrl("哈地喇"),
    featured: false,
  },
  {
    id: "homestyle-luma",
    name: "魯瑪私房菜",
    category: "homestyle",
    mapUrl: mapUrl("魯瑪私房菜"),
    featured: false,
  },
  {
    id: "homestyle-sanxiongdi",
    name: "三兄弟的店",
    category: "homestyle",
    mapUrl: mapUrl("三兄弟的店"),
    featured: false,
  },
  {
    id: "homestyle-chongzi",
    name: "蟲子麵店",
    category: "homestyle",
    mapUrl: mapUrl("蟲子麵店"),
    featured: false,
  },

  // ---------- 🐟 無菜單料理 ----------
  {
    id: "chef-meihao",
    name: "美好時光",
    category: "chef",
    mapUrl: mapUrl("美好時光"),
    featured: false,
  },
  {
    id: "chef-changguang",
    name: "長光食作",
    category: "chef",
    mapUrl: mapUrl("長光食作"),
    featured: false,
  },
  {
    id: "chef-wanjinlai",
    name: "彎進來",
    category: "chef",
    mapUrl: mapUrl("彎進來"),
    featured: false,
  },
  {
    id: "chef-xiaoli",
    name: "小麗廚房",
    category: "chef",
    mapUrl: mapUrl("小麗廚房"),
    featured: false,
  },
  {
    id: "chef-musen",
    name: "沐森海岸",
    category: "chef",
    mapUrl: mapUrl("沐森海岸"),
    featured: false,
  },
  {
    id: "chef-yigeng",
    name: "一耕食堂",
    category: "chef",
    mapUrl: mapUrl("一耕食堂"),
    featured: false,
  },
  {
    id: "chef-changbin100",
    name: "長濱100號",
    category: "chef",
    mapUrl: mapUrl("長濱100號"),
    featured: false,
  },
  {
    id: "chef-chicaopu",
    name: "齒草埔料理人的家",
    category: "chef",
    mapUrl: mapUrl("齒草埔料理人的家"),
    featured: false,
  },
  {
    id: "chef-liai",
    name: "里艾廚房",
    category: "chef",
    mapUrl: mapUrl("里艾廚房"),
    featured: false,
  },
  {
    id: "chef-yeyue",
    name: "夜月",
    category: "chef",
    mapUrl: mapUrl("夜月"),
    featured: false,
  },
];

export default foodShops;
