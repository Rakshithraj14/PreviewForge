import { useState } from "react";

interface CodePanelProps {
  code: string;
}

export function CodePanel({ code }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-4 bg-[#171717] border border-outline-variant rounded-xl shadow-2xl overflow-hidden relative flex flex-col max-h-[70vh]">
      <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-[#111111] z-10 relative">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">code</span>
          <h3 className="font-body-base text-body-base font-semibold text-on-surface">Generated Meta Tags</h3>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!code}
          className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-all duration-200 active:scale-95 border border-transparent hover:border-outline-variant text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-5 bg-[#0a0a0a] overflow-x-auto overflow-y-auto flex-1 relative z-10">
        <pre className="font-code-base text-code-base text-on-surface-variant whitespace-pre-wrap">
          <code>{code || "Parse a URL to see generated code here."}</code>
        </pre>
      </div>
    </div>
  );
}
