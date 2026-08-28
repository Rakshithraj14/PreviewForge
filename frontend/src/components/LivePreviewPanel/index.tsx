import type { Platform } from "../../lib/types";
import { SocialCard } from "./SocialCard";

const PLATFORMS: Platform[] = ["twitter", "linkedin", "facebook", "telegram"];
const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "Twitter",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  telegram: "Telegram",
};

interface LivePreviewPanelProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
  title: string;
  description: string;
  image: string;
  url: string;
}

export function LivePreviewPanel({
  platform,
  onPlatformChange,
  title,
  description,
  image,
  url,
}: LivePreviewPanelProps) {
  const domain = getDomain(url);

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 border-b border-outline-variant pb-3">
        <h3 className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
          Live Preview
        </h3>
        <div className="flex flex-wrap p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPlatformChange(p)}
              className={`px-3 py-1 rounded-md font-label-xs text-label-xs transition-all duration-200 hover:scale-105 active:scale-95 ${
                platform === p
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <SocialCard platform={platform} title={title} description={description} image={image} domain={domain} />
    </div>
  );
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
