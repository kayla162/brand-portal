import { CalendarCheck, Globe } from "lucide-react";
import { Facebook, Instagram, Line } from "./icons/BrandIcons.jsx";

/**
 * ============================================================================
 *  社群 / 外部連結按鈕列
 * ----------------------------------------------------------------------------
 *  只吃 links 物件（來自 businesses.js 或 site.js），
 *  有哪個 key 就顯示哪顆按鈕，沒有的自動略過 —— 不需要改元件。
 *
 *  要新增一種連結（例如 YouTube、蝦皮）：
 *    1. 在下面 LINK_META 加一筆 { label, Icon }
 *    2. 在 ORDER 決定它出現的順序
 *    3. 在 businesses.js 的 links 加上該 key
 * ============================================================================
 */
const LINK_META = {
  facebook: { label: "Facebook", Icon: Facebook },
  instagram: { label: "Instagram", Icon: Instagram },
  line: { label: "LINE 官方帳號", Icon: Line },
  website: { label: "官方網站", Icon: Globe },
  booking: { label: "訂房網站", Icon: CalendarCheck },
};

/** 按鈕顯示順序 */
const ORDER = ["facebook", "instagram", "line", "website", "booking"];

/** 兩種配色：淺色卡片上 / 深色 Footer 上 */
const TONES = {
  light:
    "text-muted hover:bg-forest hover:text-white focus-visible:bg-forest focus-visible:text-white",
  dark: "text-white/65 hover:bg-white/15 hover:text-white focus-visible:bg-white/15 focus-visible:text-white",
};

export default function SocialLinks({
  links = {},
  /** 加在 aria-label 前面的品牌名稱，讓螢幕閱讀器知道是「誰的」Facebook */
  label = "",
  tone = "light",
  size = 19,
  className = "",
}) {
  const items = ORDER.filter((key) => LINK_META[key] && links[key]);
  if (items.length === 0) return null;

  return (
    <ul className={`-mx-2 flex items-center ${className}`}>
      {items.map((key) => {
        const { label: linkLabel, Icon } = LINK_META[key];
        const href = links[key];
        // 只有真正的 http(s) 網址才開新視窗，並加上安全屬性
        const isExternal = /^https?:\/\//i.test(href);
        const a11yLabel = label ? `${label}｜${linkLabel}` : linkLabel;

        return (
          <li key={key}>
            <a
              href={href}
              title={a11yLabel}
              aria-label={a11yLabel}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition duration-300 ease-out hover:-translate-y-0.5 ${TONES[tone]}`}
            >
              <Icon size={size} strokeWidth={1.75} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
