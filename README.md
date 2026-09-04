# 品牌總入口網站 V2.0

和顏悦舍的品牌入口網站。使用者從 NFC 連結進來後，可以在一頁之內看到所有品牌，
並直接前往各品牌的社群、賣場與訂房頁；度假小屋另外有一個「體驗中心」頁面。

**線上網址：** https://brand-portal-hxu.vercel.app/

## 頁面結構

```
/                首頁 —— Hero + 三張品牌卡片（度假小屋 / 美妝保養 / 女裝服飾）
│
└── /stay        度假小屋頁（體驗中心）
    │            Hero + 立即訂房 → 環境介紹 → 空房查詢 → 度假小屋主人推薦
    │            → 美食地圖入口 → 在地體驗 → 我們的位置
    │
    ├── /food-map     美食地圖 —— 4 分類 23 家店 + Google Maps 連結
    ├── /attractions  附近景點 —— 依距離分組 + Google Maps 連結
    ├── /itineraries  半日遊・一日遊 —— 四條路線 + Google Maps 路線規劃
    ├── /transport    交通方式 —— 五種抵達方式 + 導航
    └── /events       台東最新活動 —— 每日自動從 TDX 抓取
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
├── .github/workflows/
│   ├── update-events.yml           每天自動更新台東活動資料
│   └── update-availability.yml     每小時自動更新空房資料
├── scripts/
│   ├── optimize-stay-images.mjs    把環境照原檔壓成網頁用的 WebP
│   ├── fetch-availability.mjs      抓房間日曆，產生空房資料
│   └── lib/availability.mjs        iCal 解析（含 node:test 測試）
├── vite.config.js
├── public/
│   ├── favicon.svg / favicon.ico / apple-touch-icon.png
│   └── images/
│       ├── store-a.jpg  store-b.jpg  hotel.jpg    品牌卡片圖（16:9）
│       ├── hero.jpg                               只用於社群分享預覽，頁面上不顯示
│       ├── food/                                  美食店家圖（16:9）
│       └── stay/                                  環境照（WebP，由腳本產生）
└── src/
    ├── main.jsx                    進入點（BrowserRouter）
    ├── App.jsx                     共用外框（Header / Footer）+ 路由表
    ├── index.css                   設計 token（配色 / 字型 / 動畫）+ 基礎樣式
    ├── pages/
    │   ├── HomePage.jsx            首頁
    │   ├── StayPage.jsx            度假小屋頁
    │   ├── FoodMapPage.jsx         美食地圖頁
    │   ├── AttractionsPage.jsx     附近景點頁
    │   ├── ItinerariesPage.jsx     半日遊・一日遊頁
    │   ├── TransportPage.jsx       交通方式頁
    │   └── EventsPage.jsx          台東最新活動頁
    ├── data/                       ★ 所有可修改的內容都在這裡
    │   ├── businesses.js           三個品牌：名稱、介紹、圖片、所有連結
    │   ├── site.js                 網站文字：品牌名、標語、Hero、Footer、聯絡資訊
    │   ├── stay.js                 度假小屋頁文字、地址、Google Maps 連結
    │   ├── food.js                 美食 4 分類 + 23 家店 + 提醒文字
    │   ├── environment.js          環境照清單（順序＝顯示順序）
    │   ├── experiences.js          在地體驗四張卡片
    │   ├── attractions.js          附近景點（分組 + 11 個景點）
    │   ├── itineraries.js          半日遊 / 一日遊 四條路線
    │   ├── transport.js            交通方式五種路線
    │   ├── events.js               台東活動頁文字
    │   ├── events.generated.json   ★ 自動產生，請勿手動編輯
    │   ├── availability.js         空房日曆設定（房間、日曆網址）與文案
    │   └── availability.generated.json  ★ 自動產生，請勿手動編輯
    └── components/
        ├── Header.jsx              Logo + 品牌名稱 + 標語（捲動後變毛玻璃、跨頁導覽）
        ├── Hero.jsx                首頁主視覺
        ├── BusinessGrid.jsx        品牌卡片排版（手機 1 欄 / 桌機 2 欄）
        ├── BusinessCard.jsx        品牌卡片
        ├── FoodCard.jsx            美食店家卡片
        ├── EnvironmentGallery.jsx  環境照相簿（預設 8 張，可展開全部）
        ├── ExperienceCard.jsx      在地體驗卡片
        ├── AttractionCard.jsx      附近景點卡片
        ├── ItineraryCard.jsx       行程卡片
        ├── TransportCard.jsx       交通路線卡片
        ├── EventCard.jsx           活動卡片
        ├── AvailabilityCalendar.jsx 空房月曆
        ├── RouteSteps.jsx          路線站點串（行程頁與交通頁共用）
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
  id: "cafe-huazhai",
  name: "花宅咖啡",
  category: "cafe",              // 必須是 foodCategories 其中一個 id
  description: "隱身於老宅中的溫馨咖啡館…",
  highlight: true,               // true 會顯示「⭐ 最推薦」標籤
  mapUrl: mapUrl("花宅咖啡"),     // 用店名自動組 Google Maps 搜尋連結
  featured: true,                // true 才會出現在度假小屋頁的推薦區
}
```

卡片版面與附近景點一致：分類圖示 + 最推薦標籤 → 店名 → 介紹 → 查看地圖。
圖示會自動用該分類的 emoji，不用逐家設定。

`featured: true` 建議維持 **3 家**，推薦區是 3 欄，剛好排滿一列。

要新增分類，在同一支檔案的 `foodCategories` 加一筆即可，篩選按鈕會自動多一顆。
頁面上的兩則提醒文字在同一支檔案的 `foodNotes`。

### 改附近景點 → `data/attractions.js`

`attractionGroups` 是分組（顯示順序＝陣列順序），`attractions` 是景點。
`highlight: true` 會顯示「⭐ 最推薦」標籤。
`mapUrl` 打開後如果找到的地點不對，直接改那一行的網址即可。

### 台東活動 → 全自動，不用維護

活動清單由 GitHub Actions **每天台灣時間早上 5 點**自動更新。
辦在長濱鄉的活動會自動加上「長濱鄉」標籤（判斷依據是 `data/events.js` 的 `LOCAL_TOWN`）。

流程：

```
TDX 觀光活動 API → scripts/fetch-taitung-events.mjs
  → src/data/events.generated.json → 自動 commit → Vercel 自動部署
```

抓取條件：臺東縣 + 現在進行中。想改條件（例如只留北段鄉鎮、
或加入即將開始的活動）→ 改 `scripts/fetch-taitung-events.mjs` 裡的 `$filter`。

頁面文字（標題、說明、提醒）在 `data/events.js`，這部分是手動維護的。

⚠️ `events.generated.json` 是自動產生的，改了下次會被覆蓋。

**需要在 GitHub 設定兩個 Secret**（Settings → Secrets and variables → Actions）：
`TDX_CLIENT_ID`、`TDX_CLIENT_SECRET`。

本機要手動跑一次的話：

```bash
node --env-file=scripts/.env scripts/fetch-taitung-events.mjs
```

### 改交通方式 → `data/transport.js`

地址不在這裡 —— 統一放在 `site.js` 的 `contact.address`，
Footer、度假小屋頁、交通頁都讀同一份，改一次就好。

### 改行程建議 → `data/itineraries.js`

`stops` 是路線上的每一站，第一站與最後一站請保留度假小屋。
`warning` 有填才會出現橘色的「出發前注意」區塊。
`mapUrl` 是 Google Maps 路線規劃網址，waypoints 之間用 `|` 分隔。

### 改在地體驗 → `data/experiences.js`

目前四張卡片（最新活動 / 附近景點 / 一日遊 / 交通）都有 `link`，
桌機剛好排滿一列。加上 `link: "/某個頁面"` 卡片才會出現「查看」按鈕。

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

### 空房日曆

資料來源是兩本 Google 日曆（荷花、遠山），一間房一本。
GitHub Actions 每小時抓一次，只在空房狀況真的改變時才 commit。

> ⚠️ 抓取失敗不會在頁面上跳警告，是靠 GitHub Actions 寄失敗通知信到
> repo owner 的 GitHub 帳號信箱，記得確認該帳號的 notification 設定
> 有開 email 通知。如果空房頁面「資料更新於」的時間卡住好幾天沒再往前跳，
> 就是排程壞掉的徵兆，該去 repo 的 Actions 分頁查是哪一步失敗。

**新增房間**：在 `data/availability.js` 的 `rooms` 加一個物件，
再跑 `npm run update:availability`。月曆每格的點數會自動跟著變。

```bash
npm run update:availability            # 手動更新
npm run update:availability -- --check # 只看解析結果，不寫檔
npm test                               # 跑解析邏輯的測試
```

> ⚠️ 日曆的共用設定必須是「將日曆公開」+「**只顯示空/忙 (隱藏詳細資訊)**」。
> 若誤設成「查看所有活動詳細資訊」，客人姓名就會透過那個公開網址外流。
> 抓取腳本刻意不讀取活動標題，所以姓名不會進到這個公開 repo，
> 但外流發生在 Google 那一端，程式擋不住。

測試裡最重要的一項是 `DTEND` 的邊界 —— 9/10 入住、9/12 退房佔的是**兩晚不是三晚**。
寫錯會少接一天生意，或反過來造成重複訂房。

### 新增或替換環境照

環境照跟其他圖片不同，**不要手動壓縮後丟進 `public/`**，走腳本：

1. 把相機原檔放進 `assets-src/stay/`，檔名用數字（`1.JPG`、`2.JPG`…），數字就是顯示順序
2. 跑 `npm run optimize:images`
3. 到 `src/data/environment.js` 補上對應的物件（`src` / `alt`）

腳本會自動依 EXIF 轉正、長邊縮到 1280、轉 WebP、清掉含 GPS 的 EXIF。
26 張原檔約 97 MB，壓完約 5.5 MB。

> `assets-src/` 已在 `.gitignore`。原檔留在你電腦裡，不會進版控也不會上傳，
> 否則 git 倉庫會永久胖將近 100 MB。

照片會裁成 **4:3** 顯示。主體偏畫面下緣的照片（例如鞦韆座板、長桌），
在 `environment.js` 加 `focus: "50% 72%"` 指定對焦位置，否則會被切掉。

**要遮蔽車牌、門牌之類的東西**，改 `optimize-stay-images.mjs` 裡的 `REDACTIONS`，
不要手動修圖再丟進 `public/` —— 下次重跑腳本會被原圖蓋回去。座標用 0～1 的比例：

```js
const REDACTIONS = {
  "9.JPG": [{ left: 0.183, top: 0.532, width: 0.034, height: 0.028 }],
};
```

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
- 在地體驗剩下的子頁面（旅遊資訊）

### V4

- AI 旅遊助手
- AI 美食推薦
- AI 行程規劃
- RAG
- AI Agent

