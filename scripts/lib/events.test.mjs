import test from "node:test";
import assert from "node:assert/strict";
import { taipeiToday, isOngoing } from "./events.mjs";

test("台北今天：UTC 深夜在台北已經是隔天", () => {
  // 這是真實的排程時間：workflow 在 UTC 23:19 跑，台灣已經是 9/16 早上
  assert.equal(taipeiToday(new Date("2026-09-15T23:19:38Z")), "2026-09-16");
});

test("台北今天：UTC 白天還是同一天", () => {
  assert.equal(taipeiToday(new Date("2026-09-16T04:00:00Z")), "2026-09-16");
});

test("台北今天：剛好跨日的那一秒", () => {
  // UTC 16:00 整 = 台北隔天 00:00
  assert.equal(taipeiToday(new Date("2026-09-15T15:59:59Z")), "2026-09-15");
  assert.equal(taipeiToday(new Date("2026-09-15T16:00:00Z")), "2026-09-16");
});

test("開始日當天就算進行中", () => {
  assert.ok(isOngoing({ startDate: "2026-09-16", endDate: "2026-09-20" }, "2026-09-16"));
});

test("結束日當天仍算進行中：活動辦到那天結束，不該提早下架", () => {
  assert.ok(isOngoing({ startDate: "2026-09-10", endDate: "2026-09-16" }, "2026-09-16"));
});

test("結束日隔天就不算了", () => {
  assert.ok(!isOngoing({ startDate: "2026-09-10", endDate: "2026-09-15" }, "2026-09-16"));
});

test("還沒開始的不算", () => {
  assert.ok(!isOngoing({ startDate: "2026-09-17", endDate: "2026-09-20" }, "2026-09-16"));
});

test("缺日期的資料一律不算，免得網站顯示怪東西", () => {
  assert.ok(!isOngoing({ startDate: "", endDate: "2026-09-20" }, "2026-09-16"));
  assert.ok(!isOngoing({ startDate: "2026-09-10", endDate: "" }, "2026-09-16"));
  assert.ok(!isOngoing({}, "2026-09-16"));
});
