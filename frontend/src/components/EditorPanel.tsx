const TITLE_MAX = 70;
const DESCRIPTION_MAX = 200;

interface EditorPanelProps {
  title: string;
  description: string;
  image: string;
  originalTitle: string;
  originalDescription: string;
  originalImage: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  disabled: boolean;
}

function ModifiedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-tertiary-container/20 text-tertiary">
      Modified
    </span>
  );
}

export function EditorPanel({
  title,
  description,
  image,
  originalTitle,
  originalDescription,
  originalImage,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  onRefresh,
  isRefreshing,
  disabled,
}: EditorPanelProps) {
  return (
    <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Editor</h3>
        <div className="relative group">
          <button
            type="button"
            onClick={onRefresh}
            disabled={disabled || isRefreshing}
            className="text-on-surface-variant hover:text-primary font-label-xs text-label-xs uppercase transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${isRefreshing ? "animate-spin" : ""}`}
            >
              refresh
            </span>
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-surface-container-highest border border-outline-variant rounded-lg shadow-lg text-center font-body-sm text-[11px] text-on-surface opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none">
            Clear cached metadata and fetch the latest data.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block font-label-xs text-label-xs text-on-surface-variant">
              Title <span className="text-primary">*</span>
            </label>
            <ModifiedBadge show={title !== originalTitle} />
          </div>
          <input
            className="w-full bg-surface-dim border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 font-body-base text-body-base hover:border-outline"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <div className="flex justify-between mt-1">
            <span className="font-label-xs text-[10px] text-outline-variant">
              Max {TITLE_MAX} chars recommended
            </span>
            <span
              className={`font-label-xs text-[10px] ${title.length > TITLE_MAX ? "text-error" : "text-primary"}`}
            >
              {title.length} / {TITLE_MAX}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block font-label-xs text-label-xs text-on-surface-variant">Description</label>
            <ModifiedBadge show={description !== originalDescription} />
          </div>
          <textarea
            className="w-full bg-surface-dim border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 font-body-base text-body-base resize-none hover:border-outline"
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
          <div className="flex justify-between mt-1">
            <span className="font-label-xs text-[10px] text-outline-variant">
              Max {DESCRIPTION_MAX} chars recommended
            </span>
            <span
              className={`font-label-xs text-[10px] ${
                description.length > DESCRIPTION_MAX ? "text-error" : "text-outline-variant"
              }`}
            >
              {description.length} / {DESCRIPTION_MAX}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block font-label-xs text-label-xs text-on-surface-variant">OG Image URL</label>
            <ModifiedBadge show={image !== originalImage} />
          </div>
          <input
            className="w-full bg-surface-dim border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 font-body-sm text-body-sm hover:border-outline"
            type="text"
            placeholder="https://example.com/assets/og-image.jpg"
            value={image}
            onChange={(e) => onImageChange(e.target.value)}
          />
          <div className="mt-3 flex items-center gap-3">
            <div className="w-16 h-16 rounded border border-outline-variant overflow-hidden bg-surface-dim flex-shrink-0">
              {image ? (
                <img alt="Preview of the OG image" className="w-full h-full object-cover" src={image} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline-variant">
                  <span className="material-symbols-outlined text-[20px]">image</span>
                </div>
              )}
            </div>
            <span className="font-label-xs text-[10px] text-outline-variant flex-1">
              A preview of the primary image used when sharing this link.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
