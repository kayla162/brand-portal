/**
 * ============================================================================
 *  品牌資料（唯一資料來源 Single Source of Truth）
 * ----------------------------------------------------------------------------
 *  想改品牌名稱、介紹、圖片、Facebook / Instagram / 官網 / 訂房網址，
 *  全部都在這一支檔案改，不需要動任何 React 元件。
 *
 *  欄位說明：
 *    id          唯一代號（英文小寫、用 - 連接），未來做子頁面路由會用到
 *    name        品牌名稱（卡片大標題）
 *    type        品牌類型：'store'（賣場）或 'stay'（旅宿）→ 決定卡片標籤樣式
 *    category    分類小標（顯示在名稱上方，例如「精選商品」）
 *    description 一到兩句簡短介紹
 *    image       圖片路徑，放在 public/images/ 底下，統一使用 16:9 比例
 *    imageAlt    圖片替代文字（無障礙 / SEO 必填）
 *    links       各種外部連結，沒有的欄位直接刪掉即可，卡片會自動不顯示
 *                  facebook  / instagram / website（官方網站）/ booking（訂房）/ line
 *    primary     「前往」按鈕要打開 links 裡的哪一個 key
 *    primaryLabel「前往」按鈕上的文字
 *
 *  ✚ 未來要新增第 4、第 5 個賣場：複製一個物件貼在陣列裡就好，
 *    首頁排版（桌機 2 欄、手機 1 欄）會自動處理。
 * ============================================================================
 */

export const businesses = [
  {
    id: "store-a",
    name: "賣場 A",
    type: "store",
    category: "精選商品",
    description: "探索我們精選的熱門商品。",
    image: "/images/store-a.jpg",
    imageAlt: "賣場 A 的精選商品情境照",
    links: {
      facebook: "#",
      instagram: "#",
      website: "#",
    },
    primary: "website",
    primaryLabel: "前往賣場",
  },
  {
    id: "store-b",
    name: "賣場 B",
    type: "store",
    category: "生活選物",
    description: "發現更多實用又有質感的生活好物。",
    image: "/images/store-b.jpg",
    imageAlt: "賣場 B 的生活選物情境照",
    links: {
      facebook: "#",
      instagram: "#",
      website: "#",
    },
    primary: "website",
    primaryLabel: "前往賣場",
  },
  {
    id: "hotel",
    name: "XXX 民宿",
    type: "stay",
    category: "旅宿",
    description: "享受舒適、自在的住宿體驗。",
    image: "/images/hotel.jpg",
    imageAlt: "XXX 民宿的房間情境照",
    links: {
      facebook: "#",
      instagram: "#",
      booking: "#",
    },
    primary: "booking",
    primaryLabel: "立即訂房",
  },
];

/**
 * 品牌類型的顯示標籤。
 * 民宿使用「住宿」標籤，與賣場做出視覺區隔。
 */
export const businessTypes = {
  store: { label: "賣場" },
  stay: { label: "住宿" },
};

export default businesses;
