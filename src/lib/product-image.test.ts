import { describe, expect, it } from "vitest";
import { getProductImageUrl, slugToPlaceholderSeed } from "./product-image";

describe("getProductImageUrl", () => {
  it("usa la primera imagen cuando existe", () => {
    expect(
      getProductImageUrl({
        images: ["https://example.com/a.jpg", "https://example.com/b.jpg"],
        slug: "x",
      })
    ).toBe("https://example.com/a.jpg");
  });

  it("ignora string vacío y cae al placeholder", () => {
    const url = getProductImageUrl({ images: ["  "], slug: "demo-articulo-001" });
    expect(url).toContain("picsum.photos/seed/");
    expect(url).toContain("/600/600");
  });

  it("es determinista por slug", () => {
    const a = getProductImageUrl({ images: null, slug: "demo-articulo-001" });
    const b = getProductImageUrl({ images: null, slug: "demo-articulo-001" });
    const c = getProductImageUrl({ images: null, slug: "demo-articulo-002" });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});

describe("slugToPlaceholderSeed", () => {
  it("usa prefijo ra- y md5 hex (32 chars)", () => {
    expect(slugToPlaceholderSeed("demo-articulo-001")).toMatch(
      /^ra-[0-9a-f]{32}$/
    );
  });
});
