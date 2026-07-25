import { describe, expect, it } from "vitest";
import { STARTER_COUNTRIES } from "./countries";
import { buildLessons, getLessonByIndex } from "./lessons";

describe("lesson building", () => {
  it("splits the 60 countries into twelve short lessons of five flags", () => {
    const lessons = buildLessons(STARTER_COUNTRIES, 5);

    expect(lessons).toHaveLength(12);
    expect(lessons.map((lesson) => lesson.countries)).toEqual([
      ["japan", "bangladesh", "france", "germany", "italy"],
      ["ireland", "netherlands", "poland", "ukraine", "finland"],
      ["sweden", "denmark", "turkey", "pakistan", "india"],
      ["canada", "united-states", "brazil", "south-africa", "australia"],
      ["spain", "belgium", "austria", "switzerland", "norway"],
      ["greece", "israel", "china", "south-korea", "mexico"],
      ["argentina", "colombia", "nigeria", "egypt", "morocco"],
      ["saudi-arabia", "indonesia", "thailand", "vietnam", "new-zealand"],
      ["united-kingdom", "portugal", "russia", "czechia", "iceland"],
      [
        "philippines",
        "malaysia",
        "singapore",
        "united-arab-emirates",
        "nepal"
      ],
      ["chile", "peru", "cuba", "jamaica", "kenya"],
      ["ethiopia", "ghana", "algeria", "fiji", "palestine"]
    ]);
  });

  it("returns the first lesson when a requested lesson index is outside the range", () => {
    const lessons = buildLessons(STARTER_COUNTRIES, 5);

    expect(getLessonByIndex(lessons, -1).id).toBe("lesson-1");
    expect(getLessonByIndex(lessons, 99).id).toBe("lesson-1");
  });
});
