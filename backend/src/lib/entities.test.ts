import { describe, it, expect } from "vitest";
import { decodeHtmlEntities } from "./entities";

describe("decodeHtmlEntities", () => {
  it("decodes named entities", () => {
    expect(decodeHtmlEntities("world&#39;s biggest &amp; best")).toBe("world's biggest & best");
    expect(decodeHtmlEntities("&quot;quoted&quot;")).toBe('"quoted"');
  });

  it("decodes decimal and hex numeric references", () => {
    expect(decodeHtmlEntities("&#39;")).toBe("'");
    expect(decodeHtmlEntities("&#x27;")).toBe("'");
  });

  it("decodes &amp; in query strings so URLs round-trip correctly", () => {
    expect(decodeHtmlEntities("https://example.com/img.jpg?a=1&amp;b=2")).toBe(
      "https://example.com/img.jpg?a=1&b=2"
    );
  });

  it("leaves plain text untouched", () => {
    expect(decodeHtmlEntities("no entities here")).toBe("no entities here");
  });
});
