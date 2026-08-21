/**
 * ============================================================================
 *  網站層級的文字內容（Header / Hero / 區塊標題 / Footer / 聯絡資訊）
 * ----------------------------------------------------------------------------
 *  這裡是「網站本身」的資料；各個品牌的資料放在 businesses.js。
 *  React 元件只負責顯示，所有文字都改這一支檔案即可。
 * ============================================================================
 */

export const site = {
  /** 品牌總稱（Header、Footer、SEO 都會用到） */
  brandName: "和顏悦舍",
  /** 英文／副標識別，放在 logo 下方的小字（不需要可設為空字串） */
  brandNameLatin: "HE-YAN GLAMPING SITE",
  /** Header 的一句話品牌標語 */
  tagline: "期待與你 / 妳在山海間相遇",

  /** Hero 區（首頁最上方） */
  hero: {
    eyebrow: "享受生活入口",
    title: "和顏悦舍",
    subtitle: "住進來，開始探索 台東 這座城市 ",
    scrollLabel: "向下探索",
  },

  /** 品牌卡片區的區塊標題 */
  brandsSection: {
    eyebrow: "我們的品牌",
    title: "住宿 / 生活 / 體驗",
    description:
      "每一個品牌都有各自的社群與官方網站。點擊卡片上的按鈕，直接前往你想去的地方。",
  },

  /** Footer 聯絡資訊 —— 請換成你的真實資訊 */
  contact: {
    phone: "+886 910-991988",
    address: "台東縣長濱鄉忠勇村6鄰忠勇26-12號",
  },

  /** Footer 的官方社群（與各品牌的社群分開） */
  // social: {
  //   facebook: "#",
  //   instagram: "#",
  //   line: "#",
  // },

  /** Copyright 年份 */
  copyrightYear: 2026,
};

export default site;
