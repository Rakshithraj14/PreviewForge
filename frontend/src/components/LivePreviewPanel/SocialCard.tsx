import type { Platform } from "../../lib/types";

interface SocialCardProps {
  platform: Platform;
  title: string;
  description: string;
  image: string;
  domain: string;
}

// LinkedIn's real link previews don't render the description, only image/domain/title.
const SHOWS_DESCRIPTION: Record<Platform, boolean> = {
  twitter: true,
  linkedin: false,
  facebook: true,
  telegram: true,
  pinterest: true,
};

const PINTEREST_RED = "#E60023";

export function SocialCard({ platform, title, description, image, domain }: SocialCardProps) {
  if (platform === "pinterest") {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden shadow-2xl max-w-xs mx-auto">
        <div className="w-full aspect-[2/3] relative bg-surface-dim overflow-hidden">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-outline-variant">
              <span className="material-symbols-outlined text-[48px]">image</span>
            </div>
          )}
          <span
            className="absolute top-3 right-3 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg"
            style={{ backgroundColor: PINTEREST_RED }}
          >
            Save
          </span>
        </div>
        <div className="p-4 bg-surface-container">
          <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-1 line-clamp-2">{title}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-2">{description}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{domain}</p>
        </div>
      </div>
    );
  }

  if (platform === "telegram") {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl">
        <div className="flex gap-3 p-4 border-l-4 border-l-[#2AABEE]">
          <div className="w-20 h-20 rounded-lg bg-surface-dim flex-shrink-0 overflow-hidden">
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-outline-variant">
                <span className="material-symbols-outlined text-[24px]">image</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-body-sm text-body-sm text-[#2AABEE] font-semibold mb-1 truncate">{domain}</p>
            <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-1 line-clamp-2">
              {title}
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl hover:border-outline transition-all duration-500 group relative">
      <div className="w-full aspect-[1.91/1] relative bg-surface-dim overflow-hidden">
        {image ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${image}")` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-outline-variant">
            <span className="material-symbols-outlined text-[48px]">image</span>
          </div>
        )}
      </div>
      <div className="p-4 bg-surface-container border-t border-outline-variant">
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 truncate">
          {platform === "facebook" ? domain.toUpperCase() : domain}
        </p>
        <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-1 truncate">{title}</h4>
        {SHOWS_DESCRIPTION[platform] && (
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}
