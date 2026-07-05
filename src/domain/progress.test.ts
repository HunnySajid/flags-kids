import { describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  getCountryMastery,
  getProgressSummary,
  recordCountryResult,
  resetProgress
} from "./progress";

describe("local progress", () => {
  it("records completed country attempts without needing an account", () => {
    const progress = createEmptyProgress();

    const next = recordCountryResult(
      progress,
      { countryId: "japan", completed: true, mistakes: 0 },
      "2026-07-05T10:00:00.000Z"
    );

    expect(next.countries.japan).toEqual({
      attempts: 1,
      completions: 1,
      mistakes: 0,
      lastPracticedAt: "2026-07-05T10:00:00.000Z"
    });
    expect(getCountryMastery(next, "japan")).toBe("learning");
  });

  it("marks a country strong after repeated low-mistake completions", () => {
    const once = recordCountryResult(
      createEmptyProgress(),
      { countryId: "japan", completed: true, mistakes: 0 },
      "2026-07-05T10:00:00.000Z"
    );
    const twice = recordCountryResult(
      once,
      { countryId: "japan", completed: true, mistakes: 1 },
      "2026-07-05T10:05:00.000Z"
    );
    const third = recordCountryResult(
      twice,
      { countryId: "japan", completed: true, mistakes: 0 },
      "2026-07-05T10:10:00.000Z"
    );

    expect(getCountryMastery(third, "japan")).toBe("strong");
  });

  it("summarizes and resets progress locally", () => {
    const progress = recordCountryResult(
      createEmptyProgress(),
      { countryId: "france", completed: false, mistakes: 2 },
      "2026-07-05T10:00:00.000Z"
    );

    expect(getProgressSummary(progress, 20)).toEqual({
      practiced: 1,
      completed: 0,
      strong: 0,
      total: 20
    });
    expect(resetProgress()).toEqual(createEmptyProgress());
  });
});
