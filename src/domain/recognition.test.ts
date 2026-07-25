import { describe, expect, it } from "vitest";
import { answerRecognition, createRecognitionRound } from "./recognition";

const countries = ["japan", "canada", "brazil", "ghana", "palestine"].map(
  (id) => ({ id })
);

describe("flag recognition rounds", () => {
  it("creates a stable two-choice round with the target exactly once", () => {
    const first = createRecognitionRound(countries, "canada");
    const second = createRecognitionRound(countries, "canada");

    expect(second).toEqual(first);
    expect(new Set(first.optionIds).size).toBe(2);
    expect(first.optionIds.filter((id) => id === "canada")).toHaveLength(1);
  });

  it("varies which side contains the answer across country names", () => {
    const answerPositions = countries.map(({ id }) =>
      createRecognitionRound(countries, id).optionIds.indexOf(id)
    );

    expect(new Set(answerPositions)).toEqual(new Set([0, 1]));
  });

  it("varies the distractor and answer side across seeded repeat rounds", () => {
    const rounds = Array.from({ length: 12 }, (_, seed) =>
      createRecognitionRound(countries, "japan", seed)
    );

    expect(new Set(rounds.map((round) => round.optionIds.join("|"))).size).toBeGreaterThan(2);
    expect(
      new Set(rounds.map((round) => round.optionIds.indexOf("japan")))
    ).toEqual(new Set([0, 1]));
  });

  it("requires a valid target and at least one distractor", () => {
    expect(() => createRecognitionRound(countries, "missing")).toThrow(
      "Missing recognition target"
    );
    expect(() => createRecognitionRound([{ id: "japan" }], "japan")).toThrow(
      "at least two countries"
    );
  });

  it("allows a gentle retry and credits a correct round only once", () => {
    const round = createRecognitionRound(countries, "japan");
    const distractor = round.optionIds.find((id) => id !== "japan")!;

    const wrong = answerRecognition(round, distractor);
    expect(wrong).toMatchObject({
      correct: false,
      newlyCompleted: false,
      nextRound: { status: "try-again" }
    });

    const correct = answerRecognition(wrong.nextRound, "japan");
    expect(correct).toMatchObject({
      correct: true,
      newlyCompleted: true,
      nextRound: { status: "correct" }
    });

    expect(answerRecognition(correct.nextRound, "japan")).toMatchObject({
      correct: true,
      newlyCompleted: false,
      nextRound: correct.nextRound
    });
  });
});
