export type CountryProgress = {
  attempts: number;
  completions: number;
  mistakes: number;
  lastPracticedAt: string;
};

export type ProgressState = {
  countries: Record<string, CountryProgress>;
};

export type CountryResult = {
  countryId: string;
  completed: boolean;
  mistakes: number;
};

export type Mastery = "new" | "learning" | "strong";

export type ProgressSummary = {
  practiced: number;
  completed: number;
  strong: number;
  total: number;
};

export const createEmptyProgress = (): ProgressState => ({
  countries: {}
});

export const resetProgress = (): ProgressState => createEmptyProgress();

export const recordCountryResult = (
  progress: ProgressState,
  result: CountryResult,
  practicedAt = new Date().toISOString()
): ProgressState => {
  const existing = progress.countries[result.countryId] ?? {
    attempts: 0,
    completions: 0,
    mistakes: 0,
    lastPracticedAt: practicedAt
  };

  return {
    countries: {
      ...progress.countries,
      [result.countryId]: {
        attempts: existing.attempts + 1,
        completions: existing.completions + (result.completed ? 1 : 0),
        mistakes: existing.mistakes + result.mistakes,
        lastPracticedAt: practicedAt
      }
    }
  };
};

export const getCountryMastery = (
  progress: ProgressState,
  countryId: string
): Mastery => {
  const country = progress.countries[countryId];

  if (!country) {
    return "new";
  }

  if (country.completions >= 3 && country.mistakes <= 1) {
    return "strong";
  }

  return "learning";
};

export const getProgressSummary = (
  progress: ProgressState,
  total: number
): ProgressSummary => {
  const entries = Object.entries(progress.countries);

  return {
    practiced: entries.length,
    completed: entries.filter(([, country]) => country.completions > 0).length,
    strong: entries.filter(([countryId]) => getCountryMastery(progress, countryId) === "strong").length,
    total
  };
};
