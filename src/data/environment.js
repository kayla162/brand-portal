/**
 * ============================================================================
 *  度假小屋環境照（度假小屋頁 /stay 的「環境介紹」區）
 * ----------------------------------------------------------------------------
 *  陣列的「順序」就是頁面上的顯示順序。要調整先後，直接搬動物件即可。
 *
 *  欄位說明：
 *    id     唯一代號（英文小寫、用 - 連接），React 用來辨識每張照片
 *    src    圖片路徑。這些檔案由 scripts/optimize-stay-images.mjs 產生，
 *           不要手動放原始相機檔進 public/ —— 一張就好幾 MB，手機會載不動。
 *    alt    替代文字（無障礙 / SEO 必填）。描述「照片裡有什麼」，
 *           不要寫成「照片1」這種對讀屏軟體毫無資訊的內容。
 *    focus  （選填）CSS object-position。照片會被裁成 4:3 顯示，
 *           預設從正中央裁。主體偏下方的照片要指定，否則會被切掉，
 *           例如 15 的鞦韆座板、20 的原木長桌都在畫面下緣。
 *
 *  ✚ 要新增照片：把原檔放進 assets-src/stay/（檔名用數字），
 *    跑 `npm run optimize:images`，再回來這裡補一個物件。
 * ============================================================================
 */

export const environmentPhotos = [
  {
    id: "entrance-sign",
    src: "/images/stay/01.webp",
    alt: "清水模門牌牆上刻著「和顏悦舍 HE-YAN GLAMPING SITE」，後方是米黃色平房與海岸山脈",
  },
  {
    id: "front-gate",
    src: "/images/stay/02.webp",
    alt: "鏤空鐵花大門與門柱信箱，門內是草坪與整排房舍，背景為層疊山巒",
  },
  {
    id: "window-garden",
    src: "/images/stay/03.webp",
    alt: "房舍外廊的木框景觀窗映著樹影，窗下花圃開滿粉紫色小花",
  },
  {
    id: "swing-tree",
    src: "/images/stay/04.webp",
    alt: "大樹枝幹上懸掛的木板鞦韆，樹下是一片草地",
  },
  {
    id: "lily-pond",
    src: "/images/stay/05.webp",
    alt: "輪胎改造的睡蓮池，池畔有青蛙造景與粉色小花",
  },
  {
    id: "gate-outside",
    src: "/images/stay/06.webp",
    alt: "從門外看鏤空鐵花大門，門內是草坪與樹，遠方可見海平線",
  },
  {
    id: "goose-figure",
    src: "/images/stay/07.webp",
    alt: "草地樹樁上提著燈籠的白鵝擺飾，頸間戴著粉紅色花圈",
  },
  {
    id: "stone-stack",
    src: "/images/stay/08.webp",
    // 疊石主體偏下，置中裁會切掉底部幾顆石頭
    focus: "50% 68%",
    alt: "花圃裡的疊石造景與小樹，後方是房舍的木框窗",
  },
  {
    id: "house-front",
    src: "/images/stay/09.webp",
    alt: "房舍正面全景，前方是礫石停車區與草坪，背景為海岸山脈",
  },
  {
    id: "house-corner",
    src: "/images/stay/10.webp",
    alt: "房舍轉角的木門與大片景觀窗，門前有九重葛與疊石造景",
  },
  {
    id: "water-jar",
    src: "/images/stay/11.webp",
    alt: "外牆景觀窗前的陶甕睡蓮缸，旁邊是一片綠意花圃",
  },
  {
    id: "side-path",
    src: "/images/stay/12.webp",
    alt: "房舍側邊步道與整排景觀窗，遠處是大樹下的白色桌椅涼棚",
  },
  {
    id: "lawn-wide",
    src: "/images/stay/13.webp",
    alt: "遼闊的草坪與水泥步道，左側涼棚下擺著白色桌椅，遠方是海平線",
  },
  {
    id: "glass-corridor",
    src: "/images/stay/14.webp",
    alt: "玻璃採光罩下的廊道，兩側花圃盛開，底端是木質桌椅用餐區",
  },
  {
    id: "swing-sea",
    src: "/images/stay/15.webp",
    // 鞦韆座板在畫面下緣，一定要往下對焦
    focus: "50% 72%",
    alt: "大樹下的木板鞦韆特寫，草坡後方是遠處的太平洋",
  },
  {
    id: "lawn-sea",
    src: "/images/stay/16.webp",
    alt: "大片草坪與成排盆栽苗木，遠方樹叢外是太平洋",
  },
  {
    id: "big-tree",
    src: "/images/stay/17.webp",
    alt: "草地上一棵樹冠寬闊的大樹，枝葉茂密",
  },
  {
    id: "washroom",
    src: "/images/stay/18.webp",
    alt: "米黃色的獨立衛浴建築，四道白色門與戶外洗手台，背景是山巒",
  },
  {
    id: "pergola-day",
    src: "/images/stay/19.webp",
    alt: "玻璃採光罩廊道與攀藤花架，旁邊是木質高腳桌椅與花圃",
  },
  {
    id: "pergola-night",
    src: "/images/stay/20.webp",
    // 原木長桌佔滿畫面下半，置中裁會只剩桌面一角
    focus: "50% 72%",
    alt: "夜晚的廊道用餐區，暖黃燈光下擺著原木長桌與木凳",
  },
  {
    id: "lawn-ocean",
    src: "/images/stay/21.webp",
    alt: "從草坪望向太平洋，左側是茂密的樹叢",
  },
  {
    id: "dining-table",
    src: "/images/stay/22.webp",
    // 餐桌椅偏下，稍微往下對焦才看得到完整桌面
    focus: "50% 62%",
    alt: "玻璃採光罩下的木質餐桌椅，望出去是綠地與遠方山巒",
  },
  {
    id: "sunshade",
    src: "/images/stay/23.webp",
    alt: "草坪上的遮陽棚與白色桌椅，棚下垂掛星星月亮吊飾，遠方是海平線",
  },
  {
    id: "wooden-plaque",
    src: "/images/stay/24.webp",
    alt: "鐵花門上掛著一塊木牌，刻有「和顏悦舍」與訂房專線",
  },
  {
    id: "flower-bed",
    src: "/images/stay/25.webp",
    alt: "房舍轉角的大片景觀窗，窗下是繁茂花圃與陶甕盆景",
  },
  {
    id: "lawn-house",
    src: "/images/stay/26.webp",
    alt: "從草坪望向房舍，背景是海岸山脈與幾棵大樹",
  },
];

export default environmentPhotos;
