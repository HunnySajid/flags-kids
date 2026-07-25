import type { CountryFlag } from "./countries";

export type RecognitionStatus = "asking" | "try-again" | "correct";

export type RecognitionRound = {
  targetId: string;
  optionIds: [string, string];
  status: RecognitionStatus;
};

export type RecognitionAnswer = {
  nextRound: RecognitionRound;
  correct: boolean;
  newlyCompleted: boolean;
};

const hashText = (text: string): number => {
  let hash = 2166136261;

  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

export const createRecognitionRound = (
  countries: readonly Pick<CountryFlag, "id">[],
  targetId: string,
  roundSeed: string | number = 0
): RecognitionRound => {
  const uniqueCountryIds = [...new Set(countries.map((country) => country.id))];

  if (!uniqueCountryIds.includes(targetId)) {
    throw new Error(`Missing recognition target: ${targetId}`);
  }

  const distractors = uniqueCountryIds.filter((countryId) => countryId !== targetId);
  if (distractors.length === 0) {
    throw new Error("Recognition needs at least two countries");
  }

  const hash = hashText(`${targetId}:${roundSeed}`);
  const distractorId = distractors[hash % distractors.length];
  const optionIds: [string, string] =
    ((hash >>> 8) & 1) === 0
      ? [targetId, distractorId]
      : [distractorId, targetId];

  return {
    targetId,
    optionIds,
    status: "asking"
  };
};

export const answerRecognition = (
  round: RecognitionRound,
  selectedId: string
): RecognitionAnswer => {
  if (round.status === "correct") {
    return {
      nextRound: round,
      correct: selectedId === round.targetId,
      newlyCompleted: false
    };
  }

  if (selectedId === round.targetId) {
    return {
      nextRound: { ...round, status: "correct" },
      correct: true,
      newlyCompleted: true
    };
  }

  return {
    nextRound: { ...round, status: "try-again" },
    correct: false,
    newlyCompleted: false
  };
};
