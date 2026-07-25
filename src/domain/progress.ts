export type CountryProgress = {
  attempts: number;
  completions: number;
  mistakes: number;
  lastPracticedAt: string;
};

export type RecognitionProgress = {
  successfulRounds: number;
  firstTrySuccesses: number;
  retries: number;
  lastAttemptedAt: string;
};

export type ProgressState = {
  countries: Record<string, CountryProgress>;
  recognition: Record<string, RecognitionProgress>;
};

export type CountryResult = {
  countryId: string;
  completed: boolean;
  mistakes: number;
};

export type RecognitionResult = {
  countryId: string;
  recognized: boolean;
  firstTry?: boolean;
};

export type Mastery = "new" | "learning" | "strong";

export type ProgressSummary = {
  practiced: number;
  completed: number;
  strong: number;
  total: number;
};

export const createEmptyProgress = (): ProgressState => ({
  countries: {},
  recognition: {}
});

export const resetProgress = (): ProgressState => createEmptyProgress();

const createCountryProgress = (practicedAt: string): CountryProgress => ({
  attempts: 0,
  completions: 0,
  mistakes: 0,
  lastPracticedAt: practicedAt
});

export const recordCountryResult = (
  progress: ProgressState,
  result: CountryResult,
  practicedAt = new Date().toISOString()
): ProgressState => {
  const existing =
    progress.countries[result.countryId] ?? createCountryProgress(practicedAt);

  return {
    ...progress,
    countries: {
      ...progress.countries,
      [result.countryId]: {
        ...existing,
        attempts: existing.attempts + 1,
        completions: existing.completions + (result.completed ? 1 : 0),
        mistakes: existing.mistakes + result.mistakes,
        lastPracticedAt: practicedAt
      }
    }
  };
};

export const recordRecognitionResult = (
  progress: ProgressState,
  result: RecognitionResult,
  attemptedAt = new Date().toISOString()
): ProgressState => {
  const existing = progress.recognition[result.countryId] ?? {
    successfulRounds: 0,
    firstTrySuccesses: 0,
    retries: 0,
    lastAttemptedAt: attemptedAt
  };

  return {
    ...progress,
    recognition: {
      ...progress.recognition,
      [result.countryId]: {
        successfulRounds:
          existing.successfulRounds + (result.recognized ? 1 : 0),
        firstTrySuccesses:
          existing.firstTrySuccesses +
          (result.recognized && result.firstTry ? 1 : 0),
        retries: existing.retries + (result.recognized ? 0 : 1),
        lastAttemptedAt: attemptedAt
      }
    }
  };
};

export const getCountryMastery = (
  progress: ProgressState,
  countryId: string
): Mastery => {
  const country = progress.countries[countryId];
  const recognition = progress.recognition[countryId];

  if (!country && !recognition) {
    return "new";
  }

  if ((recognition?.firstTrySuccesses ?? 0) >= 3) {
    return "strong";
  }

  return "learning";
};

export const getProgressSummary = (
  progress: ProgressState,
  total: number
): ProgressSummary => {
  const practicedCountryIds = new Set([
    ...Object.keys(progress.countries),
    ...Object.keys(progress.recognition)
  ]);

  return {
    practiced: practicedCountryIds.size,
    completed: Object.values(progress.countries).filter(
      (country) => country.completions > 0
    ).length,
    strong: [...practicedCountryIds].filter(
      (countryId) => getCountryMastery(progress, countryId) === "strong"
    ).length,
    total
  };
};
