/**
 * ============================================================================
 *  美食地圖資料（民宿主人推薦 + /food-map 頁面共用同一份）
 * ----------------------------------------------------------------------------
 *  ⚠️ 目前所有店名、評價、距離都是「範例資料」，請換成真實店家再對外公開。
 *
 *  欄位說明：
 *    id          唯一代號（英文小寫）
 *    name        店家名稱
 *    category    分類代號，必須是下面 foodCategories 其中一個的 id
 *    description 一句話推薦理由
 *    rating      Google 評價分數，例如 4.5
 *    distance    與民宿的距離描述，例如「步行 5 分鐘」
 *    image       圖片路徑（16:9）
 *    imageAlt    圖片替代文字
 *    mapUrl      Google Maps 連結（外部網址，不需要 API 金鑰）
 *    featured    true 的店家會出現在民宿頁的「民宿主人推薦」區
 * ============================================================================
 */

/** 分類。想新增分類（例如「宵夜」）就在這裡加一筆。 */
export const foodCategories = [
  { id: "breakfast", label: "早餐", emoji: "🌅" },
  { id: "lunch", label: "午餐", emoji: "🍜" },
  { id: "dinner", label: "晚餐", emoji: "🍲" },
  { id: "cafe", label: "咖啡", emoji: "☕" },
  { id: "dessert", label: "甜點", emoji: "🍰" },
];

export const foodShops = [
  {
    id: "breakfast-1",
    name: "XXX 早餐店",
    category: "breakfast",
    description: "在地人從小吃到大的古早味，蛋餅一定要加辣。",
    rating: 4.6,
    distance: "步行 3 分鐘",
    image: "/images/food/breakfast-1.jpg",
    imageAlt: "XXX 早餐店的餐點",
    mapUrl: "https://maps.google.com/",
    featured: true,
  },
  {
    id: "breakfast-2",
    name: "XXX 豆漿店",
    category: "breakfast",
    description: "現磨豆漿配燒餅油條，六點就開，早起才吃得到。",
    rating: 4.4,
    distance: "開車 5 分鐘",
    image: "/images/food/breakfast-2.jpg",
    imageAlt: "XXX 豆漿店的早餐",
    mapUrl: "https://maps.google.com/",
    featured: false,
  },
  {
    id: "lunch-1",
    name: "XXX 牛肉麵",
    category: "lunch",
    description: "第一次來這裡，我們最推薦這家。",
    rating: 4.5,
    distance: "步行 5 分鐘",
    image: "/images/food/lunch-1.jpg",
    imageAlt: "XXX 牛肉麵的招牌牛肉麵",
    mapUrl: "https://maps.google.com/",
    featured: true,
  },
  {
    id: "lunch-2",
    name: "XXX 風味餐廳",
    category: "lunch",
    description: "在地食材做的合菜，人多的時候我們都訂這間。",
    rating: 4.3,
    distance: "開車 8 分鐘",
    image: "/images/food/lunch-2.jpg",
    imageAlt: "XXX 風味餐廳的菜色",
    mapUrl: "https://maps.google.com/",
    featured: false,
  },
  {
    id: "dinner-1",
    name: "XXX 熱炒",
    category: "dinner",
    description: "海鮮很新鮮，價格也實在，晚上很熱鬧。",
    rating: 4.7,
    distance: "開車 6 分鐘",
    image: "/images/food/dinner-1.jpg",
    imageAlt: "XXX 熱炒的熱炒料理",
    mapUrl: "https://maps.google.com/",
    featured: true,
  },
  {
    id: "dinner-2",
    name: "XXX 海鮮餐廳",
    category: "dinner",
    description: "看海吃晚餐，日落時段的位子要先訂。",
    rating: 4.5,
    distance: "開車 12 分鐘",
    image: "/images/food/dinner-2.jpg",
    imageAlt: "XXX 海鮮餐廳的海景座位",
    mapUrl: "https://maps.google.com/",
    featured: false,
  },
  {
    id: "cafe-1",
    name: "XXX 咖啡",
    category: "cafe",
    description: "手沖咖啡配山景，下午最適合放空的地方。",
    rating: 4.8,
    distance: "步行 10 分鐘",
    image: "/images/food/cafe-1.jpg",
    imageAlt: "XXX 咖啡的手沖咖啡與座位",
    mapUrl: "https://maps.google.com/",
    featured: false,
  },
  {
    id: "dessert-1",
    name: "XXX 甜點工作室",
    category: "dessert",
    description: "每天只做幾種，賣完就沒了，想吃要早點去。",
    rating: 4.6,
    distance: "開車 7 分鐘",
    image: "/images/food/dessert-1.jpg",
    imageAlt: "XXX 甜點工作室的甜點",
    mapUrl: "https://maps.google.com/",
    featured: false,
  },
];

export default foodShops;
