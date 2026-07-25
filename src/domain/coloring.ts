import type { ColorName, CountryFlag } from "./countries";

export type ColoringState = {
  filledRegions: Record<string, string>;
  mistakes: number;
};

export type ColoringResult = {
  correct: boolean;
  completed: boolean;
  nextState: ColoringState;
  spokenColorName?: ColorName;
};

export const createColoringState = (_country: CountryFlag): ColoringState => ({
  filledRegions: {},
  mistakes: 0
});

export const isCountryComplete = (
  country: CountryFlag,
  state: ColoringState
): boolean => {
  return country.flagRegions.every(
    (region) => state.filledRegions[region.id] === region.targetColor
  );
};

export const getCompletionPercent = (
  country: CountryFlag,
  state: ColoringState
): number => {
  if (country.flagRegions.length === 0) {
    return 100;
  }

  const filled = country.flagRegions.filter(
    (region) => state.filledRegions[region.id] === region.targetColor
  ).length;

  return Math.round((filled / country.flagRegions.length) * 100);
};

export const applyColorToRegion = (
  country: CountryFlag,
  state: ColoringState,
  regionId: string,
  selectedColorName: ColorName
): ColoringResult => {
  const region = country.flagRegions.find((item) => item.id === regionId);

  if (!region || region.colorName !== selectedColorName) {
    const nextState = {
      ...state,
      mistakes: state.mistakes + 1
    };

    return {
      correct: false,
      completed: isCountryComplete(country, nextState),
      nextState
    };
  }

  const matchingRegions = country.flagRegions.filter(
    (item) => item.colorName === selectedColorName
  );
  const newlyFilledRegions = Object.fromEntries(
    matchingRegions.map((item) => [item.id, item.targetColor])
  );

  const nextState = {
    ...state,
    filledRegions: {
      ...state.filledRegions,
      ...newlyFilledRegions
    }
  };

  return {
    correct: true,
    completed: isCountryComplete(country, nextState),
    nextState,
    spokenColorName: region.colorName
  };
};
