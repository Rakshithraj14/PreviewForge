import { useState } from "react";

interface CodeModalProps {
  open: boolean;
  code: string;
  onClose: () => void;
}

export function CodeModal({ open, code, onClose }: CodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#171717] border border-outline-variant w-full max-w-3xl rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-[#111111] z-10 relative">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">code</span>
            <h3 className="font-body-base text-body-base font-semibold text-on-surface">Generated Meta Tags</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-all duration-200 active:scale-95 border border-transparent hover:border-outline-variant text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
        <div className="p-5 bg-[#0a0a0a] overflow-x-auto overflow-y-auto flex-1 relative z-10">
          <pre className="font-code-base text-code-base text-on-surface-variant whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
