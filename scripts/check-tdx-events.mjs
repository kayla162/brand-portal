/**
 * ============================================================================
 *  TDX 觀光活動資料 — 先確認台東有沒有可用的資料
 * ----------------------------------------------------------------------------
 *  這支腳本「只讀不寫」，不會動到網站任何檔案。
 *  目的是在花時間建自動更新流程之前，先看清楚：
 *    1. 台東縣總共有幾筆活動資料
 *    2. 其中「現在進行中」的有幾筆
 *    3. 活動分布在哪些鄉鎮（長濱附近有沒有）
 *    4. 欄位完整度（有沒有描述、官網、座標、照片）
 *
 *  怎麼跑（金鑰放在 scripts/.env，格式是 KEY=VALUE，不要加 $env: 前綴）：
 *
 *      node --env-file=scripts/.env scripts/check-tdx-events.mjs
 *
 *  金鑰申請：https://tdx.transportdata.tw → 註冊會員 → 會員專區 → 建立 API 金鑰
 *
 *  ⚠️ scripts/.env 已被 .gitignore 忽略，不會進版控。不要把金鑰寫進這支程式。
 * ============================================================================
 */

const AUTH_URL =
  "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
const API_BASE = "https://tdx.transportdata.tw/api/tourism/service/odata/V2/Tourism";

// 官方資料用的是「臺」東縣（正體），不是「台」東縣 —— 這是最常踩到的坑
const CITY = "臺東縣";

// TDX 的 $top 上限是 500，超過會回 HTTP 400
const PAGE_SIZE = 500;

const clientId = process.env.TDX_CLIENT_ID;
const clientSecret = process.env.TDX_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("❌ 找不到金鑰。請確認 scripts/.env 內有 TDX_CLIENT_ID 與 TDX_CLIENT_SECRET，");
  console.error("   並用 node --env-file=scripts/.env 執行。");
  process.exit(1);
}

/** 用 client_credentials 換一個 access token（有效期約 24 小時） */
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

/** 呼叫一次 Event 端點 */
async function fetchPage(token, params) {
  const res = await fetch(`${API_BASE}/Event?${new URLSearchParams(params)}`, {
    headers: { authorization: `Bearer ${token}`, accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`查詢失敗：HTTP ${res.status} ${await res.text()}`);
  }

  // 實際回傳是 OData 信封 { value: [...] }，不是 swagger 上寫的純陣列
  const data = await res.json();
  return Array.isArray(data) ? data : (data.value ?? []);
}

/** 一直往下翻頁，直到某一頁不滿一頁為止 */
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

async function main() {
  console.log("正在取得 token…");
  const token = await getToken();
  console.log("✅ token 取得成功\n");

  // 注意：Event 的 LocatedCities 在實際資料裡永遠是空陣列，
  // 真正的縣市／鄉鎮資訊在 PostalAddress 裡面。
  const cityFilter = `PostalAddress/City eq '${CITY}'`;

  // ---- 1. 台東縣所有活動 ----
  const all = await fetchAll(token, { $filter: cityFilter });
  console.log(`【1】${CITY} 活動總筆數：${all.length}`);

  if (all.length === 0) {
    console.log(`\n⚠️ 查不到任何 ${CITY} 的活動。以下是資料裡實際出現的縣市名稱：`);
    const sample = await fetchPage(token, { $top: 300 });
    const cities = new Set();
    sample.forEach((e) => e.PostalAddress?.City && cities.add(e.PostalAddress.City));
    console.log("   " + [...cities].sort().join("、"));
    return;
  }

  // ---- 2. 現在進行中的活動 ----
  const now = nowForOData();
  const ongoing = await fetchAll(token, {
    $filter: `${cityFilter} and StartDateTime le ${now} and EndDateTime ge ${now}`,
    $orderby: "EndDateTime asc",
  });
  console.log(`【2】現在進行中：${ongoing.length} 筆\n`);

  // ---- 3. 分布在哪些鄉鎮 ----
  const townCount = {};
  all.forEach((e) => {
    const town = e.PostalAddress?.Town;
    if (town) townCount[town] = (townCount[town] ?? 0) + 1;
  });
  const towns = Object.entries(townCount).sort((a, b) => b[1] - a[1]);
  console.log("【3】活動分布的鄉鎮（由多到少）：");
  console.log("   " + towns.map(([t, n]) => `${t} ${n}`).join("、"));
  console.log(`   → 長濱鄉：${townCount["長濱鄉"] ?? 0} 筆\n`);

  // ---- 4. 進行中活動的實際內容 ----
  console.log("【4】進行中活動（最多列 15 筆）：");
  ongoing.slice(0, 15).forEach((e, i) => {
    const town = e.PostalAddress?.Town ?? "－";
    const start = (e.StartDateTime ?? "").slice(0, 10);
    const end = (e.EndDateTime ?? "").slice(0, 10);
    const desc = e.Description ? `描述 ${e.Description.length} 字` : "無描述";
    const url = e.WebsiteUrl ? "有官網" : "無官網";
    const img = (e.Images ?? []).length > 0 ? "有照片" : "無照片";
    console.log(`   ${String(i + 1).padStart(2)}. ${e.EventName}`);
    console.log(`       ${start} ~ ${end}｜${town}｜${desc}｜${url}｜${img}`);
  });

  // ---- 5. 欄位完整度 ----
  const n = ongoing.length || 1;
  const pct = (c) => `${c} / ${ongoing.length}（${Math.round((c / n) * 100)}%）`;
  console.log("\n【5】進行中活動的欄位完整度：");
  console.log(`   有描述：${pct(ongoing.filter((e) => e.Description).length)}`);
  console.log(`   有官網：${pct(ongoing.filter((e) => e.WebsiteUrl).length)}`);
  console.log(`   有座標：${pct(ongoing.filter((e) => e.PositionLat).length)}`);
  console.log(`   有照片：${pct(ongoing.filter((e) => (e.Images ?? []).length > 0).length)}`);
}

main().catch((err) => {
  console.error("\n❌ " + err.message);
  process.exit(1);
});
