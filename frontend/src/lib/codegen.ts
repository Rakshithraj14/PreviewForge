import type { CodegenTarget } from "./types";

export interface CodegenInput {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName?: string;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeJs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function generateHtml(d: CodegenInput): string {
  const t = escapeAttr(d.title);
  const desc = escapeAttr(d.description);
  const img = escapeAttr(d.image);
  const url = escapeAttr(d.url);
  const siteNameTag = d.siteName
    ? `\n<meta property="og:site_name" content="${escapeAttr(d.siteName)}" />`
    : "";

  return `<!-- Primary Meta Tags -->
<title>${t}</title>
<meta name="title" content="${t}" />
<meta name="description" content="${desc}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${img}" />${siteNameTag}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${t}" />
<meta property="twitter:description" content="${desc}" />
<meta property="twitter:image" content="${img}" />`;
}

function generateReact(d: CodegenInput): string {
  const t = escapeAttr(d.title);
  const desc = escapeAttr(d.description);
  const img = escapeAttr(d.image);
  const url = escapeAttr(d.url);

  return `// Assumes react-helmet-async for meta tag management in a plain React SPA
import { Helmet } from "react-helmet-async";

export function SeoTags() {
  return (
    <Helmet>
      <title>${t}</title>
      <meta name="title" content="${t}" />
      <meta name="description" content="${desc}" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="${url}" />
      <meta property="og:title" content="${t}" />
      <meta property="og:description" content="${desc}" />
      <meta property="og:image" content="${img}" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="${url}" />
      <meta property="twitter:title" content="${t}" />
      <meta property="twitter:description" content="${desc}" />
      <meta property="twitter:image" content="${img}" />
    </Helmet>
  );
}`;
}

function generateNextjs(d: CodegenInput): string {
  const t = escapeJs(d.title);
  const desc = escapeJs(d.description);
  const img = escapeJs(d.image);
  const url = escapeJs(d.url);

  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${t}",
  description: "${desc}",
  openGraph: {
    type: "website",
    url: "${url}",
    title: "${t}",
    description: "${desc}",
    images: ["${img}"],
  },
  twitter: {
    card: "summary_large_image",
    title: "${t}",
    description: "${desc}",
    images: ["${img}"],
  },
};`;
}

function generateVue(d: CodegenInput): string {
  const t = escapeJs(d.title);
  const desc = escapeJs(d.description);
  const img = escapeJs(d.image);
  const url = escapeJs(d.url);

  return `import { useHead } from "@unhead/vue";

useHead({
  title: "${t}",
  meta: [
    { name: "title", content: "${t}" },
    { name: "description", content: "${desc}" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "${url}" },
    { property: "og:title", content: "${t}" },
    { property: "og:description", content: "${desc}" },
    { property: "og:image", content: "${img}" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: "${url}" },
    { property: "twitter:title", content: "${t}" },
    { property: "twitter:description", content: "${desc}" },
    { property: "twitter:image", content: "${img}" },
  ],
});`;
}

function generateSvelte(d: CodegenInput): string {
  const t = escapeAttr(d.title);
  const desc = escapeAttr(d.description);
  const img = escapeAttr(d.image);
  const url = escapeAttr(d.url);

  return `<svelte:head>
  <title>${t}</title>
  <meta name="title" content="${t}" />
  <meta name="description" content="${desc}" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${img}" />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${url}" />
  <meta property="twitter:title" content="${t}" />
  <meta property="twitter:description" content="${desc}" />
  <meta property="twitter:image" content="${img}" />
</svelte:head>`;
}

function generateAngular(d: CodegenInput): string {
  const t = escapeJs(d.title);
  const desc = escapeJs(d.description);
  const img = escapeJs(d.image);
  const url = escapeJs(d.url);

  return `import { Component, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Component({ selector: "app-seo-tags", template: "" })
export class SeoTagsComponent implements OnInit {
  constructor(private titleService: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle("${t}");
    this.meta.addTags([
      { name: "title", content: "${t}" },
      { name: "description", content: "${desc}" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "${url}" },
      { property: "og:title", content: "${t}" },
      { property: "og:description", content: "${desc}" },
      { property: "og:image", content: "${img}" },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:url", content: "${url}" },
      { property: "twitter:title", content: "${t}" },
      { property: "twitter:description", content: "${desc}" },
      { property: "twitter:image", content: "${img}" },
    ]);
  }
}`;
}

const GENERATORS: Record<CodegenTarget, (d: CodegenInput) => string> = {
  html: generateHtml,
  react: generateReact,
  nextjs: generateNextjs,
  vue: generateVue,
  svelte: generateSvelte,
  angular: generateAngular,
};

export const CODEGEN_TARGETS: { id: CodegenTarget; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "react", label: "React" },
  { id: "nextjs", label: "Next.js" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
  { id: "angular", label: "Angular" },
];

export function generate(target: CodegenTarget, data: CodegenInput): string {
  return GENERATORS[target](data);
}
