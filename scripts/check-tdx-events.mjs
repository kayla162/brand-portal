/**
 * ============================================================================
 *  TDX 觀光活動資料 — 先確認台東有沒有可用的資料
 * ----------------------------------------------------------------------------
 *  這支腳本「只讀不寫」，不會動到網站任何檔案。
 *  目的是在花時間建自動更新流程之前，先看清楚三件事：
 *    1. 台東縣總共有幾筆活動資料
 *    2. 其中「現在進行中」的有幾筆
 *    3. 這些活動分布在哪些鄉鎮（長濱附近有沒有）
 *
 *  怎麼跑（不要把金鑰寫進檔案，用環境變數傳）：
 *
 *    Windows PowerShell：
 *      $env:TDX_CLIENT_ID="你的 Client Id"
 *      $env:TDX_CLIENT_SECRET="你的 Client Secret"
 *      node scripts/check-tdx-events.mjs
 *
 *  金鑰申請：https://tdx.transportdata.tw → 註冊會員 → 會員專區 → 建立 API 金鑰
 * ============================================================================
 */

const AUTH_URL =
  "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
const API_BASE = "https://tdx.transportdata.tw/api/tourism/service/odata/V2/Tourism";

// 官方資料用的是「臺」東縣（正體），不是「台」東縣 —— 這是最常踩到的坑
const CITY = "臺東縣";

const clientId = process.env.TDX_CLIENT_ID;
const clientSecret = process.env.TDX_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("❌ 找不到金鑰。請先設定環境變數 TDX_CLIENT_ID 與 TDX_CLIENT_SECRET。");
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

  const data = await res.json();
  return data.access_token;
}

/** 呼叫 Event 端點。params 是 OData 參數，例如 { $filter: "...", $top: 500 } */
async function fetchEvents(token, params) {
  const url = `${API_BASE}/Event?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${token}`, accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`查詢失敗：HTTP ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/** 取得現在時間的 OData 日期字串，例如 "2026-08-31T14:30:00" */
function nowForOData() {
  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function main() {
  console.log("正在取得 token…");
  const token = await getToken();
  console.log("✅ token 取得成功\n");

  const cityFilter = `LocatedCities/any(c: c/City eq '${CITY}')`;

  // ---- 1. 台東縣所有活動 ----
  const all = await fetchEvents(token, { $filter: cityFilter, $top: 1000 });
  console.log(`【1】${CITY} 活動總筆數：${all.length}`);

  if (all.length === 0) {
    console.log(`\n⚠️ 查不到任何 ${CITY} 的活動。`);
    console.log("   可能是縣市名稱寫法不同，下面列出資料裡實際出現的縣市名稱：");
    const sample = await fetchEvents(token, { $top: 200 });
    const cities = new Set();
    sample.forEach((e) => (e.LocatedCities ?? []).forEach((c) => cities.add(c.City)));
    console.log("   " + [...cities].sort().join("、"));
    return;
  }

  // ---- 2. 現在進行中的活動 ----
  const now = nowForOData();
  const ongoing = await fetchEvents(token, {
    $filter: `${cityFilter} and StartDateTime le ${now} and EndDateTime ge ${now}`,
    $orderby: "EndDateTime asc",
    $top: 1000,
  });
  console.log(`【2】現在進行中：${ongoing.length} 筆\n`);

  // ---- 3. 分布在哪些鄉鎮 ----
  const townCount = {};
  all.forEach((e) =>
    (e.LocatedCities ?? [])
      .filter((c) => c.City === CITY && c.Town)
      .forEach((c) => (townCount[c.Town] = (townCount[c.Town] ?? 0) + 1))
  );
  const towns = Object.entries(townCount).sort((a, b) => b[1] - a[1]);
  console.log("【3】活動分布的鄉鎮（由多到少）：");
  console.log("   " + towns.map(([t, n]) => `${t} ${n}`).join("、"));
  console.log(`   長濱鄉：${townCount["長濱鄉"] ?? 0} 筆\n`);

  // ---- 4. 進行中活動的實際內容（看資料品質）----
  console.log("【4】進行中活動前 10 筆：");
  ongoing.slice(0, 10).forEach((e, i) => {
    const town = (e.LocatedCities ?? []).find((c) => c.City === CITY)?.Town ?? "－";
    const start = (e.StartDateTime ?? "").slice(0, 10);
    const end = (e.EndDateTime ?? "").slice(0, 10);
    const hasDesc = e.Description ? `${e.Description.length} 字` : "無描述";
    const hasUrl = e.WebsiteUrl ? "有官網" : "無官網";
    const hasImg = (e.Images ?? []).length > 0 ? "有照片" : "無照片";
    console.log(
      `   ${String(i + 1).padStart(2)}. ${e.EventName}\n` +
        `       ${start} ~ ${end}｜${town}｜${hasDesc}｜${hasUrl}｜${hasImg}`
    );
  });

  // ---- 5. 欄位完整度 ----
  const filled = (key) => ongoing.filter((e) => e[key]).length;
  console.log("\n【5】進行中活動的欄位完整度：");
  console.log(`   有 Description：${filled("Description")} / ${ongoing.length}`);
  console.log(`   有 WebsiteUrl ：${filled("WebsiteUrl")} / ${ongoing.length}`);
  console.log(
    `   有座標        ：${ongoing.filter((e) => e.PositionLat).length} / ${ongoing.length}`
  );
  console.log(
    `   有照片        ：${ongoing.filter((e) => (e.Images ?? []).length > 0).length} / ${ongoing.length}`
  );
}

main().catch((err) => {
  console.error("\n❌ " + err.message);
  process.exit(1);
});
