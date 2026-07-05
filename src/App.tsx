import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Volume2,
  X
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
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
  resetProgress,
  type ProgressState
} from "./domain/progress";
import {
  parseStoredProgress,
  PROGRESS_STORAGE_KEY,
  serializeProgress
} from "./domain/progressStorage";
import { registerServiceWorker } from "./serviceWorker";

const lessons = buildLessons(STARTER_COUNTRIES, 5);

const countryById = new Map(
  STARTER_COUNTRIES.map((country) => [country.id, country])
);

const getStoredProgress = (): ProgressState => {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }

  return parseStoredProgress(window.localStorage.getItem(PROGRESS_STORAGE_KEY));
};

const speak = (text: string) => {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
};

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
  onClick?: () => void
): ReactNode => {
  const isTarget = className.includes("target-region");
  const isText = shape.kind === "text";
  const paint = "paint" in shape ? shape.paint : undefined;
  const shapeFill = paint?.fill === "none" ? "none" : fill;
  const shapeStroke =
    paint?.stroke === "current"
      ? fill
      : paint?.stroke === "none" || isText
        ? "none"
        : isTarget
          ? "none"
          : "rgba(23, 58, 61, 0.48)";
  const shapeStrokeWidth =
    paint?.strokeWidth ?? (shapeStroke === "none" ? 0 : 2.5);
  const transform =
    shape.kind === "rect" && typeof shape.rotation === "number"
      ? `rotate(${shape.rotation} ${shape.rotateCx ?? 0} ${shape.rotateCy ?? 0})`
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
  return (
    <svg
      className="flag-svg"
      viewBox="0 0 300 180"
      aria-label={`${country.name} flag`}
    >
      <rect className="flag-paper" x="0" y="0" width="300" height="180" />
      {country.flagRegions.map((region) => {
        const fill = state
          ? state.filledRegions[region.id] ?? "#eef3f7"
          : region.targetColor;
        const isSelectedTarget = selectedColor === region.colorName;

        return (
          <g key={region.id} aria-label={region.colorName}>
            {renderShape(
              region.shape,
              fill,
              interactive
                ? `flag-region ${isSelectedTarget ? "region-ready" : ""}`
                : "flag-region target-region",
              interactive && onRegionPress
                ? () => onRegionPress(region.id)
                : undefined
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const App = () => {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [countryIndex, setCountryIndex] = useState(0);
  const [progress, setProgress] = useState<ProgressState>(getStoredProgress);
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [completedThisSession, setCompletedThisSession] = useState<Set<string>>(
    () => new Set()
  );
  const [lastMessage, setLastMessage] = useState("Tap the speaker.");

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
  const lessonComplete = lessonCountries.every((country) =>
    completedThisSession.has(country.id)
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
    setColoringState(createColoringState(nextCountry));
    setSelectedColor(nextCountry.colors[0]);
    setLastMessage("Tap the speaker.");
    speak(nextCountry.name);
  }, [countryIndex, lessonIndex]);

  const replayCountryName = useCallback(() => {
    speak(currentCountry.name);
  }, [currentCountry.name]);

  const handleColorSelect = (color: ColorName) => {
    setSelectedColor(color);
    speak(color);
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
      setLastMessage("Try another color.");
      speak("Try another color.");
      return;
    }

    if (result.spokenColorName) {
      setLastMessage(result.spokenColorName);
      speak(result.spokenColorName);
    }

    if (result.completed && !wasComplete) {
      setCompletedThisSession((existing) => {
        const next = new Set(existing);
        next.add(currentCountry.id);
        return next;
      });
      setProgress((existing) =>
        recordCountryResult(existing, {
          countryId: currentCountry.id,
          completed: true,
          mistakes: result.nextState.mistakes
        })
      );
      window.setTimeout(() => speak(`Great job. ${currentCountry.name}.`), 650);
    }
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
        <div>
          <p className="eyebrow">Flag Coloring Coach</p>
          <h1>{currentCountry.name}</h1>
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
            <div className="target-preview">
              <FlagCanvas country={currentCountry} />
            </div>
            <button
              className="speak-button"
              type="button"
              aria-label={`Say ${currentCountry.name}`}
              onClick={replayCountryName}
            >
              <Volume2 aria-hidden="true" />
            </button>
          </div>

          <div className="paint-stage">
            <FlagCanvas
              country={currentCountry}
              interactive
              onRegionPress={handleRegionPress}
              selectedColor={selectedColor}
              state={coloringState}
            />
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
          <div className="palette" aria-label="Colors">
            {currentCountry.colors.map((color) => (
              <button
                className={selectedColor === color ? "color-chip active" : "color-chip"}
                key={color}
                type="button"
                aria-label={color}
                onClick={() => handleColorSelect(color)}
              >
                <span
                  className="color-swatch"
                  style={{ backgroundColor: FLAG_COLOR_HEX[color] }}
                />
                <span>{color}</span>
              </button>
            ))}
          </div>

          <div className="status-band" aria-live="polite">
            {isCurrentComplete ? (
              <>
                <Sparkles aria-hidden="true" />
                <span>{lessonComplete ? "Lesson complete" : "Great job"}</span>
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
              disabled={!isCurrentComplete}
            >
              <span>{lessonComplete ? "Next lesson" : "Next"}</span>
              <ArrowRight aria-hidden="true" />
            </button>
            <button
              className="quiet-button"
              type="button"
              onClick={() => goToCountry(countryIndex + 1)}
              disabled={countryIndex === lessonCountries.length - 1}
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
                    <span className="attempt-pill">
                      {countryProgress?.completions ?? 0}
                    </span>
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
