import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Volume1,
  Volume2,
  X
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode
} from "react";
import {
  FLAG_COLOR_HEX,
  STARTER_COUNTRIES,
  type ColorName,
  type CountryFlag,
  type FlagShape
} from "./domain/countries";
import {
  applyColorToRegion,
  createColoringState,
  getCompletionPercent,
  type ColoringState
} from "./domain/coloring";
import { buildLessons, getLessonByIndex } from "./domain/lessons";
import {
  createEmptyProgress,
  getCountryMastery,
  getProgressSummary,
  recordCountryResult,
  recordRecognitionResult,
  resetProgress,
  type ProgressState
} from "./domain/progress";
import {
  parseStoredProgress,
  PROGRESS_STORAGE_KEY,
  serializeProgress
} from "./domain/progressStorage";
import {
  answerRecognition,
  createRecognitionRound,
  type RecognitionRound
} from "./domain/recognition";
import { getReferenceFlag } from "./domain/referenceFlags";
import { registerServiceWorker } from "./serviceWorker";

const lessons = buildLessons(STARTER_COUNTRIES, 5);

const countryById = new Map(
  STARTER_COUNTRIES.map((country) => [country.id, country])
);

const getPaletteColor = (country: CountryFlag, color: ColorName): string =>
  country.flagRegions.find((region) => region.colorName === color)
    ?.targetColor ?? FLAG_COLOR_HEX[color];

const getStoredProgress = (): ProgressState => {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }

  return parseStoredProgress(window.localStorage.getItem(PROGRESS_STORAGE_KEY));
};

type SpeechSpeed = "normal" | "slow";

const speak = (text: string, speed: SpeechSpeed = "normal") => {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = speed === "slow" ? 0.58 : 0.82;
  utterance.pitch = speed === "slow" ? 1 : 1.08;
  window.speechSynthesis.speak(utterance);
};

const speakCountryName = (
  country: Pick<CountryFlag, "name">,
  speed: SpeechSpeed = "normal"
) => speak(country.name, speed);

const starPoints = (shape: Extract<FlagShape, { kind: "star" }>): string => {
  const points: string[] = [];
  const step = Math.PI / shape.points;
  const start = ((shape.rotation ?? -90) * Math.PI) / 180;

  for (let index = 0; index < shape.points * 2; index += 1) {
    const radius = index % 2 === 0 ? shape.outerRadius : shape.innerRadius;
    const angle = start + index * step;
    const x = shape.cx + Math.cos(angle) * radius;
    const y = shape.cy + Math.sin(angle) * radius;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return points.join(" ");
};

const renderShape = (
  shape: FlagShape,
  fill: string,
  className: string,
  onClick?: () => void,
  ariaLabel?: string
): ReactNode => {
  const isTarget = className.includes("target-region");
  const isPracticeRegion = className.includes("practice-region");
  const isText = shape.kind === "text";
  const paint = "paint" in shape ? shape.paint : undefined;
  const shapeFill = paint?.fill === "none" ? "none" : fill;
  const shapeStroke =
    paint?.stroke === "current"
      ? fill
      : paint?.stroke === "none" || isText
        ? "none"
        : isTarget || isPracticeRegion
          ? "none"
          : "rgba(23, 58, 61, 0.48)";
  const shapeStrokeWidth =
    paint?.strokeWidth ?? (shapeStroke === "none" ? 0 : 2.5);
  const transform =
    shape.kind === "rect" && typeof shape.rotation === "number"
      ? `rotate(${shape.rotation} ${shape.rotateCx ?? 0} ${shape.rotateCy ?? 0})`
      : shape.kind === "path"
        ? shape.transform
        : undefined;
  const commonProps = {
    className,
    fill: shapeFill,
    stroke: shapeStroke,
    strokeWidth: shapeStrokeWidth,
    strokeLinecap: paint?.strokeLinecap,
    strokeLinejoin: paint?.strokeLinejoin,
    transform,
    onClick,
    pointerEvents: onClick ? "all" : undefined,
    "aria-label": onClick ? ariaLabel : undefined,
    role: onClick ? "button" : undefined,
    tabIndex: onClick ? 0 : undefined,
    onKeyDown: onClick
      ? (event: KeyboardEvent<SVGElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }
      : undefined
  };

  switch (shape.kind) {
    case "rect": {
      const {
        kind: _kind,
        paint: _paint,
        rotation: _rotation,
        rotateCx: _rotateCx,
        rotateCy: _rotateCy,
        ...rectProps
      } = shape;
      return <rect {...commonProps} {...rectProps} />;
    }
    case "line": {
      const { kind: _kind, paint: _paint, ...lineProps } = shape;
      return <line {...commonProps} {...lineProps} fill="none" />;
    }
    case "text": {
      const { kind: _kind, paint: _paint, text: _text, ...textProps } = shape;
      return (
        <text
          {...commonProps}
          {...textProps}
          dominantBaseline="middle"
          unicodeBidi="plaintext"
        >
          {shape.text}
        </text>
      );
    }
    case "circle": {
      const { kind: _kind, paint: _paint, ...circleProps } = shape;
      return <circle {...commonProps} {...circleProps} />;
    }
    case "polygon": {
      return <polygon {...commonProps} points={shape.points} />;
    }
    case "path": {
      return <path {...commonProps} d={shape.d} />;
    }
    case "star": {
      return <polygon {...commonProps} points={starPoints(shape)} />;
    }
    case "group":
      return (
        <g
          className={className}
          onClick={onClick}
          aria-label={onClick ? ariaLabel : undefined}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={commonProps.onKeyDown}
        >
          {shape.shapes.map((child, index) => (
            <g key={index}>
              {renderShape(child, fill, `${className} group-piece`)}
            </g>
          ))}
        </g>
      );
  }
};

type FlagCanvasProps = {
  country: CountryFlag;
  state?: ColoringState;
  selectedColor?: ColorName;
  interactive?: boolean;
  onRegionPress?: (regionId: string) => void;
};

const FlagCanvas = ({
  country,
  state,
  selectedColor,
  interactive = false,
  onRegionPress
}: FlagCanvasProps) => {
  const referenceFlag = getReferenceFlag(country.id);
  const isComplete =
    state !== undefined && getCompletionPercent(country, state) === 100;

  if (!interactive) {
    return (
      <img
        className="reference-flag"
        src={referenceFlag.src}
        alt={`${country.name} flag`}
        draggable={false}
      />
    );
  }

  return (
    <div
      className="practice-flag"
      style={{
        aspectRatio: referenceFlag.aspectRatio,
        "--practice-flag-max-width": `${referenceFlag.aspectRatio * 360}px`,
        "--practice-flag-mobile-max-width": `${referenceFlag.aspectRatio * 260}px`
      } as CSSProperties}
    >
      <img
        className={`practice-flag-reference ${
          isComplete ? "is-complete" : "is-coloring"
        }`}
        src={referenceFlag.src}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <svg
        className="flag-svg practice-flag-overlay"
        viewBox="0 0 300 180"
        preserveAspectRatio="none"
        aria-label={`${country.name} coloring flag`}
      >
        {!isComplete ? (
          <>
            <defs>
              {country.flagRegions.map((region) => (
                <mask
                  id={`flag-mask-${country.id}-${region.id}`}
                  key={region.id}
                  x="0"
                  y="0"
                  width="300"
                  height="180"
                  maskUnits="userSpaceOnUse"
                  maskContentUnits="userSpaceOnUse"
                >
                  {renderShape(
                    region.shape,
                    "white",
                    "mask-region target-region"
                  )}
                </mask>
              ))}
            </defs>

            {country.flagRegions.map((region) => {
              const isFilled = state?.filledRegions[region.id] !== undefined;

              return (
                <image
                  className={
                    isFilled
                      ? "painted-reference-region"
                      : "unpainted-reference-region"
                  }
                  href={referenceFlag.src}
                  key={region.id}
                  x="0"
                  y="0"
                  width="300"
                  height="180"
                  preserveAspectRatio="none"
                  mask={`url(#flag-mask-${country.id}-${region.id})`}
                />
              );
            })}

            {country.flagRegions.map((region) => {
              const isFilled = state?.filledRegions[region.id] !== undefined;
              const isSelectedTarget =
                !isFilled && selectedColor === region.colorName;
              const onPress =
                onRegionPress && !isFilled
                  ? () => onRegionPress(region.id)
                  : undefined;

              return (
                <g key={region.id} aria-label={region.colorName}>
                  {renderShape(
                    region.shape,
                    "transparent",
                    `flag-region practice-region ${
                      isSelectedTarget ? "region-ready" : ""
                    }`,
                    region.hitShape ? undefined : onPress,
                    `${region.colorName} region`
                  )}
                  {region.hitShape && onPress
                    ? renderShape(
                        region.hitShape,
                        "transparent",
                        "flag-region practice-hit-region",
                        onPress,
                        `${region.colorName} region`
                      )
                    : null}
                </g>
              );
            })}
          </>
        ) : null}
        {country.id !== "nepal" ? (
          <rect
            className="flag-outline"
            x="1.5"
            y="1.5"
            width="297"
            height="177"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
    </div>
  );
};

type ColorPaletteProps = {
  country: CountryFlag;
  selectedColor: ColorName;
  className: string;
  onSelect: (color: ColorName) => void;
};

const ColorPalette = ({
  country,
  selectedColor,
  className,
  onSelect
}: ColorPaletteProps) => (
  <div className={`palette ${className}`} aria-label="Colors">
    {country.colors.map((color) => (
      <button
        className={selectedColor === color ? "color-chip active" : "color-chip"}
        key={color}
        type="button"
        aria-label={color}
        onClick={() => onSelect(color)}
      >
        <span
          className="color-swatch"
          style={{ backgroundColor: getPaletteColor(country, color) }}
        />
        <span>{color}</span>
      </button>
    ))}
  </div>
);

export const App = () => {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [countryIndex, setCountryIndex] = useState(0);
  const [progress, setProgress] = useState<ProgressState>(getStoredProgress);
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [recognitionRound, setRecognitionRound] =
    useState<RecognitionRound | null>(null);
  const [lastWrongChoice, setLastWrongChoice] = useState<string | null>(null);
  const [completedThisSession, setCompletedThisSession] = useState<Set<string>>(
    () => new Set()
  );
  const [lastMessage, setLastMessage] = useState("Listen to the country name.");
  const recognitionPromptTimer = useRef<number | null>(null);

  const currentLesson = getLessonByIndex(lessons, lessonIndex);
  const lessonCountries = currentLesson.countries
    .map((countryId) => countryById.get(countryId))
    .filter((country): country is CountryFlag => !!country);
  const currentCountry =
    lessonCountries[countryIndex] ?? lessonCountries[0] ?? STARTER_COUNTRIES[0];
  const [coloringState, setColoringState] = useState(() =>
    createColoringState(currentCountry)
  );
  const [selectedColor, setSelectedColor] = useState<ColorName>(
    currentCountry.colors[0]
  );

  const completionPercent = getCompletionPercent(currentCountry, coloringState);
  const isCurrentComplete = completionPercent === 100;
  const isRecognitionComplete = recognitionRound?.status === "correct";
  const lessonComplete = lessonCountries.every((country) =>
    completedThisSession.has(country.id)
  );
  const recognitionCountries = useMemo(
    () =>
      recognitionRound?.optionIds
        .map((countryId) => countryById.get(countryId))
        .filter((country): country is CountryFlag => !!country) ?? [],
    [recognitionRound]
  );
  const progressSummary = useMemo(
    () => getProgressSummary(progress, STARTER_COUNTRIES.length),
    [progress]
  );

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      serializeProgress(progress)
    );
  }, [progress]);

  useEffect(() => {
    const nextCountry =
      lessonCountries[countryIndex] ??
      lessonCountries[0] ??
      STARTER_COUNTRIES[0];
    if (recognitionPromptTimer.current !== null) {
      window.clearTimeout(recognitionPromptTimer.current);
      recognitionPromptTimer.current = null;
    }
    setColoringState(createColoringState(nextCountry));
    const firstColor = nextCountry.colors[0];
    setSelectedColor(firstColor);
    setRecognitionRound(null);
    setLastWrongChoice(null);
    setLastMessage(`Find ${firstColor}.`);
    speak(`This is ${nextCountry.name}. Find ${firstColor}.`);
  }, [countryIndex, lessonIndex]);

  useEffect(
    () => () => {
      if (recognitionPromptTimer.current !== null) {
        window.clearTimeout(recognitionPromptTimer.current);
      }
    },
    []
  );

  const replayCountryName = useCallback(() => {
    speakCountryName(currentCountry);
  }, [currentCountry.name]);

  const replayCountryNameSlowly = useCallback(() => {
    speakCountryName(currentCountry, "slow");
  }, [currentCountry.name]);

  const handleColorSelect = (color: ColorName) => {
    setSelectedColor(color);
    setLastMessage(`Find ${color}.`);
    speak(`Find ${color}.`);
  };

  const handleRegionPress = (regionId: string) => {
    if (isCurrentComplete) {
      return;
    }

    const wasComplete = getCompletionPercent(currentCountry, coloringState) === 100;
    const result = applyColorToRegion(
      currentCountry,
      coloringState,
      regionId,
      selectedColor
    );

    setColoringState(result.nextState);

    if (!result.correct) {
      setLastMessage(`Almost. Try ${selectedColor} again.`);
      speak(`Almost. Try ${selectedColor} again.`);
      return;
    }

    if (result.completed && !wasComplete) {
      setProgress((existing) =>
        recordCountryResult(existing, {
          countryId: currentCountry.id,
          completed: true,
          mistakes: result.nextState.mistakes
        })
      );
      setRecognitionRound(
        createRecognitionRound(
          STARTER_COUNTRIES,
          currentCountry.id,
          Date.now()
        )
      );
      setLastWrongChoice(null);
      setLastMessage(`Which flag is ${currentCountry.name}?`);
      recognitionPromptTimer.current = window.setTimeout(
        () =>
          speak(
            `Great job. Now find ${currentCountry.name}. Which flag is ${currentCountry.name}?`
          ),
        650
      );
      return;
    }

    const nextRegion = currentCountry.flagRegions.find(
      (region) =>
        result.nextState.filledRegions[region.id] !== region.targetColor
    );
    if (nextRegion) {
      setSelectedColor(nextRegion.colorName);
      setLastMessage(`Good! Now find ${nextRegion.colorName}.`);
      speak(`Good. Now find ${nextRegion.colorName}.`);
    }
  };

  const handleRecognitionChoice = (selectedCountryId: string) => {
    if (!recognitionRound) {
      return;
    }

    if (recognitionPromptTimer.current !== null) {
      window.clearTimeout(recognitionPromptTimer.current);
      recognitionPromptTimer.current = null;
    }

    const isFirstTry = recognitionRound.status === "asking";
    const result = answerRecognition(recognitionRound, selectedCountryId);
    setRecognitionRound(result.nextRound);

    if (!result.correct) {
      setProgress((existing) =>
        recordRecognitionResult(existing, {
          countryId: currentCountry.id,
          recognized: false
        })
      );
      setLastWrongChoice(selectedCountryId);
      setLastMessage(`Almost. Listen again and find ${currentCountry.name}.`);
      speak(`Almost. Listen again. Find ${currentCountry.name}.`);
      return;
    }

    setLastWrongChoice(null);
    if (!result.newlyCompleted) {
      return;
    }

    setCompletedThisSession((existing) => {
      const next = new Set(existing);
      next.add(currentCountry.id);
      return next;
    });
    setProgress((existing) =>
      recordRecognitionResult(existing, {
        countryId: currentCountry.id,
        recognized: true,
        firstTry: isFirstTry
      })
    );
    setLastMessage(`Yes! This is ${currentCountry.name}.`);
    speak(`Yes. This is ${currentCountry.name}. Great job.`);
  };

  const goToCountry = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, lessonCountries.length - 1));
    setCountryIndex(boundedIndex);
  };

  const goToNextCountry = () => {
    if (countryIndex < lessonCountries.length - 1) {
      setCountryIndex((index) => index + 1);
      return;
    }

    setLessonIndex((index) => (index + 1) % lessons.length);
    setCountryIndex(0);
    setCompletedThisSession(new Set());
  };

  const chooseLesson = (nextLessonIndex: number) => {
    setLessonIndex(nextLessonIndex);
    setCountryIndex(0);
    setCompletedThisSession(new Set());
  };

  const resetAllProgress = () => {
    const empty = resetProgress();
    setProgress(empty);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(empty));
  };

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div className="country-heading">
          <p className="eyebrow">Flag Coloring Coach</p>
          <h1>{currentCountry.name}</h1>
          <p className="phonetic-name" aria-label="Pronunciation">
            {currentCountry.phonetic}
          </p>
        </div>
        <button
          className="icon-button parent-button"
          type="button"
          aria-label="Open parent progress"
          onClick={() => setIsParentOpen(true)}
        >
          <BarChart3 aria-hidden="true" />
        </button>
      </header>

      <nav className="lesson-tabs" aria-label="Lessons">
        {lessons.map((lesson, index) => (
          <button
            className={index === lessonIndex ? "lesson-tab active" : "lesson-tab"}
            type="button"
            key={lesson.id}
            onClick={() => chooseLesson(index)}
          >
            {lesson.label}
          </button>
        ))}
      </nav>

      <section className="coach-layout">
        <div className="flag-workspace">
          <div className="target-strip">
            {recognitionRound ? (
              <div className="recognition-question">
                <span>Listen and choose</span>
                <strong>
                  {isRecognitionComplete
                    ? `You found ${currentCountry.name}!`
                    : `Which flag is ${currentCountry.name}?`}
                </strong>
              </div>
            ) : (
              <div className="target-preview">
                <FlagCanvas country={currentCountry} />
              </div>
            )}
            <div className="name-audio-controls">
              <button
                className="speak-button"
                type="button"
                aria-label={`Hear ${currentCountry.name}`}
                onClick={replayCountryName}
              >
                <Volume2 aria-hidden="true" />
                <span>Hear name</span>
              </button>
              <button
                className="slow-speak-button"
                type="button"
                aria-label={`Hear ${currentCountry.name} slowly`}
                onClick={replayCountryNameSlowly}
              >
                <Volume1 aria-hidden="true" />
                <span>Slow</span>
              </button>
            </div>
          </div>

          {!recognitionRound ? (
            <ColorPalette
              className="mobile-palette"
              country={currentCountry}
              selectedColor={selectedColor}
              onSelect={handleColorSelect}
            />
          ) : null}

          <div className="paint-stage">
            {recognitionRound && recognitionCountries.length === 2 ? (
              <div
                className="recognition-choices"
                role="group"
                aria-label={`Choose the ${currentCountry.name} flag`}
              >
                {recognitionCountries.map((country) => (
                  <button
                    className={[
                      "recognition-choice",
                      lastWrongChoice === country.id ? "is-wrong" : "",
                      isRecognitionComplete && country.id === currentCountry.id
                        ? "is-correct"
                        : ""
                    ].join(" ")}
                    type="button"
                    key={country.id}
                    aria-label={`${country.name} flag`}
                    disabled={isRecognitionComplete}
                    onClick={() => handleRecognitionChoice(country.id)}
                  >
                    <FlagCanvas country={country} />
                  </button>
                ))}
              </div>
            ) : (
              <FlagCanvas
                country={currentCountry}
                interactive
                onRegionPress={handleRegionPress}
                selectedColor={selectedColor}
                state={coloringState}
              />
            )}
          </div>

          <div className="progress-rail" aria-label="Lesson progress">
            {lessonCountries.map((country, index) => (
              <button
                className={[
                  "country-dot",
                  index === countryIndex ? "current" : "",
                  completedThisSession.has(country.id) ? "done" : ""
                ].join(" ")}
                key={country.id}
                type="button"
                aria-label={country.name}
                onClick={() => goToCountry(index)}
              >
                {completedThisSession.has(country.id) ? (
                  <Check aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
        </div>

        <aside className="practice-panel">
          {!recognitionRound ? (
            <ColorPalette
              className="desktop-palette"
              country={currentCountry}
              selectedColor={selectedColor}
              onSelect={handleColorSelect}
            />
          ) : null}

          <div className="status-band" aria-live="polite">
            {isRecognitionComplete ? (
              <>
                <Sparkles aria-hidden="true" />
                <span>
                  {lessonComplete ? "Lesson complete!" : lastMessage}
                </span>
              </>
            ) : (
              <span>{lastMessage}</span>
            )}
          </div>

          <div className="completion-meter" aria-label="Flag completion">
            <span style={{ width: `${completionPercent}%` }} />
          </div>

          <div className="nav-actions">
            <button
              className="quiet-button"
              type="button"
              onClick={() => goToCountry(countryIndex - 1)}
              disabled={countryIndex === 0}
              aria-label="Previous flag"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              className="next-button"
              type="button"
              onClick={goToNextCountry}
              disabled={!isRecognitionComplete}
            >
              <span>{lessonComplete ? "Next lesson" : "Next"}</span>
              <ArrowRight aria-hidden="true" />
            </button>
            <button
              className="quiet-button"
              type="button"
              onClick={() => goToCountry(countryIndex + 1)}
              disabled={
                !isRecognitionComplete ||
                countryIndex === lessonCountries.length - 1
              }
              aria-label="Next flag"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </aside>
      </section>

      {isParentOpen ? (
        <div className="parent-overlay" role="dialog" aria-modal="true">
          <section className="parent-panel">
            <div className="parent-header">
              <div>
                <p className="eyebrow">Parent</p>
                <h2>Progress</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close parent progress"
                onClick={() => setIsParentOpen(false)}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="summary-grid">
              <div>
                <strong>{progressSummary.practiced}</strong>
                <span>Practiced</span>
              </div>
              <div>
                <strong>{progressSummary.completed}</strong>
                <span>Completed</span>
              </div>
              <div>
                <strong>{progressSummary.strong}</strong>
                <span>Strong</span>
              </div>
              <div>
                <strong>{progressSummary.total}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="progress-list">
              {STARTER_COUNTRIES.map((country) => {
                const countryProgress = progress.countries[country.id];
                const recognitionProgress = progress.recognition[country.id];
                const mastery = getCountryMastery(progress, country.id);
                return (
                  <div className="progress-row" key={country.id}>
                    <div className="mini-flag">
                      <FlagCanvas country={country} />
                    </div>
                    <div>
                      <strong>{country.name}</strong>
                      <span>{mastery}</span>
                    </div>
                    <div className="progress-counts">
                      <span
                        className="attempt-pill"
                        aria-label={`${countryProgress?.completions ?? 0} coloring completions`}
                        title="Coloring completions"
                      >
                        Color {countryProgress?.completions ?? 0}
                      </span>
                      <span
                        className="recognition-pill"
                        aria-label={`${recognitionProgress?.successfulRounds ?? 0} recognition successes, ${recognitionProgress?.firstTrySuccesses ?? 0} on the first try`}
                        title={`${recognitionProgress?.firstTrySuccesses ?? 0} first-try successes; ${recognitionProgress?.retries ?? 0} retries`}
                      >
                        Quiz {recognitionProgress?.successfulRounds ?? 0}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="reset-button" type="button" onClick={resetAllProgress}>
              <RotateCcw aria-hidden="true" />
              <span>Reset progress</span>
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
};
