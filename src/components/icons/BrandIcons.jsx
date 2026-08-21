/**
 * ============================================================================
 *  品牌 Icon（Facebook / Instagram / LINE）
 * ----------------------------------------------------------------------------
 *  lucide-react v1 起已把所有「品牌商標」類 icon 移除，
 *  所以這三顆自己畫，並且刻意做成與 Lucide 相同的 API 與線條風格
 *  （24x24 viewBox、stroke=currentColor、圓角線帽），視覺才會一致。
 * ============================================================================
 */

const base = (props) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
  ...props,
});

export function Facebook({ size = 24, strokeWidth = 1.75, ...props }) {
  return (
    <svg {...base(props)} width={size} height={size} strokeWidth={strokeWidth}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Instagram({ size = 24, strokeWidth = 1.75, ...props }) {
  return (
    <svg {...base(props)} width={size} height={size} strokeWidth={strokeWidth}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function Line({ size = 24, strokeWidth = 1.75, ...props }) {
  return (
    <svg {...base(props)} width={size} height={size} strokeWidth={strokeWidth}>
      <path d="M21 11.1c0 4.2-4 7.6-9 7.6-.86 0-1.7-.1-2.5-.29L4.6 21l.93-3.53A7.35 7.35 0 0 1 3 11.1C3 6.9 7 3.5 12 3.5s9 3.4 9 7.6Z" />
      <path d="M9.4 8.9v4.3h2.7" />
    </svg>
  );
}
