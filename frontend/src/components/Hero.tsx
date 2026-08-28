interface HeroProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  isParsing: boolean;
  error: string | null;
}

export function Hero({ url, onUrlChange, onSubmit, isParsing, error }: HeroProps) {
  return (
    <section className="text-center mb-10 pt-10">
      <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
        Master your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          metadata
        </span>
        .
      </h1>
      <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto mb-8">
        Preview, customize, and generate flawless social media metadata for any website in seconds.
        Enter a URL to extract data instantly.
      </p>
      <form
        className="flex items-center max-w-3xl mx-auto relative group"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex flex-col sm:flex-row w-full bg-surface-dim border border-outline-variant rounded-xl p-1.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300 shadow-xl shadow-black/50">
          <div className="flex items-center pl-4 pr-2 text-outline">
            <span className="material-symbols-outlined">link</span>
          </div>
          <input
            className="flex-1 min-w-0 bg-transparent border-none text-on-surface focus:ring-0 font-body-base text-body-base placeholder:text-outline-variant py-2"
            placeholder="https://your-website.com"
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isParsing}
            className="mt-2 sm:mt-0 sm:ml-2 bg-gradient-to-r from-primary to-inverse-primary shimmer-btn text-on-primary px-6 py-2.5 rounded-lg font-label-xs text-label-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 flex items-center justify-center sm:min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                Parsing...
              </span>
            ) : (
              "Parse the Data"
            )}
          </button>
        </div>
      </form>
      {error && <p className="mt-3 font-body-sm text-body-sm text-error">{error}</p>}
    </section>
  );
}
