import { describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  recordCountryResult,
  recordRecognitionResult
} from "./progress";
import { parseStoredProgress, serializeProgress } from "./progressStorage";

describe("progress storage helpers", () => {
  it("round-trips local progress as JSON", () => {
    const colored = recordCountryResult(
      createEmptyProgress(),
      { countryId: "japan", completed: true, mistakes: 0 },
      "2026-07-05T10:00:00.000Z"
    );
    const progress = recordRecognitionResult(
      colored,
      { countryId: "japan", recognized: true },
      "2026-07-05T10:02:00.000Z"
    );

    expect(parseStoredProgress(serializeProgress(progress))).toEqual(progress);
  });

  it("migrates coloring progress saved before recognition rounds existed", () => {
    const legacyProgress = JSON.stringify({
      countries: {
        japan: {
          attempts: 2,
          completions: 1,
          mistakes: 3,
          lastPracticedAt: "2026-07-05T10:00:00.000Z"
        }
      }
    });

    expect(parseStoredProgress(legacyProgress)).toEqual({
      countries: {
        japan: {
          attempts: 2,
          completions: 1,
          mistakes: 3,
          lastPracticedAt: "2026-07-05T10:00:00.000Z"
        }
      },
      recognition: {}
    });
  });

  it("falls back to empty progress when local storage has no usable value", () => {
    expect(parseStoredProgress(null)).toEqual(createEmptyProgress());
    expect(parseStoredProgress("not json")).toEqual(createEmptyProgress());
    expect(parseStoredProgress(JSON.stringify({ countries: [] }))).toEqual(
      createEmptyProgress()
    );
  });
});
