# 品牌總入口網站 V2.0

和顏悦舍的品牌入口網站。使用者從 NFC 連結進來後，可以在一頁之內看到所有品牌，
並直接前往各品牌的社群、賣場與訂房頁；度假小屋另外有一個「體驗中心」頁面。

**線上網址：** https://brand-portal-hxu.vercel.app/

## 頁面結構

```
/                首頁 —— Hero + 三張品牌卡片（度假小屋 / 美妝保養 / 女裝服飾）
│
└── /stay        度假小屋頁（體驗中心）
    │            Hero + 立即訂房 → 度假小屋主人推薦 → 美食地圖入口 → 在地體驗 → 我們的位置
    │
    ├── /food-map     美食地圖 —— 分類篩選 + 店家卡片 + Google Maps 連結
    ├── /attractions  附近景點 —— 依距離分組 + Google Maps 連結
    └── /itineraries  半日遊・一日遊 —— 四條路線 + Google Maps 路線規劃
```

## 技術

| 項目 | 版本 |
| --- | --- |
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4（設定寫在 `src/index.css` 的 `@theme`，沒有 tailwind.config.js） |
| React Router | 7 |
| lucide-react | 1（品牌 icon 已被 lucide 移除，Facebook / Instagram / LINE 自製於 `icons/BrandIcons.jsx`） |

純前端。沒有後端、資料庫、登入、購物車、金流，也沒有使用 Google Maps API
（地圖連結是一般的 Google Maps 公開網址）。

## 啟動

```bash
npm install
npm run dev
```

開啟 http://localhost:5173

```bash
npm run build     # 產生 dist/
npm run preview   # 在本機預覽 build 後的結果
```

## 專案結構

```
.
├── index.html                      SEO meta（title / description / OG / JSON-LD）、字型、favicon
├── vercel.json                     SPA 路由設定（讓 /stay、/food-map 直接開也不會 404）
├── vite.config.js
├── public/
│   ├── favicon.svg / favicon.ico / apple-touch-icon.png
│   └── images/
│       ├── store-a.jpg  store-b.jpg  hotel.jpg    品牌卡片圖（16:9）
│       ├── hero.jpg                               只用於社群分享預覽，頁面上不顯示
│       └── food/                                  美食店家圖（16:9）
└── src/
    ├── main.jsx                    進入點（BrowserRouter）
    ├── App.jsx                     共用外框（Header / Footer）+ 路由表
    ├── index.css                   設計 token（配色 / 字型 / 動畫）+ 基礎樣式
    ├── pages/
    │   ├── HomePage.jsx            首頁
    │   ├── StayPage.jsx            度假小屋頁
    │   ├── FoodMapPage.jsx         美食地圖頁
    │   ├── AttractionsPage.jsx     附近景點頁
    │   └── ItinerariesPage.jsx     半日遊・一日遊頁
    ├── data/                       ★ 所有可修改的內容都在這裡
    │   ├── businesses.js           三個品牌：名稱、介紹、圖片、所有連結
    │   ├── site.js                 網站文字：品牌名、標語、Hero、Footer、聯絡資訊
    │   ├── stay.js                 度假小屋頁文字、地址、Google Maps 連結
    │   ├── food.js                 美食分類 + 店家清單
    │   ├── experiences.js          在地體驗四張卡片
    │   ├── attractions.js          附近景點（分組 + 11 個景點）
    │   └── itineraries.js          半日遊 / 一日遊 四條路線
    └── components/
        ├── Header.jsx              Logo + 品牌名稱 + 標語（捲動後變毛玻璃、跨頁導覽）
        ├── Hero.jsx                首頁主視覺
        ├── BusinessGrid.jsx        品牌卡片排版（手機 1 欄 / 桌機 2 欄）
        ├── BusinessCard.jsx        品牌卡片
        ├── FoodCard.jsx            美食店家卡片
        ├── ExperienceCard.jsx      在地體驗卡片
        ├── AttractionCard.jsx      附近景點卡片
        ├── ItineraryCard.jsx       行程卡片
        ├── SectionHeading.jsx      區塊標題（各頁共用，避免重複樣式）
        ├── SocialLinks.jsx         社群 / 外部連結 icon 按鈕列
        ├── Footer.jsx              品牌 + 社群 + 聯絡資訊 + Copyright
        ├── Logo.jsx                Logo 標誌（SVG）
        ├── Reveal.jsx              捲動進場動畫包裝
        ├── ScrollToTop.jsx         換頁時自動捲回頂端
        └── icons/BrandIcons.jsx    Facebook / Instagram / LINE icon
```

## 資料與 UI 分離

React 元件不知道有幾個品牌、有幾家店，全部從 `src/data/` 讀。
**要改內容不需要動任何元件。**

### 改品牌名稱 / 介紹 / 連結 → `data/businesses.js`

```js
{
  name: "和顏悦舍",
  category: "台東長濱",
  description: "享受舒適、自在的度假小屋體驗。",
  links: {
    facebook: "https://...",
    instagram: "https://...",
    line: "https://...",
    booking: "https://...",      // 度假小屋用 booking，賣場用 website
  },
  page: "/stay",                 // 有 page 時，「前往」按鈕會走站內頁面
  primaryLabel: "探索度假小屋",
}
```

填 `https://` 開頭的網址會自動加上 `target="_blank"` 與 `rel="noopener noreferrer"`。
不需要的 links 欄位直接刪掉，按鈕就不會出現。

### 改美食店家 → `data/food.js`

```js
{
  id: "lunch-1",
  name: "XXX 牛肉麵",
  category: "lunch",              // 必須是 foodCategories 其中一個 id
  description: "第一次來這裡，我們最推薦這家。",
  rating: 4.5,
  distance: "步行 5 分鐘",
  image: "/images/food/lunch-1.jpg",
  imageAlt: "XXX 牛肉麵的招牌牛肉麵",
  mapUrl: "https://maps.google.com/",
  featured: true,                 // true 才會出現在度假小屋頁的「度假小屋主人推薦」
}
```

`featured: true` 建議維持 **3 家**，推薦區是 3 欄，剛好排滿一列。

要新增分類（例如「宵夜」），在同一支檔案的 `foodCategories` 加一筆即可，
篩選按鈕會自動多一顆。

### 改附近景點 → `data/attractions.js`

`attractionGroups` 是分組（顯示順序＝陣列順序），`attractions` 是景點。
`highlight: true` 會顯示「⭐ 最推薦」標籤。
`mapUrl` 打開後如果找到的地點不對，直接改那一行的網址即可。

### 改行程建議 → `data/itineraries.js`

`stops` 是路線上的每一站，第一站與最後一站請保留度假小屋。
`warning` 有填才會出現橘色的「出發前注意」區塊。
`mapUrl` 是 Google Maps 路線規劃網址，waypoints 之間用 `|` 分隔。

### 改在地體驗 → `data/experiences.js`

卡片加上 `link: "/某個頁面"` 就會出現「查看」按鈕（目前只有「附近景點」有）。

### 改度假小屋頁文字、地址、地圖連結 → `data/stay.js`

### 改品牌總稱 / 標語 / Footer → `data/site.js`

> ⚠️ SEO 的 title 與 description 在 `index.html`（爬蟲要在 HTML 裡就看到），
> 換品牌名稱時記得一起改。

### 換圖片

放進 `public/images/`（美食圖放 `public/images/food/`），
改資料檔的 `image` 與 `imageAlt`。

建議 **16:9**、JPG。品牌卡片圖 1600×900，美食圖 800×450。
**上傳前先壓縮**（https://squoosh.app 品質調 80 左右），每張控制在 300 KB 以內。
所有圖片使用 `object-fit: cover`，比例不同也不會變形，只會裁切。

### 新增頁面

1. 在 `src/pages/` 建立新的頁面元件
2. 在 `src/App.jsx` 的 `<Routes>` 加一行 `<Route path="..." element={...} />`

`vercel.json` 已經設定好 SPA rewrite，新頁面直接開網址或重新整理都不會 404。

## 已納入的無障礙與 SEO

- 所有圖片有 `alt`、所有 icon 按鈕有 `aria-label` + tooltip
- 完整鍵盤操作，`:focus-visible` 有明顯外框，第一個 Tab 是「跳至主要內容」
- 語意標籤 `header` / `main` / `footer` / `nav` / `article`，標題階層 h1 → h2 → h3
- 分類篩選使用 `<button>` + `aria-pressed`
- 所有可點擊目標高度 ≥ 24px，主要按鈕 44px
- 尊重 `prefers-reduced-motion`
- 外部連結一律 `rel="noopener noreferrer"`
- title / description / canonical / Open Graph / Twitter Card / JSON-LD / favicon

## 未來 Roadmap（尚未實作）

### V3

- Channel Manager
- 即時房況
- 多平台訂房同步
- 真正的互動式地圖（目前是外部 Google Maps 連結）
- 在地體驗剩下的子頁面（交通 / 旅遊資訊）

### V4

- AI 旅遊助手
- AI 美食推薦
- AI 行程規劃
- RAG
- AI Agent

## 目前使用的是範例資料

`data/food.js` 裡的 **8 家店全部是範例**（店名 `XXX ○○`、評價、距離都是假的），
`data/stay.js` 的地址也還是「台東縣長濱鄉」。
對外正式使用前請換成真實資料。
