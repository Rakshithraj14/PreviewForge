import { useEffect, useState } from "react";
import { Hero } from "./components/Hero";
import { LivePreviewPanel } from "./components/LivePreviewPanel";
import { EditorPanel } from "./components/EditorPanel";
import { GenerateStrip } from "./components/GenerateStrip";
import { CodePanel } from "./components/CodePanel";
import { parseUrl, ApiError, type ParseResponse } from "./lib/api";
import { generate } from "./lib/codegen";
import type { Platform, CodegenTarget } from "./lib/types";

interface Draft {
  title: string;
  description: string;
  image: string;
}

function toDraft(p: ParseResponse): Draft {
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    image: p.image ?? "",
  };
}

const STORAGE_KEY = "previewforge:state";

interface PersistedState {
  urlInput: string;
  parsed: ParseResponse | null;
  draft: Draft | null;
  activePlatform: Platform;
  activeTarget: CodegenTarget;
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const persisted = loadPersisted();

export default function App() {
  const [urlInput, setUrlInput] = useState(persisted.urlInput ?? "");
  const [parsed, setParsed] = useState<ParseResponse | null>(persisted.parsed ?? null);
  const [draft, setDraft] = useState<Draft | null>(persisted.draft ?? null);
  const [activePlatform, setActivePlatform] = useState<Platform>(persisted.activePlatform ?? "twitter");
  const [activeTarget, setActiveTarget] = useState<CodegenTarget>(persisted.activeTarget ?? "html");
  const [status, setStatus] = useState<"idle" | "parsing" | "refreshing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const state: PersistedState = { urlInput, parsed, draft, activePlatform, activeTarget };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (private browsing, quota) - state just won't persist
    }
  }, [urlInput, parsed, draft, activePlatform, activeTarget]);

  async function runParse(target: string, force: boolean) {
    setStatus(force ? "refreshing" : "parsing");
    setError(null);
    try {
      const result = await parseUrl(target, { force });
      setParsed(result);
      setDraft(toDraft(result));
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const handleParse = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    void runParse(withScheme, false);
  };

  const handleRefresh = () => {
    if (!parsed) return;
    void runParse(parsed.url, true);
  };

  const hasData = draft !== null && parsed !== null;

  const generatedCode = hasData
    ? generate(activeTarget, {
        title: draft.title,
        description: draft.description,
        image: draft.image,
        url: parsed.url,
        siteName: parsed.siteName ?? undefined,
      })
    : "";

  return (
    <main className="relative overflow-y-auto min-h-screen">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-30 animate-breathe origin-top" />
      <div className="px-6 md:px-margin relative z-10 max-w-5xl mx-auto pb-16">
        <Hero
          url={urlInput}
          onUrlChange={setUrlInput}
          onSubmit={handleParse}
          isParsing={status === "parsing"}
          error={status === "error" ? error : null}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <LivePreviewPanel
            platform={activePlatform}
            onPlatformChange={setActivePlatform}
            title={draft?.title || "Your page title will appear here"}
            description={draft?.description || "Your page description will appear here once you parse a URL."}
            image={draft?.image || ""}
            url={parsed?.url || urlInput || "https://example.com"}
          />
          <EditorPanel
            title={draft?.title ?? ""}
            description={draft?.description ?? ""}
            image={draft?.image ?? ""}
            originalTitle={parsed?.title ?? ""}
            originalDescription={parsed?.description ?? ""}
            originalImage={parsed?.image ?? ""}
            onTitleChange={(v) => setDraft((d) => (d ? { ...d, title: v } : d))}
            onDescriptionChange={(v) => setDraft((d) => (d ? { ...d, description: v } : d))}
            onImageChange={(v) => setDraft((d) => (d ? { ...d, image: v } : d))}
            onRefresh={handleRefresh}
            isRefreshing={status === "refreshing"}
            disabled={!hasData}
          />
        </div>

        <GenerateStrip target={activeTarget} onTargetChange={setActiveTarget} />
        <CodePanel code={generatedCode} />
      </div>

      <footer className="w-full py-6 border-t border-outline-variant/30 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-margin max-w-5xl mx-auto gap-4">
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 PreviewForge. Built for developers.
          </div>
          <div className="flex gap-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">
              Terms of Service
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
