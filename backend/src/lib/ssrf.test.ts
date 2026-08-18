import { describe, it, expect } from "vitest";
import { assertSafeUrl, UnsafeUrlError } from "./ssrf";

describe("assertSafeUrl", () => {
  it("allows ordinary public https URLs", () => {
    expect(assertSafeUrl("https://example.com/blog/post").hostname).toBe("example.com");
  });

  it("rejects non-http(s) schemes", () => {
    expect(() => assertSafeUrl("file:///etc/passwd")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("ftp://example.com")).toThrow(UnsafeUrlError);
  });

  it("rejects localhost and loopback", () => {
    expect(() => assertSafeUrl("http://localhost/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://127.0.0.1/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://[::1]/")).toThrow(UnsafeUrlError);
  });

  it("rejects private IPv4 ranges including cloud metadata", () => {
    expect(() => assertSafeUrl("http://10.0.0.5/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://172.16.0.1/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://192.168.1.1/")).toThrow(UnsafeUrlError);
    expect(() => assertSafeUrl("http://169.254.169.254/")).toThrow(UnsafeUrlError);
  });

  it("rejects invalid URLs", () => {
    expect(() => assertSafeUrl("not a url")).toThrow(UnsafeUrlError);
  });
});
