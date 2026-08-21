# 品牌總入口網站 V1.0

一個「2 個賣場 + 1 個民宿」的品牌入口首頁。使用者從 NFC 連結進來後，
可以在一頁之內看到所有品牌，並直接前往各品牌的 Facebook / Instagram / 官方網站 / 訂房網站。

## 技術

| 項目 | 版本 |
| --- | --- |
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4（透過 `@tailwindcss/vite`，設定寫在 `src/index.css` 的 `@theme`，沒有 tailwind.config.js） |
| lucide-react | 1（品牌 icon 已被 lucide 移除，Facebook / Instagram / LINE 自製於 `src/components/icons/BrandIcons.jsx`） |
| React Router | 7（V1.0 只有一個首頁，先架好殼，方便未來加子頁面） |

純前端，沒有後端、資料庫、登入、購物車、金流。

## 啟動

```bash
npm install
npm run dev
```

開啟 http://localhost:5173

其他指令：

```bash
npm run build     # 產生 dist/（可直接部署到 Vercel / Netlify / Cloudflare Pages）
npm run preview   # 在本機預覽 build 後的結果
```

## 專案結構

```
.
├── index.html                      SEO meta（title / description / OG / JSON-LD）、字型、favicon
├── vite.config.js                  Vite + React + Tailwind 外掛
├── public/
│   ├── favicon.svg / favicon.ico / apple-touch-icon.png
│   └── images/
│       ├── store-a.jpg             賣場 A 卡片圖（16:9）
│       ├── store-b.jpg             賣場 B 卡片圖（16:9）
│       ├── hotel.jpg               民宿卡片圖（16:9）
│       └── hero.jpg                只用於社群分享預覽圖（og:image），頁面上不會顯示
└── src/
    ├── main.jsx                    進入點 + React Router 外殼
    ├── App.jsx                     首頁組裝（只負責把區塊排好）
    ├── index.css                   設計 token（配色 / 字型 / 動畫）+ 基礎樣式
    ├── data/
    │   ├── businesses.js           ★ 品牌資料：名稱、介紹、圖片、所有連結
    │   └── site.js                 ★ 網站文字：品牌名、標語、Hero、Footer、聯絡資訊
    └── components/
        ├── Header.jsx              Logo + 品牌名稱 + 標語（捲動後變毛玻璃）
        ├── Hero.jsx                主標題 + 副標題 + 向下捲動提示
        ├── BusinessGrid.jsx        卡片排版（手機 1 欄 / 桌機 2 欄）
        ├── BusinessCard.jsx        可重複使用的品牌卡片
        ├── SocialLinks.jsx         社群 / 外部連結 icon 按鈕列
        ├── Footer.jsx              品牌 + 社群 + 聯絡資訊 + Copyright
        ├── Logo.jsx                Logo 標誌（SVG）
        ├── Reveal.jsx              捲動進場動畫包裝元件
        └── icons/BrandIcons.jsx    Facebook / Instagram / LINE icon
```

## 資料與 UI 分離

React 元件不知道有幾個品牌、也不知道品牌叫什麼名字，全部從 `src/data/` 讀。
要改內容 **不需要動任何元件**。

### 改品牌名稱 / 介紹 / 分類

`src/data/businesses.js`：

```js
{
  id: "store-a",
  name: "賣場 A",            // ← 改這裡
  type: "store",             // 'store' 顯示「賣場」標籤、'stay' 顯示「住宿」標籤
  category: "精選商品",       // ← 改這裡
  description: "探索我們精選的熱門商品。",  // ← 改這裡
  ...
}
```

### 改 Facebook / Instagram / 官網 / 訂房網址

同一支檔案的 `links`。把 `"#"` 換成真實網址即可，
換成 `https://` 開頭的網址後會自動加上 `target="_blank"` 與 `rel="noopener noreferrer"`：

```js
links: {
  facebook: "https://www.facebook.com/你的粉專",
  instagram: "https://www.instagram.com/你的帳號",
  website: "https://你的官網.com",
  // 民宿用 booking 取代 website
  // 不需要的欄位直接刪掉，按鈕就不會出現
}
```

`primary` 決定「前往」按鈕連到哪一個 key，`primaryLabel` 是按鈕文字。

### 換圖片

把新圖片放進 `public/images/`，然後改 `businesses.js` 的 `image` 與 `imageAlt`。
建議 **1600×900（16:9）**、JPG、單張 300KB 以內。
所有圖片使用 `object-fit: cover`，比例不同也不會變形，只會裁切。

### 改品牌總稱 / 標語 / Footer

`src/data/site.js`。
注意 **SEO 的 title 與 description 在 `index.html`**（爬蟲要在 HTML 裡就看到），
換品牌名稱時記得一起改。

### 新增第 4、第 5 個賣場

在 `businesses.js` 陣列裡複製一個物件貼上就好。排版會自動處理：
偶數張 → 整齊的 2×2；奇數張 → 最後一張自動跨滿兩欄變成橫式卡片，右下角不會留空白。

## 已納入的無障礙與 SEO

- 所有圖片有 `alt`、所有 icon 按鈕有 `aria-label` + tooltip
- 完整鍵盤操作，`:focus-visible` 有明顯外框，第一個 Tab 是「跳至主要內容」
- 語意標籤 `header` / `main` / `footer` / `nav` / `article`，標題階層 h1 → h2 → h3
- 所有可點擊目標高度 ≥ 24px，主要按鈕 44px
- 尊重 `prefers-reduced-motion`（系統關閉動畫時不播動畫）
- 外部連結一律 `rel="noopener noreferrer"`
- title / description / canonical / Open Graph / Twitter Card / JSON-LD Organization / favicon

## V1.0 刻意不做

購物車、登入、會員、資料庫、後端 API、AI Chat、RAG、Agent、金流、訂單系統。
架構圖裡的「房型 / 線上訂房 / 美食地圖」子頁面留到後續版本
（`src/main.jsx` 的 Router 已經先架好，加 `<Route>` 就能擴充）。
