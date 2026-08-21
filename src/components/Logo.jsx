import { useId } from "react";

/**
 * 品牌 Logo 標誌 —— 抽象「入口／拱門」造型，象徵品牌總入口。
 * 換成自己的 logo：把整段 <svg> 換掉，或直接改成 <img src="/logo.svg" />。
 */
export default function Logo({ className = "h-11 w-11", tone = "dark" }) {
  const gradientId = useId();
  const isDark = tone === "dark";

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="品牌標誌"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#2C544A" />
              <stop offset="100%" stopColor="#152C25" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E7E1D8" />
            </>
          )}
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M12.5 28.5V19a7.5 7.5 0 0 1 15 0v9.5"
        fill="none"
        stroke={isDark ? "#FBF9F6" : "#1E3B33"}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M20 28.5v-6.2"
        fill="none"
        stroke={isDark ? "#A9834E" : "#A9834E"}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
