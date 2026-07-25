import { describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  getCountryMastery,
  getProgressSummary,
  recordCountryResult,
  recordRecognitionResult,
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

  it("bases strong mastery on independent recognition rather than old mistakes", () => {
    const colored = recordCountryResult(
      createEmptyProgress(),
      { countryId: "japan", completed: true, mistakes: 4 },
      "2026-07-05T10:00:00.000Z"
    );
    expect(getCountryMastery(colored, "japan")).toBe("learning");

    const once = recordRecognitionResult(
      colored,
      { countryId: "japan", recognized: true, firstTry: true },
      "2026-07-05T10:05:00.000Z"
    );
    const twice = recordRecognitionResult(
      once,
      { countryId: "japan", recognized: true, firstTry: true },
      "2026-07-05T10:10:00.000Z"
    );
    const third = recordRecognitionResult(
      twice,
      { countryId: "japan", recognized: true, firstTry: true },
      "2026-07-05T10:15:00.000Z"
    );

    expect(getCountryMastery(third, "japan")).toBe("strong");
    expect(third.recognition.japan).toEqual({
      successfulRounds: 3,
      firstTrySuccesses: 3,
      retries: 0,
      lastAttemptedAt: "2026-07-05T10:15:00.000Z"
    });
    expect(third.countries.japan.mistakes).toBe(4);
  });

  it("quietly tracks retries without counting them as recognition success", () => {
    const progress = createEmptyProgress();

    const next = recordRecognitionResult(
      progress,
      {
        countryId: "japan",
        recognized: false
      },
      "2026-07-05T10:00:00.000Z"
    );

    expect(next.recognition.japan).toEqual({
      successfulRounds: 0,
      firstTrySuccesses: 0,
      retries: 1,
      lastAttemptedAt: "2026-07-05T10:00:00.000Z"
    });
    expect(getCountryMastery(next, "japan")).toBe("learning");
  });

  it("preserves recognition progress when another flag is colored", () => {
    const recognized = recordRecognitionResult(
      createEmptyProgress(),
      { countryId: "japan", recognized: true, firstTry: true },
      "2026-07-05T10:00:00.000Z"
    );
    const colored = recordCountryResult(
      recognized,
      { countryId: "france", completed: true, mistakes: 0 },
      "2026-07-05T10:05:00.000Z"
    );

    expect(colored.recognition).toEqual(recognized.recognition);
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
    expect(resetProgress()).toEqual({ countries: {}, recognition: {} });
  });
});
