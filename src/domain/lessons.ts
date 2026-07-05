import type { CountryFlag } from "./countries";

export type Lesson = {
  id: string;
  label: string;
  countries: string[];
};

export const buildLessons = (
  countries: CountryFlag[],
  lessonSize = 5
): Lesson[] => {
  const safeLessonSize = Math.max(1, lessonSize);
  const lessons: Lesson[] = [];

  for (let index = 0; index < countries.length; index += safeLessonSize) {
    const lessonNumber = lessons.length + 1;
    lessons.push({
      id: `lesson-${lessonNumber}`,
      label: `Lesson ${lessonNumber}`,
      countries: countries
        .slice(index, index + safeLessonSize)
        .map((country) => country.id)
    });
  }

  return lessons;
};

export const getLessonByIndex = (lessons: Lesson[], index: number): Lesson => {
  return lessons[index] ?? lessons[0];
};
