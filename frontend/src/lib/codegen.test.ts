import { describe, it, expect } from "vitest";
import { generate, type CodegenInput } from "./codegen";

const input: CodegenInput = {
  title: 'My "Great" Post',
  description: "A description",
  image: "https://example.com/img.jpg",
  url: "https://example.com/post",
  siteName: "example.com",
};

describe("generate", () => {
  it("produces distinct output containing the core fields for each target", () => {
    for (const target of ["html", "react", "nextjs", "vue", "svelte"] as const) {
      const out = generate(target, input);
      expect(out).toContain(input.description);
      expect(out).toContain(input.url);
      expect(out).toContain(input.image);
    }
  });

  it("escapes double quotes in HTML attribute output", () => {
    const out = generate("html", input);
    expect(out).toContain("My &quot;Great&quot; Post");
    expect(out).not.toContain('My "Great" Post');
  });

  it("escapes double quotes in JS string output", () => {
    const out = generate("nextjs", input);
    expect(out).toContain('My \\"Great\\" Post');
  });
});
