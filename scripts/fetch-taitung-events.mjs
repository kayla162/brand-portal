/**
 * ============================================================================
 *  從 TDX 抓「臺東縣目前進行中」的活動，寫成 src/data/events.generated.json
 * ----------------------------------------------------------------------------
 *  這支腳本由 .github/workflows/update-events.yml 每天自動執行，
 *  你平常不需要手動跑。要手動跑的話：
 *
 *      node --env-file=scripts/.env scripts/fetch-taitung-events.mjs
 *
 *  ⚠️ 產出的 events.generated.json 是自動產生的，不要手動編輯，
 *     下次自動更新就會被覆蓋。
 *
 *  資料來源：交通部觀光署「觀光資訊資料庫開放資料 V2」
 *  端點：https://tdx.transportdata.tw/api/tourism/service/odata/V2/Tourism/Event
 * ============================================================================
 */

import { writeFile } from "node:fs/promises";

const AUTH_URL =
  "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
const API_BASE = "https://tdx.transportdata.tw/api/tourism/service/odata/V2/Tourism";
const OUTPUT = new URL("../src/data/events.generated.json", import.meta.url);

// 官方資料寫的是「臺」東縣（正體），不是「台」東縣
const CITY = "臺東縣";

// TDX 的 $top 上限是 500，超過會回 HTTP 400
const PAGE_SIZE = 500;

const clientId = process.env.TDX_CLIENT_ID;
const clientSecret = process.env.TDX_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("❌ 缺少 TDX_CLIENT_ID / TDX_CLIENT_SECRET。");
  process.exit(1);
}

async function getToken() {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`取得 token 失敗：HTTP ${res.status} ${await res.text()}`);
  }

  return (await res.json()).access_token;
}

async function fetchPage(token, params) {
  const res = await fetch(`${API_BASE}/Event?${new URLSearchParams(params)}`, {
    headers: { authorization: `Bearer ${token}`, accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`查詢失敗：HTTP ${res.status} ${await res.text()}`);
  }

  // 回傳是 OData 信封 { value: [...] }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.value ?? []);
}

async function fetchAll(token, params) {
  const all = [];

  for (let skip = 0; ; skip += PAGE_SIZE) {
    const page = await fetchPage(token, { ...params, $top: PAGE_SIZE, $skip: skip });
    all.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  return all;
}

/** 現在時間的 OData 字串。資料的日期都帶 +08:00，所以這裡也要帶 */
function nowForOData() {
  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date();
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}+08:00`
  );
}

/**
 * 把 TDX 的一筆活動轉成網站要用的格式。
 * 網站端的欄位定義請看 src/data/events.js 的說明。
 */
function toSiteEvent(tdxEvent) {
  const address = tdxEvent.PostalAddress ?? {};

  // 地點：鄉鎮 + 街道（街道常常是空的）
  const location = [address.Town, address.StreetAddress].filter(Boolean).join(" ");

  // 地圖：用座標，比用地址精準（鄉間地址 Google 常常查不到）
  const mapUrl =
    tdxEvent.PositionLat && tdxEvent.PositionLon
      ? `https://www.google.com/maps/search/?api=1&query=${tdxEvent.PositionLat},${tdxEvent.PositionLon}`
      : "";

  return {
    id: tdxEvent.EventID,
    // 鄉鎮單獨留一欄，網站端才能標出「長濱鄉」的活動
    town: address.Town ?? "",
    name: tdxEvent.EventName,
    // 日期只留 YYYY-MM-DD，網站端是用字串比大小判斷有沒有過期
    startDate: (tdxEvent.StartDateTime ?? "").slice(0, 10),
    endDate: (tdxEvent.EndDateTime ?? "").slice(0, 10),
    location,
    description: tdxEvent.Description ?? "",
    link: tdxEvent.WebsiteUrl ?? "",
    mapUrl,
  };
}

async function main() {
  const token = await getToken();
  const now = nowForOData();

  const raw = await fetchAll(token, {
    $filter:
      `PostalAddress/City eq '${CITY}'` +
      ` and StartDateTime le ${now}` +
      ` and EndDateTime ge ${now}`,
    $orderby: "EndDateTime asc",
  });

  const events = raw
    .map(toSiteEvent)
    // 沒有名稱或日期的資料不要，免得網站顯示怪東西
    .filter((e) => e.id && e.name && e.startDate && e.endDate);

  const output = {
    // 這兩個欄位只是給人看的，網站不會用到
    _說明: "此檔由 scripts/fetch-taitung-events.mjs 自動產生，請勿手動編輯",
    _更新時間: new Date().toISOString(),
    events,
  };

  await writeFile(OUTPUT, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(`✅ 已寫入 ${events.length} 筆進行中的活動`);
  const skipped = raw.length - events.length;
  if (skipped > 0) console.log(`   （略過 ${skipped} 筆缺少名稱或日期的資料）`);
}

main().catch((err) => {
  console.error("❌ " + err.message);
  process.exit(1);
});
