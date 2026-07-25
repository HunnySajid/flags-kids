import {
  createEmptyProgress,
  type CountryProgress,
  type ProgressState,
  type RecognitionProgress
} from "./progress";

export const PROGRESS_STORAGE_KEY = "flag-coloring-coach-progress";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const toCount = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;

const normalizeCountryProgress = (
  value: unknown
): CountryProgress | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    attempts: toCount(value.attempts),
    completions: toCount(value.completions),
    mistakes: toCount(value.mistakes),
    lastPracticedAt:
      typeof value.lastPracticedAt === "string" ? value.lastPracticedAt : ""
  };
};

const normalizeRecognitionProgress = (
  value: unknown
): RecognitionProgress | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    successfulRounds: toCount(value.successfulRounds),
    firstTrySuccesses: toCount(value.firstTrySuccesses),
    retries: toCount(value.retries),
    lastAttemptedAt:
      typeof value.lastAttemptedAt === "string"
        ? value.lastAttemptedAt
        : ""
  };
};

const normalizeProgressState = (value: unknown): ProgressState | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<ProgressState>;
  if (!isRecord(candidate.countries)) {
    return undefined;
  }

  const countries: ProgressState["countries"] = {};
  for (const [countryId, countryProgress] of Object.entries(
    candidate.countries
  )) {
    const normalized = normalizeCountryProgress(countryProgress);
    if (normalized) {
      countries[countryId] = normalized;
    }
  }

  const recognition: ProgressState["recognition"] = {};
  if (isRecord(candidate.recognition)) {
    for (const [countryId, recognitionProgress] of Object.entries(
      candidate.recognition
    )) {
      const normalized = normalizeRecognitionProgress(recognitionProgress);
      if (normalized) {
        recognition[countryId] = normalized;
      }
    }
  }

  return { countries, recognition };
};

export const serializeProgress = (progress: ProgressState): string => {
  return JSON.stringify(progress);
};

export const parseStoredProgress = (storedValue: string | null): ProgressState => {
  if (!storedValue) {
    return createEmptyProgress();
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);
    return normalizeProgressState(parsed) ?? createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
};
