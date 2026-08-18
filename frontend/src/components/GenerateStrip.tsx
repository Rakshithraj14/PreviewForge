import { CODEGEN_TARGETS } from "../lib/codegen";
import type { CodegenTarget } from "../lib/types";

interface GenerateStripProps {
  target: CodegenTarget;
  onTargetChange: (target: CodegenTarget) => void;
  onGenerate: () => void;
  disabled: boolean;
}

export function GenerateStrip({ target, onTargetChange, onGenerate, disabled }: GenerateStripProps) {
  return (
    <div className="mt-8 p-5 bg-[#111111] border border-outline-variant rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col gap-2 w-full md:w-auto z-10 relative">
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
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled}
        className="w-full md:w-auto bg-gradient-to-r from-primary to-inverse-primary text-on-primary px-8 py-3.5 rounded-xl font-headline-lg-mobile text-[16px] font-bold shadow-[0_0_20px_rgba(208,188,255,0.2)] hover:shadow-[0_0_30px_rgba(208,188,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed z-10 relative"
      >
        Generate Code
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </button>
    </div>
  );
}
