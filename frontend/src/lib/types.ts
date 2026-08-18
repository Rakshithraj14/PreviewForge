export interface PreviewMeta {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
}

export type Platform = "twitter" | "linkedin" | "facebook" | "telegram" | "pinterest";
export type CodegenTarget = "html" | "react" | "nextjs" | "vue" | "svelte";
