import generated from "./events.generated.json";

/**
 * ============================================================================
 *  台東最新活動（/events 頁面）
 * ----------------------------------------------------------------------------
 *  ⚠️ 活動清單是「自動產生」的，請不要手動編輯 events.generated.json，
 *     下次自動更新就會被覆蓋。
 *
 *  資料來源：交通部觀光署「觀光資訊資料庫開放資料 V2」（透過 TDX）
 *  更新方式：GitHub Actions 每天台灣時間早上 5 點自動抓一次，
 *            寫進 events.generated.json 後自動 commit，
 *            Vercel 偵測到就重新部署。你完全不用維護。
 *
 *  抓取條件：臺東縣 + 現在進行中（開始日已過、結束日還沒到）
 *  想改條件（例如只留北段鄉鎮、或加入即將開始的活動）→
 *  改 scripts/fetch-taitung-events.mjs 裡的 $filter。
 *
 *  頁面另外還有一層保險：endDate 已經過的活動不會顯示。
 *  萬一自動更新壞掉好幾天，客人也不會看到已經結束的活動。
 *
 *  下面 eventsPage 的文字是手動維護的，可以自由修改。
 * ============================================================================
 */

export const eventsPage = {
  emoji: "🎪",
  eyebrow: "每日自動更新",
  title: "台東最新活動",
  description:
    "住在長濱的期間，台東各地正在舉辦哪些活動，這裡每天自動更新一次。",
  note: "資料來自交通部觀光署開放資料。活動日期與內容以主辦單位公告為準，出發前請再確認一次。",
  /** 想看完整活動列表時的出口 */
  moreLink: {
    label: "台東觀光旅遊網",
    url: "https://tour.taitung.gov.tw/",
  },
  /** 目前沒有進行中的活動時顯示的文字 */
  emptyText: "目前沒有正在進行的活動。",
};

/** 自動抓回來的活動清單 */
export const events = generated.events;

/** 資料最後更新時間（ISO 字串） */
export const eventsUpdatedAt = generated._更新時間;

export default events;
