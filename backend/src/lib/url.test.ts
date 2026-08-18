import { describe, it, expect } from "vitest";
import { normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  it("lowercases scheme and host", () => {
    expect(normalizeUrl("HTTPS://Example.COM/Path")).toBe("https://example.com/Path");
  });

  it("strips default ports", () => {
    expect(normalizeUrl("https://example.com:443/path")).toBe("https://example.com/path");
    expect(normalizeUrl("http://example.com:80/path")).toBe("http://example.com/path");
  });

  it("strips trailing slash except for root", () => {
    expect(normalizeUrl("https://example.com/path/")).toBe("https://example.com/path");
    expect(normalizeUrl("https://example.com/")).toBe("https://example.com/");
  });

  it("strips fragments but keeps query strings", () => {
    expect(normalizeUrl("https://example.com/path?a=1#section")).toBe(
      "https://example.com/path?a=1"
    );
  });
});
