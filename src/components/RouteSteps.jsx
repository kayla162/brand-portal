import { ChevronRight } from "lucide-react";

/**
 * 一連串「站點 → 站點 → 站點」的路線。
 * 行程頁（半日遊 / 一日遊）和交通頁都用這個，樣式才會一致。
 *
 * steps 是陣列，每一項 { emoji, name }，emoji 可以不給。
 * 會自動換行，手機上不會超出畫面。
 */
export default function RouteSteps({ steps, label = "路線" }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div>
      {label ? (
        <p className="text-[0.7rem] font-medium tracking-[0.22em] text-brass">
          {label}
        </p>
      ) : null}

      <ol className="mt-3.5 flex flex-wrap items-center gap-y-2">
        {steps.map((step, index) => (
          <li key={`${step.name}-${index}`} className="flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/8 px-3 py-1.5 text-[0.85rem] text-ink">
              {step.emoji ? <span aria-hidden="true">{step.emoji}</span> : null}
              {step.name}
            </span>

            {index < steps.length - 1 ? (
              <ChevronRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="mx-1 shrink-0 text-muted"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
