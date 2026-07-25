import { describe, expect, it } from "vitest";
import { STARTER_COUNTRIES } from "./countries";
import {
  getReferenceFlag,
  REFERENCE_FLAG_BY_COUNTRY_ID
} from "./referenceFlags";

describe("reference flag artwork", () => {
  it("covers every country in the starter pack and nothing else", () => {
    expect(Object.keys(REFERENCE_FLAG_BY_COUNTRY_ID)).toEqual(
      STARTER_COUNTRIES.map((country) => country.id)
    );
  });

  it("resolves a bundled SVG and a valid aspect ratio for every country", () => {
    for (const country of STARTER_COUNTRIES) {
      const reference = getReferenceFlag(country.id);

      expect(reference.src).toMatch(
        /^(?:data:image\/svg\+xml,|.*\.svg(?:$|\?))/
      );
      expect(reference.aspectRatio).toBeGreaterThan(0);
      expect(reference.aspectRatio).toBeLessThanOrEqual(2);
    }
  });

  it("preserves each national flag's reviewed proportions", () => {
    expect(
      Object.fromEntries(
        Object.entries(REFERENCE_FLAG_BY_COUNTRY_ID).map(([id, flag]) => [
          id,
          flag.aspectRatio
        ])
      )
    ).toEqual({
      japan: 3 / 2,
      bangladesh: 5 / 3,
      france: 3 / 2,
      germany: 5 / 3,
      italy: 3 / 2,
      ireland: 2,
      netherlands: 3 / 2,
      poland: 8 / 5,
      ukraine: 3 / 2,
      finland: 18 / 11,
      sweden: 8 / 5,
      denmark: 37 / 28,
      turkey: 3 / 2,
      pakistan: 3 / 2,
      india: 3 / 2,
      canada: 2,
      "united-states": 19 / 10,
      brazil: 10 / 7,
      "south-africa": 3 / 2,
      australia: 2,
      spain: 3 / 2,
      belgium: 15 / 13,
      austria: 3 / 2,
      switzerland: 1,
      norway: 11 / 8,
      greece: 3 / 2,
      israel: 11 / 8,
      china: 3 / 2,
      "south-korea": 3 / 2,
      mexico: 7 / 4,
      argentina: 8 / 5,
      colombia: 3 / 2,
      nigeria: 2,
      egypt: 3 / 2,
      morocco: 3 / 2,
      "saudi-arabia": 3 / 2,
      indonesia: 3 / 2,
      thailand: 3 / 2,
      vietnam: 3 / 2,
      "new-zealand": 2,
      "united-kingdom": 2,
      portugal: 3 / 2,
      russia: 3 / 2,
      czechia: 3 / 2,
      iceland: 25 / 18,
      philippines: 2,
      malaysia: 2,
      singapore: 3 / 2,
      "united-arab-emirates": 2,
      nepal: 71.571 / 87.246,
      chile: 3 / 2,
      peru: 3 / 2,
      cuba: 2,
      jamaica: 2,
      kenya: 3 / 2,
      ethiopia: 2,
      ghana: 3 / 2,
      algeria: 3 / 2,
      fiji: 2,
      palestine: 2
    });
  });

  it("rejects unknown country identifiers", () => {
    expect(() => getReferenceFlag("unknown-country")).toThrow(
      "Missing reference flag artwork for unknown-country"
    );
  });
});
