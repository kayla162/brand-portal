/**
 * ============================================================================
 *  美食地圖資料（度假小屋主人推薦 + /food-map 頁面共用同一份）
 * ----------------------------------------------------------------------------
 *  欄位說明：
 *    id          唯一代號（英文小寫）
 *    name        店家名稱
 *    category    分類代號，必須是下面 foodCategories 其中一個的 id
 *                卡片上的圖示會自動用該分類的 emoji，不用另外設定
 *    description 一句話介紹
 *    highlight   true 會顯示「⭐ 最推薦」標籤
 *    mapUrl      Google Maps 連結（外部網址，不需要 API 金鑰）
 *                打開後找到的店不對，直接改這一行即可
 *    featured    true 的店家會出現在度假小屋頁的「度假小屋主人推薦」區
 *                建議維持 3 家，推薦區是 3 欄，剛好排滿一列
 * ============================================================================
 */

/** 分類。顯示順序＝這個陣列的順序。 */
export const foodCategories = [
  { id: "breakfast", label: "早餐", emoji: "🥟" },
  { id: "cafe", label: "咖啡與下午茶", emoji: "☕" },
  { id: "homestyle", label: "想吃家常菜", emoji: "🍚" },
  { id: "chef", label: "無菜單料理", emoji: "🐟" },
];

/** 頁面上的提醒文字 */
export const foodNotes = {
  general:
    "長濱的店家多為在地小店，營業時間可能依店家狀況調整，出發前建議先電話或官方社群確認。",
  tip: {
    emoji: "🌊",
    title: "小提醒",
    text: "晚上選擇會比白天少，如果晚上抵達，建議提前吃飯或先詢問店家營業狀況。",
  },
};

/** 用店名 + 台東長濱組 Google Maps 搜尋連結 */
const mapUrl = (name) =>
  `https://www.google.com/maps/search/?api=1&query=${name} 台東長濱`;

export const foodShops = [
  // ---------- 🥟 早餐 ----------
  {
    id: "breakfast-baozi",
    name: "長濱包子店",
    category: "breakfast",
    description:
      "當地人極力推薦的老字號傳統手工包子，麵皮紮實 Q 彈、內餡香濃多汁。",
    highlight: false,
    mapUrl: mapUrl("長濱包子店"),
    featured: true,
  },
  {
    id: "breakfast-xiaoayi",
    name: "小阿姨早餐店",
    category: "breakfast",
    description:
      "充滿家常人情味的古早味早餐店，提供熱騰騰的蛋餅、肉包與現煮豆漿。",
    highlight: false,
    mapUrl: mapUrl("小阿姨早餐店"),
    featured: false,
  },
  {
    id: "breakfast-sinfood",
    name: "sin-food 好食",
    category: "breakfast",
    description: "結合在地新鮮食材的手作早午餐，餐點精緻健康，呈現充滿質感的風味。",
    highlight: false,
    mapUrl: mapUrl("sin-food 好食"),
    featured: false,
  },
  {
    id: "breakfast-sanjianwu",
    name: "三間屋早餐店",
    category: "breakfast",
    description:
      "位在長濱北端村落的在地小店，提供最純粹樸實的經典台式早餐與濃厚古早味。",
    highlight: false,
    mapUrl: mapUrl("三間屋早餐店"),
    featured: false,
  },
  {
    id: "breakfast-jiazouwan",
    name: "早點加走灣",
    category: "breakfast",
    description:
      "將傳統早點結合原住民與在地特色，餐點品項豐富，是開啟東海岸晨光的熱門選擇。",
    highlight: false,
    mapUrl: mapUrl("早點加走灣"),
    featured: false,
  },

  // ---------- ☕ 咖啡與下午茶 ----------
  {
    id: "cafe-huazhai",
    name: "花宅咖啡",
    category: "cafe",
    description:
      "隱身於老宅中的溫馨咖啡館，充滿復古氛圍，提供精緻手沖咖啡與手作甜點。",
    highlight: true,
    mapUrl: mapUrl("花宅咖啡"),
    featured: true,
  },
  {
    id: "cafe-zaihaiyifang",
    name: "在海一芳",
    category: "cafe",
    description:
      "擁有極佳海景視野的療癒系咖啡店，能邊啜飲咖啡邊遠眺太平洋的無敵景致。",
    highlight: false,
    mapUrl: mapUrl("在海一芳"),
    featured: false,
  },
  {
    id: "cafe-judashaonian",
    name: "巨大少年",
    category: "cafe",
    description:
      "風格鮮明獨特的個性咖啡店，專注於自家烘焙單品咖啡，深受咖啡愛好者喜愛。",
    highlight: false,
    mapUrl: mapUrl("巨大少年"),
    featured: false,
  },

  // ---------- 🍚 想吃家常菜 ----------
  {
    id: "homestyle-xinjia",
    name: "馨家小廚",
    category: "homestyle",
    description: "溫馨的家常熱炒與台菜小館，嚴選在地鮮美海鮮，口味道地且價格親民。",
    highlight: false,
    mapUrl: mapUrl("馨家小廚"),
    featured: true,
  },
  {
    id: "homestyle-hadila",
    name: "哈地喇",
    category: "homestyle",
    description: "主打風味熱炒與在地特色料理，澎湃大份量非常適合親朋好友聚餐共食。",
    highlight: false,
    mapUrl: mapUrl("哈地喇"),
    featured: false,
  },
  {
    id: "homestyle-luma",
    name: "魯瑪私房菜",
    category: "homestyle",
    description:
      "結合原住民風味與部落特色菜餚，運用豐富山林野草與當季食材入菜。",
    highlight: false,
    mapUrl: mapUrl("魯瑪私房菜"),
    featured: false,
  },
  {
    id: "homestyle-sanxiongdi",
    name: "三兄弟的店",
    category: "homestyle",
    description:
      "主打現撈平價海鮮與在地家常菜，料理鮮甜實惠，是極具在地口碑的人氣小吃。",
    highlight: false,
    mapUrl: mapUrl("三兄弟的店"),
    featured: false,
  },
  {
    id: "homestyle-chongzi",
    name: "蟲子麵店",
    category: "homestyle",
    description:
      "以特製麵食與獨門醬汁聞名的在地麵館，湯頭鮮美，是想簡單吃一頓美味的好去處。",
    highlight: false,
    mapUrl: mapUrl("蟲子麵店"),
    featured: false,
  },

  // ---------- 🐟 無菜單料理 ----------
  {
    id: "chef-meihao",
    name: "美好時光",
    category: "chef",
    description:
      "預約制精緻無菜單料理，將部落食材結合現代烹調藝術，營造如家一般的溫暖用餐氛圍。",
    highlight: false,
    mapUrl: mapUrl("美好時光"),
    featured: false,
  },
  {
    id: "chef-changguang",
    name: "長光食作",
    category: "chef",
    description: "嚴選長濱在地農漁產，以細緻工法呈現原汁原味的私房無菜單宴席。",
    highlight: false,
    mapUrl: mapUrl("長光食作"),
    featured: false,
  },
  {
    id: "chef-wanjinlai",
    name: "彎進來",
    category: "chef",
    description: "隱密於巷弄間的個性私廚，菜色融合多國料理風格與東海岸在地新鮮元素。",
    highlight: false,
    mapUrl: mapUrl("彎進來"),
    featured: false,
  },
  {
    id: "chef-xiaoli",
    name: "小麗廚房",
    category: "chef",
    description:
      "遠眺海景的溫馨無菜單料理，菜色豐富且充滿家常手作溫暖，深受饕客喜愛。",
    highlight: false,
    mapUrl: mapUrl("小麗廚房"),
    featured: false,
  },
  {
    id: "chef-musen",
    name: "沐森海岸",
    category: "chef",
    description: "主打極致海鮮與無敵海景的無菜單餐廳，讓視覺與味覺同時享受山海盛宴。",
    highlight: false,
    mapUrl: mapUrl("沐森海岸"),
    featured: false,
  },
  {
    id: "chef-yigeng",
    name: "一耕食堂",
    category: "chef",
    description: "結合在地友善農產與當季海鮮，菜色簡約純粹，展現風土原味的精緻料理。",
    highlight: false,
    mapUrl: mapUrl("一耕食堂"),
    featured: false,
  },
  {
    id: "chef-changbin100",
    name: "長濱100號",
    category: "chef",
    description: "長濱極具代表性的預約制無菜單小館，餐點高 CP 值且道道驚艷。",
    highlight: false,
    mapUrl: mapUrl("長濱100號"),
    featured: false,
  },
  {
    id: "chef-chicaopu",
    name: "齒草埔料理人的家",
    category: "chef",
    description:
      "將季節感與哲學概念融入菜單，呈現猶如法式精緻藝術般的獨特料理體驗。",
    highlight: false,
    mapUrl: mapUrl("齒草埔料理人的家"),
    featured: false,
  },
  {
    id: "chef-liai",
    name: "里艾廚房",
    category: "chef",
    description:
      "融合阿美族傳統飲食智慧與創意料理，帶給饕客極具層次的原民風味美饌。",
    highlight: false,
    mapUrl: mapUrl("里艾廚房"),
    featured: false,
  },
  {
    id: "chef-yeyue",
    name: "夜月",
    category: "chef",
    description: "氣氛唯美且充滿神秘感的無菜單料理，結合微醺調酒與精緻深夜美食。",
    highlight: false,
    mapUrl: mapUrl("夜月"),
    featured: false,
  },
];

export default foodShops;
