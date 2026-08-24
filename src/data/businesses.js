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
 *    type        品牌類型：'store'（賣場）或 'stay'（度假小屋）→ 決定卡片標籤樣式
 *    category    分類小標（顯示在名稱上方，例如「精選商品」）
 *    description 一到兩句簡短介紹
 *    image       圖片路徑，放在 public/images/ 底下，統一使用 16:9 比例
 *    imageAlt    圖片替代文字（無障礙 / SEO 必填）
 *    links       各種外部連結，沒有的欄位直接刪掉即可，卡片會自動不顯示
 *                  facebook  / instagram / website（官方網站）/ booking（訂房）/ line
 *    page        （選填）站內頁面網址，例如度假小屋的 "/stay"。
 *                有填的話，「前往」按鈕會導向站內頁面，不是外部網址
 *    primary     「前往」按鈕要打開 links 裡的哪一個 key（沒有 page 時才會用到）
 *    primaryLabel「前往」按鈕上的文字
 *
 *  ✚ 未來要新增第 4、第 5 個賣場：複製一個物件貼在陣列裡就好，
 *    首頁排版（桌機 2 欄、手機 1 欄）會自動處理。
 * ============================================================================
 */

export const businesses = [
    {
    id: "hotel",
    name: "和顏悦舍",
    type: "stay",
    category: "台東長濱",
    description: "享受舒適、自在的度假小屋體驗。",
    image: "/images/hotel.jpg",
    imageAlt: "和顏悦舍外觀照片",
    links: {
      facebook: "https://www.facebook.com/share/1C47kvLZhQ/?mibextid=wwXIfr",
      instagram: "https://www.instagram.com/hxu298688?igsi=MWJtYnpsbnczNmw5MA==",
      line: "https://line.me/R/ti/p/@706nlpsu",
      booking:"https://peaceful-begonia-112xs3t.mystrikingly.com/"
    },
    page: "/stay",
    primary: "booking",
    primaryLabel: "探索度假小屋",
  },
  {
    id: "store-a",
    name: "美妝保養",
    type: "store",
    category: "台灣官方授權通路",
    description: "探索我們精選的熱門商品。",
    image: "/images/store-a.jpg",
    imageAlt: "賣場 A 的精選商品情境照",
    links: {
      facebook: "https://www.facebook.com/share/1B5ymaWk5Q/?mibextid=wwXIfr",
      instagram: "https://www.instagram.com/kayla.swag.19?igsi=NWpibDdsNzIyY2hs&utm_source=qr",
      line: "https://line.me/ti/p/x8Mttzc9sf",
      website: "https://tw.shp.ee/9nCtqQxV"
    },
    primary: "website",
    primaryLabel: "前往賣場",
  },
  {
    id: "store-b",
    name: "女裝服飾",
    type: "store",
    category: "生活選物",
    description: "發現更多實用又有質感的生活好物。",
    image: "/images/store-b.jpg",
    imageAlt: "賣場 B 的生活選物情境照",
    links: {
      facebook: "https://www.facebook.com/share/1B5ymaWk5Q/?mibextid=wwXIfr",
      instagram: "https://www.instagram.com/kayla.swag.19?igsi=NWpibDdsNzIyY2hs&utm_source=qr",
      line: "https://line.me/ti/p/x8Mttzc9sf",
      website: "https://tw.shp.ee/8G7WEMpL"
    },
    primary: "website",
    primaryLabel: "前往賣場",
  },
];

/**
 * 品牌類型的顯示標籤。
 * 度假小屋與賣場使用不同標籤，做出視覺區隔。
 */
export const businessTypes = {
  store: { label: "賣場" },
  stay: { label: "度假小屋" },
};

export default businesses;
