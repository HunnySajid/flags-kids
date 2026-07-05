import { createEmptyProgress, type ProgressState } from "./progress";

export const PROGRESS_STORAGE_KEY = "flag-coloring-coach-progress";

const isProgressState = (value: unknown): value is ProgressState => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProgressState>;
  return (
    !!candidate.countries &&
    typeof candidate.countries === "object" &&
    !Array.isArray(candidate.countries)
  );
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
    return isProgressState(parsed) ? parsed : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
};
