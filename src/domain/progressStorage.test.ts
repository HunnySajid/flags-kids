import { describe, expect, it } from "vitest";
import { createEmptyProgress, recordCountryResult } from "./progress";
import { parseStoredProgress, serializeProgress } from "./progressStorage";

describe("progress storage helpers", () => {
  it("round-trips local progress as JSON", () => {
    const progress = recordCountryResult(
      createEmptyProgress(),
      { countryId: "japan", completed: true, mistakes: 0 },
      "2026-07-05T10:00:00.000Z"
    );

    expect(parseStoredProgress(serializeProgress(progress))).toEqual(progress);
  });

  it("falls back to empty progress when local storage has no usable value", () => {
    expect(parseStoredProgress(null)).toEqual(createEmptyProgress());
    expect(parseStoredProgress("not json")).toEqual(createEmptyProgress());
    expect(parseStoredProgress(JSON.stringify({ countries: [] }))).toEqual(
      createEmptyProgress()
    );
  });
});
