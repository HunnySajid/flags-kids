import { describe, expect, it } from "vitest";
import { STARTER_COUNTRIES } from "./countries";

const getCountry = (id: string) => {
  const country = STARTER_COUNTRIES.find((item) => item.id === id);
  if (!country) {
    throw new Error(`Missing country: ${id}`);
  }
  return country;
};

const getRegionIds = (id: string) =>
  getCountry(id).flagRegions.map((region) => region.id);

const getRegion = (countryId: string, regionId: string) => {
  const region = getCountry(countryId).flagRegions.find(
    (item) => item.id === regionId
  );
  if (!region) {
    throw new Error(`Missing ${countryId} region: ${regionId}`);
  }
  return region;
};

const collectShapeKinds = (shape: { kind: string; shapes?: unknown[] }): string[] => {
  if (shape.kind !== "group") {
    return [shape.kind];
  }

  return [
    shape.kind,
    ...(shape.shapes ?? []).flatMap((child) =>
      collectShapeKinds(child as { kind: string; shapes?: unknown[] })
    )
  ];
};

describe("starter country pack", () => {
  it("contains the planned 40-country starter set in a stable order", () => {
    expect(STARTER_COUNTRIES.map((country) => country.id)).toEqual([
      "japan",
      "bangladesh",
      "france",
      "germany",
      "italy",
      "ireland",
      "netherlands",
      "poland",
      "ukraine",
      "finland",
      "sweden",
      "denmark",
      "turkey",
      "pakistan",
      "india",
      "canada",
      "united-states",
      "brazil",
      "south-africa",
      "australia",
      "spain",
      "belgium",
      "austria",
      "switzerland",
      "norway",
      "greece",
      "israel",
      "china",
      "south-korea",
      "mexico",
      "argentina",
      "colombia",
      "nigeria",
      "egypt",
      "morocco",
      "saudi-arabia",
      "indonesia",
      "thailand",
      "vietnam",
      "new-zealand"
    ]);
  });

  it("keeps every flag local, fillable, and tied to its needed colors", () => {
    const ids = new Set<string>();

    for (const country of STARTER_COUNTRIES) {
      expect(ids.has(country.id)).toBe(false);
      ids.add(country.id);
      expect(country.name.length).toBeGreaterThan(1);
      expect(country.flagRegions.length).toBeGreaterThan(0);
      expect(country.colors.length).toBeGreaterThan(0);

      const regionColors = new Set(
        country.flagRegions.map((region) => region.colorName)
      );

      expect(new Set(country.colors)).toEqual(regionColors);

      for (const region of country.flagRegions) {
        expect(region.id).toMatch(/^[a-z0-9-]+$/);
        expect(region.targetColor).toMatch(/^#[0-9a-f]{6}$/i);
        expect(collectShapeKinds(region.shape).every(Boolean)).toBe(true);
      }
    }
  });

  it("models reported complex flags with their key required details", () => {
    expect(getRegionIds("new-zealand")).toEqual(
      expect.arrayContaining([
        "union-jack",
        "southern-cross-white-stars",
        "southern-cross-red-stars"
      ])
    );
    expect(collectShapeKinds(getRegion("new-zealand", "union-jack").shape)).toContain(
      "group"
    );

    const indiaChakra = getRegion("india", "ashoka-chakra");
    expect(collectShapeKinds(indiaChakra.shape).filter((kind) => kind === "line")).toHaveLength(
      24
    );

    expect(getRegionIds("saudi-arabia")).toEqual(
      expect.arrayContaining(["shahada", "sword"])
    );
    expect(getRegionIds("saudi-arabia")).not.toEqual(
      expect.arrayContaining(["white-script-line-1", "white-script-line-2"])
    );
    expect(collectShapeKinds(getRegion("saudi-arabia", "shahada").shape)).toContain(
      "text"
    );
    const saudiSword = getRegion("saudi-arabia", "sword").shape as {
      kind: string;
      shapes?: Array<{ kind: string; points?: string }>;
    };
    const swordTip = saudiSword.shapes?.find(
      (shape) => shape.kind === "polygon"
    );
    expect(swordTip?.points?.startsWith("50,132")).toBe(true);

    expect(getRegionIds("israel")).toContain("magen-david");
    expect(collectShapeKinds(getRegion("israel", "magen-david").shape)).toEqual(
      expect.arrayContaining(["group", "polygon"])
    );

    expect(getRegionIds("south-korea")).toEqual(
      expect.arrayContaining([
        "taegeuk-red",
        "taegeuk-blue",
        "geon-trigram",
        "gon-trigram",
        "gam-trigram",
        "ri-trigram"
      ])
    );
    expect(collectShapeKinds(getRegion("south-korea", "geon-trigram").shape)).toContain(
      "group"
    );

    const thailandStripeHeights = getCountry("thailand").flagRegions.map(
      (region) => {
        if (region.shape.kind !== "rect") {
          return 0;
        }
        return region.shape.height;
      }
    );
    expect(thailandStripeHeights).toEqual([30, 30, 60, 30, 30]);
  });
});
