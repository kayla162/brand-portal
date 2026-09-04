# 空房日曆實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/stay` 顯示未來六個月的空房月曆，資料每小時自動從兩本房間 Google 日曆同步。

**Architecture:** 沿用 repo 既有的排程模式（`update-events.yml` 那一套）—— GitHub Actions 定期抓公開 `.ics`、解析成只含日期的 JSON、有變動才 commit、Vercel 自動重部署。前端讀死檔，沒有 runtime 依賴。

**Tech Stack:** Node 24（內建 `node:test`，不裝測試框架）、React 19、Tailwind v4、GitHub Actions、Vercel

**Spec:** `docs/superpowers/specs/2026-09-04-room-availability-calendar-design.md`

## Global Constraints

- **零成本。** 不得引入任何付費服務，也不得新增 npm 相依套件。
- **公開 repo。** 任何 commit 進去的檔案全世界可見；產出的 JSON 只能有日期與房間代號。
- **腳本不得讀取 `SUMMARY`、`ATTENDEE`、`DESCRIPTION`、`LOCATION`。** 只讀 `DTSTART` / `DTEND`。這是對「Google 共用設定被改錯」的程式層防呆。
- **`DTEND` 是不包含的。** 佔用夜晚 = `DTSTART` 到 `DTEND` 的前一天。（規格 §6）
- **任何一本日曆抓失敗 → 整個中止、不寫檔、workflow 失敗。** 只寫部分資料會讓抓取失敗偽裝成「有空房」。（規格 §7）
- **「今天」一律以 `Asia/Taipei` 判定**，不用瀏覽器或 runner 的時區。
- 文字內容一律放 `src/data/`，元件不寫死文案（本專案既有慣例）。
- 兩間房：`lotus`（荷花）、`mountain`（遠山）。

## 與規格的差異（寫計畫時發現，需留意）

**規格 §7 的「超過 24 小時顯示警示色」與 §3 的「有變動才 commit」互相衝突。**

若每次執行都寫入新的時間戳，檔案每小時都會不同，就會變成每小時都 commit 一次假異動。

**規格 §10 的檔案清單沒有 `scripts/lib/availability.mjs`。**

為了讓解析邏輯能被 `node:test` 直接測，把純函式從 `fetch-availability.mjs` 抽出來
獨立成模組。這是可測試性的必要拆分，不影響規格的任何決策。

**§7 時間戳的處理：** `generatedAt` 定義為「**資料最後異動時間**」，只在 `booked` 真的改變時才寫檔。排程壞掉的偵測改依賴 GitHub Actions 內建的失敗通知信（會寄給 repo 擁有者），不做 UI 警示色。沒有新訂房時顯示「更新於 3 天前」是誠實的，不構成誤導。

---

### Task 1: iCal 解析與佔用夜晚計算

整個功能風險最高的邏輯，獨立成純函式並以 `node:test` 完整覆蓋。這一步不碰網路、不碰檔案、不碰 React。

**Files:**
- Create: `scripts/lib/availability.mjs`
- Test: `scripts/lib/availability.test.mjs`
- Modify: `package.json`（加 `test` 指令）

**Interfaces:**
- Consumes: 無
- Produces:
  - `occupiedNights(icsText: string) => Set<string>` — 回傳 `"YYYY-MM-DD"` 集合
  - `buildPayload({ rooms, occupancyByRoom, today, generatedAt }) => object`
    - `rooms: Array<{ id: string, name: string }>`
    - `occupancyByRoom: Record<string, string[]>`
    - `today: string`（`"YYYY-MM-DD"`，Asia/Taipei）
    - `generatedAt: string`（ISO8601 含 `+08:00`）
    - 回傳 `{ generatedAt, rooms, booked: Record<string, string[]> }`

- [ ] **Step 1: 寫失敗的測試**

建立 `scripts/lib/availability.test.mjs`：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { occupiedNights, buildPayload } from "./availability.mjs";

/** 組出一段最小的 .ics，只放解析需要的欄位 */
function ics(...events) {
  return [
    "BEGIN:VCALENDAR",
    ...events.map((event) => `BEGIN:VEVENT\n${event}\nEND:VEVENT`),
    "END:VCALENDAR",
  ].join("\n");
}

test("單晚訂房只佔一個晚上", () => {
  const nights = occupiedNights(
    ics("DTSTART;VALUE=DATE:20260713\nDTEND;VALUE=DATE:20260714"),
  );
  assert.deepEqual([...nights], ["2026-07-13"]);
});

test("DTEND 不包含：19 到 21 佔兩晚，不含 21", () => {
  const nights = occupiedNights(
    ics("DTSTART;VALUE=DATE:20260719\nDTEND;VALUE=DATE:20260721"),
  );
  assert.deepEqual([...nights].sort(), ["2026-07-19", "2026-07-20"]);
  assert.ok(!nights.has("2026-07-21"), "退房日不該被算成客滿");
});

test("兩筆連著的訂房共用同一天，不會漏也不會重複", () => {
  // 真實資料：荷花的 7/19→7/21 與 7/21→7/24 是連著的兩組客人
  const nights = occupiedNights(
    ics(
      "DTSTART;VALUE=DATE:20260719\nDTEND;VALUE=DATE:20260721",
      "DTSTART;VALUE=DATE:20260721\nDTEND;VALUE=DATE:20260724",
    ),
  );
  assert.deepEqual(
    [...nights].sort(),
    ["2026-07-19", "2026-07-20", "2026-07-21", "2026-07-22", "2026-07-23"],
  );
});

test("跨月的訂房會正確展開", () => {
  const nights = occupiedNights(
    ics("DTSTART;VALUE=DATE:20260829\nDTEND;VALUE=DATE:20260901"),
  );
  assert.deepEqual(
    [...nights].sort(),
    ["2026-08-29", "2026-08-30", "2026-08-31"],
  );
});

test("非全天事件（有時間的）直接略過", () => {
  const nights = occupiedNights(
    ics("DTSTART:20260713T100000Z\nDTEND:20260713T120000Z"),
  );
  assert.equal(nights.size, 0);
});

test("完全不讀 SUMMARY，就算日曆設定被改錯也不會外流姓名", () => {
  const nights = occupiedNights(
    ics(
      "DTSTART;VALUE=DATE:20260713\nDTEND;VALUE=DATE:20260714\nSUMMARY:王小姐 0912345678\nATTENDEE:mailto:someone@example.com",
    ),
  );
  assert.deepEqual([...nights], ["2026-07-13"]);
});

const ROOMS = [
  { id: "lotus", name: "荷花" },
  { id: "mountain", name: "遠山" },
];

test("buildPayload 丟掉今天以前的日期", () => {
  const payload = buildPayload({
    rooms: ROOMS,
    occupancyByRoom: { lotus: ["2026-07-13", "2026-10-22"], mountain: [] },
    today: "2026-09-04",
    generatedAt: "2026-09-04T18:00:00+08:00",
  });
  assert.deepEqual(payload.booked, { "2026-10-22": ["lotus"] });
});

test("buildPayload 保留今天當天", () => {
  const payload = buildPayload({
    rooms: ROOMS,
    occupancyByRoom: { lotus: ["2026-09-04"], mountain: [] },
    today: "2026-09-04",
    generatedAt: "2026-09-04T18:00:00+08:00",
  });
  assert.deepEqual(payload.booked, { "2026-09-04": ["lotus"] });
});

test("同一天兩間都被訂，兩個房間代號都要在", () => {
  const payload = buildPayload({
    rooms: ROOMS,
    occupancyByRoom: { lotus: ["2026-10-22"], mountain: ["2026-10-22"] },
    today: "2026-09-04",
    generatedAt: "2026-09-04T18:00:00+08:00",
  });
  assert.deepEqual(payload.booked["2026-10-22"], ["lotus", "mountain"]);
});

test("日期與房間代號都排序過，否則每小時都會產生假異動", () => {
  const payload = buildPayload({
    rooms: ROOMS,
    occupancyByRoom: {
      mountain: ["2026-11-02", "2026-10-22"],
      lotus: ["2026-10-22"],
    },
    today: "2026-09-04",
    generatedAt: "2026-09-04T18:00:00+08:00",
  });
  assert.deepEqual(Object.keys(payload.booked), ["2026-10-22", "2026-11-02"]);
  assert.deepEqual(payload.booked["2026-10-22"], ["lotus", "mountain"]);
});
```

- [ ] **Step 2: 執行測試確認它失敗**

先在 `package.json` 的 `scripts` 加一行（放在 `optimize:images` 後面）：

```json
"test": "node --test scripts/lib/"
```

Run: `npm test`

Expected: FAIL，訊息類似 `Cannot find module .../scripts/lib/availability.mjs`

- [ ] **Step 3: 寫出最小實作**

建立 `scripts/lib/availability.mjs`：

```js
/**
 * ============================================================================
 *  空房資料的純邏輯（不碰網路、不碰檔案，方便用 node:test 驗）
 * ----------------------------------------------------------------------------
 *  ⚠️ 這裡刻意只讀 DTSTART / DTEND，絕對不讀 SUMMARY、ATTENDEE 之類的欄位。
 *     日曆目前設定為「只顯示空/忙」，但那是 Google 那一端的設定；
 *     哪天被改掉的話，這一層就是最後一道防線 —— 客人姓名不會寫進公開 repo。
 * ============================================================================
 */

const DAY_MS = 86400000;

/** "20260713" → 該日 UTC 零點的毫秒數。用 UTC 是為了避開日光節約與時區位移 */
function toUtcMs(compactDate) {
  const year = Number(compactDate.slice(0, 4));
  const month = Number(compactDate.slice(4, 6));
  const day = Number(compactDate.slice(6, 8));
  return Date.UTC(year, month - 1, day);
}

/** 毫秒數 → "YYYY-MM-DD" */
function toIsoDate(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * 從 .ics 內容取出「被佔用的夜晚」。
 *
 * ⚠️ 全天事件的 DTEND 是「不包含」的：9/10 入住、9/12 退房，
 *    佔用的是 9/10 與 9/11 兩晚，9/12 早上就空出來了。
 *    所以下面的迴圈條件是 ms < end，不是 ms <= end。
 *    寫成 <= 會讓退房日被誤標客滿，白白少接一天生意。
 */
export function occupiedNights(icsText) {
  const nights = new Set();

  for (const chunk of icsText.split("BEGIN:VEVENT").slice(1)) {
    const event = chunk.split("END:VEVENT")[0];

    // 只認全天事件。有時間的事件不是訂房（可能是屋主自己的提醒），略過
    const start = event.match(/^DTSTART;VALUE=DATE:(\d{8})/m)?.[1];
    const end = event.match(/^DTEND;VALUE=DATE:(\d{8})/m)?.[1];
    if (!start || !end) continue;

    for (let ms = toUtcMs(start); ms < toUtcMs(end); ms += DAY_MS) {
      nights.add(toIsoDate(ms));
    }
  }

  return nights;
}

/**
 * 把每間房的佔用夜晚合併成要寫出去的 JSON。
 *
 * 只記「被訂走的日期」，沒出現的日期就是全空 ——
 * 否則得決定「未來要列到哪一天」，而且檔案會無限長。
 *
 * 日期與房間代號都排序過。順序不穩定的話，內容明明沒變 JSON 也會不同，
 * 排程就會每小時 commit 一次假異動。
 */
export function buildPayload({ rooms, occupancyByRoom, today, generatedAt }) {
  const booked = {};

  for (const room of rooms) {
    for (const night of occupancyByRoom[room.id] ?? []) {
      // "YYYY-MM-DD" 是等寬格式，字串比較就等於日期比較
      if (night < today) continue;
      (booked[night] ??= []).push(room.id);
    }
  }

  const sorted = {};
  for (const date of Object.keys(booked).sort()) {
    sorted[date] = booked[date].sort();
  }

  return { generatedAt, rooms, booked: sorted };
}
```

- [ ] **Step 4: 執行測試確認全部通過**

Run: `npm test`

Expected: PASS，`# pass 10` / `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/availability.mjs scripts/lib/availability.test.mjs package.json
git commit -m "feat: 空房日曆的 iCal 解析邏輯，含 DTEND 不包含的邊界測試"
```

---

### Task 2: 抓取兩本日曆並產生 JSON

把 Task 1 的純邏輯接上真實的網路與檔案。

**Files:**
- Create: `src/data/availability.js`
- Create: `scripts/fetch-availability.mjs`
- Modify: `package.json`（加 `update:availability` 指令）
- Create（由腳本產生）: `src/data/availability.generated.json`

**Interfaces:**
- Consumes: Task 1 的 `occupiedNights()` 與 `buildPayload()`
- Produces:
  - `src/data/availability.js` 匯出 `availability`，含 `rooms`（每間有 `id` / `name` / `icsUrl`）、`monthsAhead` 與 UI 文案
  - `src/data/availability.generated.json`：`{ generatedAt, rooms, booked }`

- [ ] **Step 1: 建立設定資料檔**

建立 `src/data/availability.js`：

```js
/**
 * ============================================================================
 *  空房日曆的設定與文案
 * ----------------------------------------------------------------------------
 *  實際的空房資料在 availability.generated.json，由 GitHub Actions 每小時
 *  自動更新，請勿手動編輯那一支。這裡放的是「不會自動變」的東西。
 *
 *  ✚ 新增房間：在 rooms 加一個物件（id 用英文小寫、name 是對外顯示的名字、
 *    icsUrl 是那本日曆的公開 iCal 網址），然後跑 npm run update:availability。
 *    月曆每格的點數會自動跟著房間數變，不用改元件。
 *
 *  ⚠️ 日曆的共用設定必須是「將日曆公開」+「只顯示空/忙 (隱藏詳細資訊)」。
 *     若誤設成「查看所有活動詳細資訊」，客人姓名就會透過這個公開網址外流。
 *     抓取腳本不會讀取標題，所以不會寫進 repo，但外流發生在 Google 那一端，
 *     程式擋不住。
 *
 *  icsUrl 直接寫在這裡而不放環境變數：它們本來就是公開網址，而且這個 repo
 *  也是公開的，藏沒有意義。放資料檔反而符合本專案「內容都在 src/data/」的慣例。
 * ============================================================================
 */

export const availability = {
  rooms: [
    {
      id: "lotus",
      name: "荷花",
      icsUrl:
        "https://calendar.google.com/calendar/ical/a44c0bad237dc98db65330a0b8c0e5c583d725fe589124cb0057a45d065dd1e1%40group.calendar.google.com/public/basic.ics",
    },
    {
      id: "mountain",
      name: "遠山",
      icsUrl:
        "https://calendar.google.com/calendar/ical/f5464008bec9848344ae69f390cba05ac34bdea7ddda4f5fdc53394ab9321550%40group.calendar.google.com/public/basic.ics",
    },
  ],

  /** 最多可以往後翻幾個月（含當月）。往回翻沒有意義，不提供 */
  monthsAhead: 6,

  emoji: "📅",
  title: "空房查詢",
  subtitle: "實心的點代表這間房這天還訂得到。",
  legendAvailable: "可訂",
  legendBooked: "已訂",
  updatedPrefix: "資料更新於",
  disclaimer: "實際空房以詢問為準，確認後才算訂房成功。",
  previousMonth: "上個月",
  nextMonth: "下個月",
};

export default availability;
```

- [ ] **Step 2: 寫抓取腳本**

建立 `scripts/fetch-availability.mjs`：

```js
/**
 * ============================================================================
 *  抓兩本房間 Google 日曆，產生 src/data/availability.generated.json
 * ----------------------------------------------------------------------------
 *  這支腳本由 .github/workflows/update-availability.yml 每小時自動執行，
 *  你平常不需要手動跑。要手動跑的話：
 *
 *      npm run update:availability
 *
 *  想先看解析結果、不要寫檔：
 *
 *      npm run update:availability -- --check
 *
 *  ⚠️ 產出的 availability.generated.json 是自動產生的，不要手動編輯。
 *
 *  解析邏輯與它的測試在 scripts/lib/availability.mjs。
 * ============================================================================
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { availability } from "../src/data/availability.js";
import { buildPayload, occupiedNights } from "./lib/availability.mjs";

const OUTPUT = fileURLToPath(
  new URL("../src/data/availability.generated.json", import.meta.url),
);

const checkOnly = process.argv.includes("--check");

/** 台灣時間的今天。民宿在台東，入住日就是台灣時間，不跟著 runner 的時區跑 */
function taipeiToday() {
  // en-CA 的日期格式剛好就是 YYYY-MM-DD
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

/** 台灣時間的現在，格式 2026-09-04T18:05:00+08:00 */
function taipeiNow() {
  // sv-SE 的格式是 YYYY-MM-DD HH:mm:ss
  const stamp = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date());
  return `${stamp.replace(" ", "T")}+08:00`;
}

async function fetchRoom(room) {
  const response = await fetch(room.icsUrl);
  if (!response.ok) {
    throw new Error(`${room.name} 的日曆回應 HTTP ${response.status}`);
  }
  const text = await response.text();
  if (!text.includes("BEGIN:VCALENDAR")) {
    throw new Error(`${room.name} 的回應不是 iCal 內容`);
  }
  return [...occupiedNights(text)];
}

const { rooms } = availability;
const today = taipeiToday();

// ⚠️ 任何一本抓失敗就整個中止。
//    只寫入抓成功的那些房間的話，失敗的那一間會被當成整月全空 ——
//    抓取失敗會直接偽裝成「有空房」，是最糟的失敗模式。寧可維持舊資料。
let occupancyByRoom;
try {
  const results = await Promise.all(rooms.map(fetchRoom));
  occupancyByRoom = Object.fromEntries(
    rooms.map((room, index) => [room.id, results[index]]),
  );
} catch (error) {
  console.error(`❌ 抓取失敗，不寫檔，維持既有資料：${error.message}`);
  process.exit(1);
}

const payload = buildPayload({
  // 只把 id 與 name 寫進 JSON。icsUrl 是設定不是資料，不屬於產出檔
  rooms: rooms.map(({ id, name }) => ({ id, name })),
  occupancyByRoom,
  today,
  generatedAt: taipeiNow(),
});

for (const room of rooms) {
  const future = occupancyByRoom[room.id].filter((date) => date >= today);
  console.log(
    `  ${room.name.padEnd(4)} 未來已訂 ${String(future.length).padStart(3)} 晚`,
  );
}
console.log(`  有訂房的日期共 ${Object.keys(payload.booked).length} 天`);

if (checkOnly) {
  console.log("\n--check 模式，不寫檔。解析結果：");
  console.log(JSON.stringify(payload.booked, null, 2));
  process.exit(0);
}

// 只在「被訂走的日期」真的改變時才寫檔。
// generatedAt 每次都不一樣，若無條件寫入，排程會每小時 commit 一次假異動。
let previousBooked = null;
try {
  previousBooked = JSON.parse(await readFile(OUTPUT, "utf8")).booked;
} catch {
  // 檔案還不存在，第一次執行
}

if (JSON.stringify(previousBooked) === JSON.stringify(payload.booked)) {
  console.log("\n✅ 空房狀況沒有變動，不寫檔。");
  process.exit(0);
}

await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`\n✅ 已更新 ${OUTPUT}`);
```

- [ ] **Step 3: 加 npm 指令**

`package.json` 的 `scripts` 加一行（放在 `optimize:images` 後面）：

```json
"update:availability": "node scripts/fetch-availability.mjs"
```

- [ ] **Step 4: 用 --check 對真實日曆跑一次，人工核對邊界**

Run: `npm run update:availability -- --check`

Expected：印出兩間房的未來已訂晚數，以及 `booked` 的內容。

**核對重點**：已知遠山有一筆 `20261022` 的單晚訂房（`DTEND` 是 `20261023`），所以輸出裡應該要看到 `"2026-10-22": ["mountain"]`，**而且沒有 `2026-10-23`**。若出現 `2026-10-23`，就是 `DTEND` 的邊界寫錯了。

- [ ] **Step 5: 實際寫檔，並確認不會產生假異動**

Run: `npm run update:availability`

Expected: `✅ 已更新 .../availability.generated.json`

緊接著再跑一次：

Run: `npm run update:availability`

Expected: `✅ 空房狀況沒有變動，不寫檔。`

- [ ] **Step 6: 確認產出的檔案沒有任何個資**

Run: `grep -icE "summary|attendee|mailto|@" src/data/availability.generated.json`

Expected: `0`

- [ ] **Step 7: Commit**

```bash
git add src/data/availability.js src/data/availability.generated.json scripts/fetch-availability.mjs package.json
git commit -m "feat: 抓取房間日曆並產生空房資料，抓失敗即中止不寫檔"
```

---

### Task 3: GitHub Actions 每小時排程

**Files:**
- Create: `.github/workflows/update-availability.yml`
- Read first: `.github/workflows/update-events.yml`

**Interfaces:**
- Consumes: Task 2 的 `scripts/fetch-availability.mjs`
- Produces: 無（純自動化）

- [ ] **Step 1: 先讀既有的 workflow**

Run: `cat .github/workflows/update-events.yml`

照著它的 checkout / setup-node / commit 寫法做，兩支保持一致。特別注意它「有變動才 commit」是怎麼判斷的，沿用同一套。

- [ ] **Step 2: 建立 workflow**

建立 `.github/workflows/update-availability.yml`：

```yaml
# 每小時把兩本房間 Google 日曆的空房狀況同步到網站。
# 腳本只在「被訂走的日期」真的改變時才寫檔，所以不會每小時都產生 commit。
name: 更新空房資料

on:
  schedule:
    # 每小時的第 5 分。GitHub 的排程在尖峰時可能延遲，這是盡力而為不是保證。
    - cron: "5 * * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24

      # 這支腳本不需要任何相依套件，跳過 npm ci 可以省下大半執行時間
      - name: 抓取日曆並更新資料
        run: node scripts/fetch-availability.mjs

      - name: 有變動才 commit
        run: |
          if [ -z "$(git status --porcelain src/data/availability.generated.json)" ]; then
            echo "空房狀況沒有變動，跳過 commit。"
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add src/data/availability.generated.json
          git commit -m "chore: 自動更新空房資料"
          git push
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/update-availability.yml
git commit -m "ci: 每小時自動更新空房資料"
```

- [ ] **Step 4: 推上去後手動觸發一次**

推到 GitHub 之後，到 Actions 分頁 → 「更新空房資料」→ Run workflow。

Expected：綠燈。因為 Task 2 已在本機跑過、資料是最新的，這一次應該顯示「空房狀況沒有變動，跳過 commit。」

---

### Task 4: 月曆元件

**Files:**
- Create: `src/components/AvailabilityCalendar.jsx`
- Read first: `src/components/EnvironmentGallery.jsx`（沿用它的圓角、ring、陰影與按鈕樣式）

**Interfaces:**
- Consumes: `availability.generated.json` 的 `{ generatedAt, rooms, booked }`、`availability.js` 的文案與 `monthsAhead`
- Produces: `<AvailabilityCalendar rooms={...} booked={...} generatedAt={...} copy={...} />`
  - `rooms: Array<{ id: string, name: string }>`
  - `booked: Record<string, string[]>`
  - `generatedAt: string`
  - `copy: object`（`availability` 物件本身）

- [ ] **Step 1: 建立元件**

建立 `src/components/AvailabilityCalendar.jsx`：

```jsx
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ============================================================================
 *  空房月曆
 * ----------------------------------------------------------------------------
 *  資料來自 src/data/availability.generated.json（GitHub Actions 每小時更新），
 *  文案與房間清單來自 src/data/availability.js。這個元件只負責顯示。
 *
 *  每一格用「點」而不是文字表示狀態：手機 375px 寬、七欄格線，每格只有約
 *  45px，塞不下「剩 1 間」這種字。點也是語言無關的，日後增加房間只要多一顆點。
 *
 *  手機顯示一個月，桌機並排兩個月（一次看得到更多日期比較好挑）。
 *  切換一次移動一個月，所以桌機上翻頁會有一個月的重疊，這是刻意的。
 *
 *  ⚠️ 顏色與形狀不能是唯一的資訊來源，所以每一格另外給 aria-label，
 *     讓讀屏軟體念得出「10 月 22 日，2 間中剩 1 間」。
 * ============================================================================
 */

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 台灣時間的今天。民宿在台東，不能跟著瀏覽器所在時區跑 */
function taipeiToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

/** 某個月的格線：前面補 null 對齊星期，最後補滿整週 */
function monthCells(year, month) {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isoDate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** 單一個月的格線。桌機會並排兩個 */
function MonthGrid({ year, month, today, rooms, booked, className = "" }) {
  const cells = monthCells(year, month);

  return (
    <div className={className}>
      <p className="text-center font-serif text-lg font-medium sm:text-xl">
        {year} 年 {month + 1} 月
      </p>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label) => (
          <div key={label} className="pb-1 text-[0.7rem] font-medium text-muted">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} />;

          const date = isoDate(year, month, day);
          const past = date < today;
          const bookedRooms = booked[date] ?? [];
          const free = rooms.length - bookedRooms.length;

          return (
            <div
              key={date}
              aria-label={
                past
                  ? `${month + 1} 月 ${day} 日，已過`
                  : `${month + 1} 月 ${day} 日，${rooms.length} 間中剩 ${free} 間`
              }
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl ${
                past
                  ? "text-muted/35"
                  : free === 0
                    ? "bg-forest/[0.04] text-muted"
                    : "bg-forest/8 text-ink"
              }`}
            >
              <span className="text-[0.8rem] font-medium leading-none">{day}</span>

              {past ? null : (
                <span aria-hidden="true" className="flex gap-0.5">
                  {rooms.map((room) => (
                    <span
                      key={room.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        bookedRooms.includes(room.id)
                          ? "ring-1 ring-forest/30"
                          : "bg-forest"
                      }`}
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({ rooms, booked, generatedAt, copy }) {
  const today = useMemo(taipeiToday, []);
  const [thisYear, thisMonth] = today.split("-").map(Number);

  // offset 是「距離當月幾個月」。不提供往回翻 —— 看過去的日期對訂房沒有意義，
  // 還會讓人以為訂得到
  const [offset, setOffset] = useState(0);

  const first = new Date(Date.UTC(thisYear, thisMonth - 1 + offset, 1));
  const second = new Date(Date.UTC(thisYear, thisMonth + offset, 1));

  return (
    <div className="rounded-[1.75rem] bg-surface p-4 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-22px_rgba(16,24,40,0.16)] sm:p-8">
      {/* 導覽按鈕放在月曆「上方」而不是左右兩側。
          手機 375px 扣掉頁面與卡片留白只剩約 295px，若再被兩顆 44px 的按鈕
          夾住，七欄每格只剩 29px，數字加點根本塞不下。 */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOffset((value) => value - 1)}
          disabled={offset === 0}
          aria-label={copy.previousMonth}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest transition duration-300 ease-out hover:bg-forest/8 disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setOffset((value) => value + 1)}
          disabled={offset >= copy.monthsAhead - 1}
          aria-label={copy.nextMonth}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest transition duration-300 ease-out hover:bg-forest/8 disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <MonthGrid
          year={first.getUTCFullYear()}
          month={first.getUTCMonth()}
          today={today}
          rooms={rooms}
          booked={booked}
        />
        <MonthGrid
          year={second.getUTCFullYear()}
          month={second.getUTCMonth()}
          today={today}
          rooms={rooms}
          booked={booked}
          className="hidden lg:block"
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8rem] text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-forest" />
          {copy.legendAvailable}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full ring-1 ring-forest/30" />
          {copy.legendBooked}
        </span>
        <span>
          {rooms.map((room) => room.name).join("、")}　共 {rooms.length} 間
        </span>
      </div>

      <p className="mt-5 text-center text-[0.8rem] leading-relaxed text-muted">
        {copy.updatedPrefix} {generatedAt.slice(0, 16).replace("T", " ")}
        <br />
        {copy.disclaimer}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 確認 build 過**

Run: `npm run build`

Expected: `✓ built in ...`，無錯誤

- [ ] **Step 3: Commit**

```bash
git add src/components/AvailabilityCalendar.jsx
git commit -m "feat: 空房月曆元件，每格用點表示各房間可訂狀態"
```

---

### Task 5: 接進度假小屋頁

**Files:**
- Modify: `src/pages/StayPage.jsx`

**Interfaces:**
- Consumes: Task 4 的 `<AvailabilityCalendar>`、Task 2 的兩支資料檔
- Produces: 無

- [ ] **Step 1: 加 import**

在 `src/pages/StayPage.jsx` 既有的 import 區塊加入，依現有的字母順序擺放（`AvailabilityCalendar` 要在 `EnvironmentGallery` 前面）：

```js
import { availability } from "../data/availability.js";
import availabilityData from "../data/availability.generated.json";
import AvailabilityCalendar from "../components/AvailabilityCalendar.jsx";
```

- [ ] **Step 2: 把「環境介紹」尾端的訂房按鈕整段剪下**

在 `StayPage.jsx` 找到以這行註解開頭的整個 `<Reveal>` 區塊，**剪下**（Step 3 會貼回去）：

```jsx
          {/* 看完環境才心動的人，在這裡再接一次訂房 */}
```

理由見規格 §9：若日曆插在訂房按鈕之後，等於「叫人下訂 → 才給看有沒有空」，順序是反的。

- [ ] **Step 3: 插入新 section**

在 `{/* ==================== 度假小屋主人推薦 ==================== */}` 這行之前插入：

```jsx
      {/* ==================== 空房查詢 ==================== */}
      <section
        aria-labelledby="availability-heading"
        className="px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading
              emoji={availability.emoji}
              title={availability.title}
              description={availability.subtitle}
              titleId="availability-heading"
            />
          </Reveal>

          <Reveal>
            <div className="mt-10 sm:mt-12">
              <AvailabilityCalendar
                rooms={availabilityData.rooms}
                booked={availabilityData.booked}
                generatedAt={availabilityData.generatedAt}
                copy={availability}
              />
            </div>
          </Reveal>

          {/* Step 2 剪下的訂房按鈕貼在這裡：查完有沒有空，才接訂房 */}
        </div>
      </section>

```

接著把 Step 2 剪下的整段 `<Reveal>` 貼到上面那行註解的位置，並把它內層 div 的 `className="mt-10 flex justify-center"` 改成 `className="mt-8 flex justify-center"`。

- [ ] **Step 4: 更新檔案開頭的頁面流程註解**

把：

```
 *   Hero → 環境介紹（含房間洽詢）→ 度假小屋主人推薦 → 美食地圖入口
 *   → 在地體驗 → 我們的位置
```

改成：

```
 *   Hero → 環境介紹（含房間洽詢）→ 空房查詢 → 度假小屋主人推薦
 *   → 美食地圖入口 → 在地體驗 → 我們的位置
```

- [ ] **Step 5: Build 並在瀏覽器驗證**

Run: `npm run build`

Expected: 成功

啟動 dev server 開 `/stay`，在瀏覽器 console 執行：

```js
const sec = document.querySelector('section[aria-labelledby="availability-heading"]');
const cells = [...sec.querySelectorAll('[aria-label*="日，"]')];
({
  區塊存在: !!sec,
  日期格數: cells.length,
  有已過的格子: cells.some((c) => c.ariaLabel.includes('已過')),
  訂房按鈕在日曆之後: sec.querySelector('a[href*="docs.google.com"]') !== null,
  環境介紹已無訂房按鈕:
    document.querySelector('section[aria-labelledby="environment-heading"] a[href*="docs.google.com"]') === null,
  橫向溢出: document.documentElement.scrollWidth > document.documentElement.clientWidth ? '有' : '無',
})
```

Expected：`區塊存在: true`、`訂房按鈕在日曆之後: true`、`環境介紹已無訂房按鈕: true`、`橫向溢出: '無'`。

另外在 375px 與 1280px 各截圖看一次：手機應該只有一個月，桌機應該並排兩個月，七欄格線在手機上不能擠爆。

- [ ] **Step 6: Commit**

```bash
git add src/pages/StayPage.jsx
git commit -m "feat: 度假小屋頁加入空房查詢，訂房按鈕移到日曆之後"
```

---

### Task 6: 更新 README

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: 無
- Produces: 無

- [ ] **Step 1: 更新頁面流程圖**

把：

```
    │            Hero + 立即訂房 → 環境介紹 → 度假小屋主人推薦 → 美食地圖入口
    │            → 在地體驗 → 我們的位置
```

改成：

```
    │            Hero + 立即訂房 → 環境介紹 → 空房查詢 → 度假小屋主人推薦
    │            → 美食地圖入口 → 在地體驗 → 我們的位置
```

- [ ] **Step 2: 更新檔案結構清單**

`scripts/` 區塊改成：

```
│   ├── optimize-stay-images.mjs    把環境照原檔壓成網頁用的 WebP
│   ├── fetch-availability.mjs      抓房間日曆，產生空房資料
│   └── lib/availability.mjs        iCal 解析（含 node:test 測試）
```

`.github/workflows/` 區塊改成：

```
│   ├── update-events.yml           每天自動更新台東活動資料
│   └── update-availability.yml     每小時自動更新空房資料
```

`data/` 區塊加：

```
    │   ├── availability.js         空房日曆設定（房間、日曆網址）與文案
    │   ├── availability.generated.json  ★ 自動產生，請勿手動編輯
```

`components/` 區塊加：

```
        ├── AvailabilityCalendar.jsx 空房月曆
```

- [ ] **Step 3: 新增維護說明**

在「### 新增或替換環境照」那一節之前插入：

````markdown
### 空房日曆

資料來源是兩本 Google 日曆（荷花、遠山），一間房一本。
GitHub Actions 每小時抓一次，只在空房狀況真的改變時才 commit。

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
````

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README 補上空房日曆的維護方式"
```

---

## 完成後的驗收

- [ ] `npm test` 全過（10 個測試）
- [ ] `npm run build` 成功
- [ ] `grep -icE "summary|attendee|mailto|@" src/data/availability.generated.json` 回 `0`
- [ ] `/stay` 在 375px 與 1280px 都無橫向溢出；手機一個月、桌機兩個月
- [ ] 遠山的 `2026-10-22` 顯示「剩 1 間」，`2026-10-23` 顯示「剩 2 間」
- [ ] 環境介紹區已無訂房按鈕，該按鈕出現在日曆下方
- [ ] GitHub Actions 手動觸發一次為綠燈
