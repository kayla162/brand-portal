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

  /** 主月曆最多往後翻幾個月（含當月）；桌機右側會多顯示下一個月，所以桌機最遠看得到第 7 個月。往回翻沒有意義，不提供。 */
  monthsAhead: 6,

  emoji: "📅",
  title: "空房查詢",
  subtitle: "實心的點代表這間房這天還訂得到。",

  /** 月曆格子與圖例的樣板文字，{ } 佔位字會被換成實際數字 */
  pastLabel: "{month} 月 {day} 日，已過",
  cellLabel: "{month} 月 {day} 日，{total} 間中剩 {free} 間",
  roomCountSuffix: "共 {count} 間",

  legendAvailable: "可訂",
  legendBooked: "已訂",
  updatedPrefix: "資料更新於",
  disclaimer: "實際空房以詢問為準，確認後才算訂房成功。",
  previousMonth: "上個月",
  nextMonth: "下個月",
};

export default availability;
