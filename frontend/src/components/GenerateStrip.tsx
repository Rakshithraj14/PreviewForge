import { CODEGEN_TARGETS } from "../lib/codegen";
import type { CodegenTarget } from "../lib/types";

interface GenerateStripProps {
  target: CodegenTarget;
  onTargetChange: (target: CodegenTarget) => void;
}

export function GenerateStrip({ target, onTargetChange }: GenerateStripProps) {
  return (
    <div className="mt-8 flex flex-col gap-2">
      <span className="font-label-xs text-label-xs text-on-surface-variant uppercase">Generate For</span>
      <div className="flex flex-wrap p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/50 w-fit">
        {CODEGEN_TARGETS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTargetChange(t.id)}
            className={`px-4 py-1.5 rounded-md font-body-sm text-body-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
              target === t.id
                ? "bg-surface-container-highest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
