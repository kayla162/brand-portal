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
