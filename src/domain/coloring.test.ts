import { describe, expect, it } from "vitest";
import { STARTER_COUNTRIES } from "./countries";
import {
  applyColorToRegion,
  createColoringState,
  getCompletionPercent,
  isCountryComplete
} from "./coloring";

const findCountry = (id: string) => {
  const country = STARTER_COUNTRIES.find((item) => item.id === id);
  if (!country) {
    throw new Error(`Missing test country: ${id}`);
  }
  return country;
};

describe("coloring rules", () => {
  it("does not fill a region when the selected color is wrong", () => {
    const japan = findCountry("japan");
    const state = createColoringState(japan);

    const result = applyColorToRegion(japan, state, "disc", "blue");

    expect(result.correct).toBe(false);
    expect(result.completed).toBe(false);
    expect(result.nextState.filledRegions).toEqual({});
    expect(isCountryComplete(japan, result.nextState)).toBe(false);
  });

  it("fills a region when the selected color matches the target color name", () => {
    const japan = findCountry("japan");
    const state = createColoringState(japan);

    const result = applyColorToRegion(japan, state, "disc", "red");

    expect(result.correct).toBe(true);
    expect(result.spokenColorName).toBe("red");
    expect(result.nextState.filledRegions.disc).toBe("#bc002d");
    expect(result.completed).toBe(true);
    expect(getCompletionPercent(japan, result.nextState)).toBe(100);
  });

  it("tracks partial progress until every fillable region is complete", () => {
    const france = findCountry("france");
    const state = createColoringState(france);

    const first = applyColorToRegion(france, state, "blue-band", "blue");
    const second = applyColorToRegion(
      france,
      first.nextState,
      "white-band",
      "white"
    );

    expect(first.completed).toBe(false);
    expect(second.completed).toBe(false);
    expect(getCompletionPercent(france, second.nextState)).toBe(67);

    const third = applyColorToRegion(
      france,
      second.nextState,
      "red-band",
      "red"
    );

    expect(third.completed).toBe(true);
    expect(isCountryComplete(france, third.nextState)).toBe(true);
  });
});
