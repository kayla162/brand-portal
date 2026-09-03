import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal.jsx";

/**
 * ============================================================================
 *  環境照相簿（度假小屋頁的「環境介紹」區）
 * ----------------------------------------------------------------------------
 *  照片資料來自 src/data/environment.js，這個元件只負責顯示。
 *
 *  為什麼預設只顯示 8 張：
 *    共有 26 張照片，全部攤開的話手機上要滑十幾排才走得到下一區，
 *    後面的訂房按鈕會被埋得太深。預設收起來，想看的人點一下就有。
 *    順序永遠是資料裡的順序，展開只是把後面的接上去，不會重排。
 *
 *  照片統一裁成 4:3 顯示：
 *    原始照片橫幅直幅混雜，若照原比例排，每一排高度都不一樣會很凌亂。
 *    主體偏下方的照片在資料裡用 focus 欄位指定對焦位置，避免被裁掉。
 * ============================================================================
 */

/** 預設顯示張數。改這個數字就能調整「一開始看到幾張」 */
const INITIAL_COUNT = 8;

export default function EnvironmentGallery({ photos, moreLabel, lessLabel }) {
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef(null);

  const hasMore = photos.length > INITIAL_COUNT;
  const visiblePhotos = expanded || !hasMore ? photos : photos.slice(0, INITIAL_COUNT);

  function toggle() {
    const next = !expanded;
    setExpanded(next);

    // 收合時上方會突然少掉十幾排，畫面等於瞬間往下跳一大段。
    // 把按鈕捲回視線內，使用者才不會迷路。
    if (!next) {
      requestAnimationFrame(() => {
        toggleRef.current?.scrollIntoView({ block: "center" });
      });
    }
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visiblePhotos.map((photo, index) => (
          <li key={photo.id}>
            {/* 進場動畫的延遲最多累積到第 8 張，否則展開後最後一張要等兩秒多才出現 */}
            <Reveal delay={Math.min(index, INITIAL_COUNT - 1) * 60}>
              <figure className="overflow-hidden rounded-[1.25rem] bg-forest/8 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_32px_-18px_rgba(16,24,40,0.12)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_28px_48px_-24px_rgba(16,24,40,0.22)]">
                <div className="aspect-[4/3]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={1280}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    style={photo.focus ? { objectPosition: photo.focus } : undefined}
                    className="h-full w-full object-cover"
                  />
                </div>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            className="group/toggle inline-flex min-h-11 items-center gap-2 rounded-full bg-forest/8 px-5 py-2.5 text-sm font-medium text-forest transition-[translate,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-forest hover:text-white"
          >
            {expanded
              ? lessLabel
              : moreLabel.replace("{count}", String(photos.length))}
            <ChevronDown
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={`transition-transform duration-300 ease-out ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
