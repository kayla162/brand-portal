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

// ⚠️ 刻意不用 process.exit()：在 Windows 上，process.exit() 有機率撞上
//    fetch（undici）底層 socket 收尾的 race condition，導致原生層丟出
//    UV_HANDLE_CLOSING 的 assertion 崩潰（--check 模式下已重現過）。
//    改成讓 main() 自然 return、事件迴圈自己清空再結束，socket 才有
//    時間先關好，所有平台、所有分支都不會撞。之後要中止腳本一律用
//    process.exitCode + return，不要再叫 process.exit()。
async function main() {
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
    process.exitCode = 1;
    return;
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
    return;
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
    return;
  }

  await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`\n✅ 已更新 ${OUTPUT}`);
}

await main();
