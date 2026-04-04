import { describe, expect, it } from "vitest";
import { parseSearchPageParams, SEARCH_PAGE_SIZE } from "@/lib/search-url";

describe("parseSearchPageParams", () => {
  it("parses query, category, brands and pagination", () => {
    const p = parseSearchPageParams({
      q: "balata ford",
      category: "frenos",
      brands: "wagner,bosch",
      page: "2",
      min_price: "100",
      max_price: "5000",
    });
    expect(p.q).toBe("balata ford");
    expect(p.category).toBe("frenos");
    expect(p.brandSlugs).toBe("wagner,bosch");
    expect(p.page).toBe(2);
    expect(p.minPrice).toBe(100);
    expect(p.maxPrice).toBe(5000);
  });

  it("deduplicates brand slugs", () => {
    const p = parseSearchPageParams({ brands: "wagner, wagner, bosch" });
    expect(p.brandSlugs).toBe("wagner,bosch");
  });

  it("defaults page to 1 for invalid values", () => {
    expect(parseSearchPageParams({ page: "0" }).page).toBe(1);
    expect(parseSearchPageParams({ page: "abc" }).page).toBe(1);
  });

  it("returns null for empty optional filters", () => {
    const p = parseSearchPageParams({});
    expect(p.category).toBeNull();
    expect(p.brandSlugs).toBeNull();
    expect(p.minPrice).toBeNull();
    expect(p.maxPrice).toBeNull();
    expect(p.page).toBe(1);
  });
});

describe("SEARCH_PAGE_SIZE", () => {
  it("is positive", () => {
    expect(SEARCH_PAGE_SIZE).toBeGreaterThan(0);
  });
});
