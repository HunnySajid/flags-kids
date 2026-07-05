export type ColorName =
  | "black"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "white"
  | "yellow";

export type ShapePaint = {
  fill?: "current" | "none";
  stroke?: "current" | "none";
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "bevel" | "miter" | "round";
};

type ShapeTransform = {
  rotation?: number;
  rotateCx?: number;
  rotateCy?: number;
};

export type FlagShape =
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      rx?: number;
      paint?: ShapePaint;
    } & ShapeTransform
  | {
      kind: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      paint?: ShapePaint;
    }
  | {
      kind: "text";
      x: number;
      y: number;
      text: string;
      fontSize: number;
      fontFamily?: string;
      fontWeight?: number | string;
      textAnchor?: "start" | "middle" | "end";
      direction?: "ltr" | "rtl";
      paint?: ShapePaint;
    }
  | {
      kind: "circle";
      cx: number;
      cy: number;
      r: number;
      paint?: ShapePaint;
    }
  | {
      kind: "polygon";
      points: string;
      paint?: ShapePaint;
    }
  | {
      kind: "path";
      d: string;
      paint?: ShapePaint;
    }
  | {
      kind: "star";
      cx: number;
      cy: number;
      outerRadius: number;
      innerRadius: number;
      points: number;
      rotation?: number;
      paint?: ShapePaint;
    }
  | {
      kind: "group";
      shapes: FlagShape[];
    };

export type FlagRegion = {
  id: string;
  colorName: ColorName;
  targetColor: string;
  shape: FlagShape;
};

export type CountryFlag = {
  id: string;
  name: string;
  colors: ColorName[];
  flagRegions: FlagRegion[];
};

export const FLAG_COLOR_HEX: Record<ColorName, string> = {
  black: "#111111",
  blue: "#1f5fbf",
  green: "#18864b",
  orange: "#f28c28",
  red: "#d62828",
  white: "#ffffff",
  yellow: "#f7d347"
};

const strokeOnly = (strokeWidth = 4): ShapePaint => ({
  fill: "none",
  stroke: "current",
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round"
});

const rectShape = (
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<Extract<FlagShape, { kind: "rect" }>> = {}
): FlagShape => ({
  kind: "rect",
  x,
  y,
  width,
  height,
  rx: options.rx,
  rotation: options.rotation,
  rotateCx: options.rotateCx,
  rotateCy: options.rotateCy,
  paint: options.paint
});

const circleShape = (
  cx: number,
  cy: number,
  r: number,
  paint?: ShapePaint
): FlagShape => ({
  kind: "circle",
  cx,
  cy,
  r,
  paint
});

const polygonShape = (points: string, paint?: ShapePaint): FlagShape => ({
  kind: "polygon",
  points,
  paint
});

const pathShape = (d: string, paint?: ShapePaint): FlagShape => ({
  kind: "path",
  d,
  paint
});

const starShape = (
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  points = 5,
  rotation = -90,
  paint?: ShapePaint
): FlagShape => ({
  kind: "star",
  cx,
  cy,
  outerRadius,
  innerRadius,
  points,
  rotation,
  paint
});

const lineShape = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeWidth = 3
): FlagShape => ({
  kind: "line",
  x1,
  y1,
  x2,
  y2,
  paint: strokeOnly(strokeWidth)
});

const textShape = (
  text: string,
  x: number,
  y: number,
  fontSize: number,
  options: Partial<Extract<FlagShape, { kind: "text" }>> = {}
): FlagShape => ({
  kind: "text",
  text,
  x,
  y,
  fontSize,
  fontFamily: options.fontFamily,
  fontWeight: options.fontWeight,
  textAnchor: options.textAnchor,
  direction: options.direction,
  paint: options.paint
});

const groupShape = (shapes: FlagShape[]): FlagShape => ({
  kind: "group",
  shapes
});

const rect = (
  id: string,
  colorName: ColorName,
  targetColor: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options?: Partial<Extract<FlagShape, { kind: "rect" }>>
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: rectShape(x, y, width, height, options)
});

const circle = (
  id: string,
  colorName: ColorName,
  targetColor: string,
  cx: number,
  cy: number,
  r: number,
  paint?: ShapePaint
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: circleShape(cx, cy, r, paint)
});

const polygon = (
  id: string,
  colorName: ColorName,
  targetColor: string,
  points: string,
  paint?: ShapePaint
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: polygonShape(points, paint)
});

const path = (
  id: string,
  colorName: ColorName,
  targetColor: string,
  d: string,
  paint?: ShapePaint
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: pathShape(d, paint)
});

const star = (
  id: string,
  colorName: ColorName,
  targetColor: string,
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  points = 5,
  rotation = -90,
  paint?: ShapePaint
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: starShape(cx, cy, outerRadius, innerRadius, points, rotation, paint)
});

const groupRegion = (
  id: string,
  colorName: ColorName,
  targetColor: string,
  shapes: FlagShape[]
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: groupShape(shapes)
});

const chakraShape = (cx: number, cy: number, radius: number): FlagShape => {
  const spokes = Array.from({ length: 24 }, (_, index) => {
    const angle = (index * Math.PI * 2) / 24 - Math.PI / 2;
    return lineShape(
      cx,
      cy,
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius,
      1.8
    );
  });

  return groupShape([
    circleShape(cx, cy, radius, strokeOnly(3)),
    circleShape(cx, cy, 3),
    ...spokes
  ]);
};

const southernCrossStars = (scale: number): FlagShape[] =>
  [
    [214, 54, 18],
    [246, 84, 16],
    [202, 122, 16],
    [258, 136, 14]
  ].map(([cx, cy, outer]) =>
    starShape(cx, cy, outer * scale, outer * scale * 0.44)
  );

const unionJackWhite = (): FlagShape[] => [
  polygonShape("0,0 18,0 150,78 150,90 132,90 0,12"),
  polygonShape("150,0 150,12 18,90 0,90 0,78 132,0"),
  rectShape(0, 36, 150, 18),
  rectShape(66, 0, 18, 90)
];

const unionJackRed = (): FlagShape[] => [
  polygonShape("0,0 9,0 150,83 150,90 141,90 0,7"),
  polygonShape("150,0 150,7 9,90 0,90 0,83 141,0"),
  rectShape(0, 40, 150, 10),
  rectShape(70, 0, 10, 90)
];

const trigramBarShapes = (
  cx: number,
  cy: number,
  rotation: number,
  pattern: Array<"solid" | "broken">
): FlagShape[] => {
  const barWidth = 54;
  const barHeight = 7;
  const gap = 8;
  const offsets = [-15, 0, 15];

  return pattern.flatMap((bar, index) => {
    const y = cy + offsets[index];
    const common = {
      rotation,
      rotateCx: cx,
      rotateCy: cy
    };

    if (bar === "solid") {
      return [rectShape(cx - barWidth / 2, y - barHeight / 2, barWidth, barHeight, common)];
    }

    return [
      rectShape(cx - barWidth / 2, y - barHeight / 2, 22, barHeight, common),
      rectShape(cx + gap / 2, y - barHeight / 2, 22, barHeight, common)
    ];
  });
};

export const STARTER_COUNTRIES: CountryFlag[] = [
  {
    id: "japan",
    name: "Japan",
    colors: ["red"],
    flagRegions: [circle("disc", "red", "#bc002d", 150, 90, 46)]
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    colors: ["green", "red"],
    flagRegions: [
      rect("green-field", "green", "#006a4e", 0, 0, 300, 180),
      circle("red-disc", "red", "#f42a41", 138, 90, 50)
    ]
  },
  {
    id: "france",
    name: "France",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-band", "blue", "#0055a4", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("red-band", "red", "#ef4135", 200, 0, 100, 180)
    ]
  },
  {
    id: "germany",
    name: "Germany",
    colors: ["black", "red", "yellow"],
    flagRegions: [
      rect("black-band", "black", "#000000", 0, 0, 300, 60),
      rect("red-band", "red", "#dd0000", 0, 60, 300, 60),
      rect("yellow-band", "yellow", "#ffce00", 0, 120, 300, 60)
    ]
  },
  {
    id: "italy",
    name: "Italy",
    colors: ["green", "white", "red"],
    flagRegions: [
      rect("green-band", "green", "#009246", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("red-band", "red", "#ce2b37", 200, 0, 100, 180)
    ]
  },
  {
    id: "ireland",
    name: "Ireland",
    colors: ["green", "white", "orange"],
    flagRegions: [
      rect("green-band", "green", "#169b62", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("orange-band", "orange", "#ff883e", 200, 0, 100, 180)
    ]
  },
  {
    id: "netherlands",
    name: "Netherlands",
    colors: ["red", "white", "blue"],
    flagRegions: [
      rect("red-band", "red", "#ae1c28", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("blue-band", "blue", "#21468b", 0, 120, 300, 60)
    ]
  },
  {
    id: "poland",
    name: "Poland",
    colors: ["white", "red"],
    flagRegions: [
      rect("white-band", "white", "#ffffff", 0, 0, 300, 90),
      rect("red-band", "red", "#dc143c", 0, 90, 300, 90)
    ]
  },
  {
    id: "ukraine",
    name: "Ukraine",
    colors: ["blue", "yellow"],
    flagRegions: [
      rect("blue-band", "blue", "#0057b7", 0, 0, 300, 90),
      rect("yellow-band", "yellow", "#ffd700", 0, 90, 300, 90)
    ]
  },
  {
    id: "finland",
    name: "Finland",
    colors: ["white", "blue"],
    flagRegions: [
      rect("white-field", "white", "#ffffff", 0, 0, 300, 180),
      rect("blue-vertical", "blue", "#002f6c", 86, 0, 34, 180),
      rect("blue-horizontal", "blue", "#002f6c", 0, 73, 300, 34)
    ]
  },
  {
    id: "sweden",
    name: "Sweden",
    colors: ["blue", "yellow"],
    flagRegions: [
      rect("blue-field", "blue", "#006aa7", 0, 0, 300, 180),
      rect("yellow-vertical", "yellow", "#fecc00", 88, 0, 32, 180),
      rect("yellow-horizontal", "yellow", "#fecc00", 0, 74, 300, 32)
    ]
  },
  {
    id: "denmark",
    name: "Denmark",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-field", "red", "#c60c30", 0, 0, 300, 180),
      rect("white-vertical", "white", "#ffffff", 92, 0, 32, 180),
      rect("white-horizontal", "white", "#ffffff", 0, 74, 300, 32)
    ]
  },
  {
    id: "turkey",
    name: "Turkey",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-field", "red", "#e30a17", 0, 0, 300, 180),
      circle("white-moon", "white", "#ffffff", 126, 90, 42),
      circle("red-moon-cutout", "red", "#e30a17", 140, 90, 34),
      star("white-star", "white", "#ffffff", 190, 90, 24, 10)
    ]
  },
  {
    id: "pakistan",
    name: "Pakistan",
    colors: ["white", "green"],
    flagRegions: [
      rect("white-band", "white", "#ffffff", 0, 0, 75, 180),
      rect("green-field", "green", "#01411c", 75, 0, 225, 180),
      circle("white-moon", "white", "#ffffff", 176, 88, 38),
      circle("green-moon-cutout", "green", "#01411c", 190, 82, 34),
      star("white-star", "white", "#ffffff", 218, 72, 18, 8)
    ]
  },
  {
    id: "india",
    name: "India",
    colors: ["orange", "white", "green", "blue"],
    flagRegions: [
      rect("orange-band", "orange", "#ff9933", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("green-band", "green", "#138808", 0, 120, 300, 60),
      groupRegion("ashoka-chakra", "blue", "#000080", [
        chakraShape(150, 90, 20)
      ])
    ]
  },
  {
    id: "canada",
    name: "Canada",
    colors: ["red"],
    flagRegions: [
      rect("left-red-band", "red", "#ff0000", 0, 0, 72, 180),
      rect("right-red-band", "red", "#ff0000", 228, 0, 72, 180),
      path(
        "maple-leaf",
        "red",
        "#ff0000",
        "M150 38 L160 68 L188 54 L176 82 L206 88 L176 104 L190 134 L160 122 L150 154 L140 122 L110 134 L124 104 L94 88 L124 82 L112 54 L140 68 Z"
      )
    ]
  },
  {
    id: "united-states",
    name: "United States",
    colors: ["red", "blue"],
    flagRegions: [
      rect("red-stripe-1", "red", "#b22234", 0, 0, 300, 14),
      rect("red-stripe-2", "red", "#b22234", 0, 28, 300, 14),
      rect("red-stripe-3", "red", "#b22234", 0, 56, 300, 14),
      rect("red-stripe-4", "red", "#b22234", 0, 84, 300, 14),
      rect("red-stripe-5", "red", "#b22234", 0, 112, 300, 14),
      rect("red-stripe-6", "red", "#b22234", 0, 140, 300, 14),
      rect("red-stripe-7", "red", "#b22234", 0, 168, 300, 12),
      rect("blue-canton", "blue", "#3c3b6e", 0, 0, 128, 98)
    ]
  },
  {
    id: "brazil",
    name: "Brazil",
    colors: ["green", "yellow", "blue"],
    flagRegions: [
      rect("green-field", "green", "#009b3a", 0, 0, 300, 180),
      polygon("yellow-diamond", "yellow", "#ffdf00", "150,22 274,90 150,158 26,90"),
      circle("blue-globe", "blue", "#002776", 150, 90, 44)
    ]
  },
  {
    id: "south-africa",
    name: "South Africa",
    colors: ["red", "blue", "green", "white", "yellow", "black"],
    flagRegions: [
      rect("red-band", "red", "#de3831", 0, 0, 300, 80),
      rect("blue-band", "blue", "#002395", 0, 100, 300, 80),
      polygon("white-upper-line", "white", "#ffffff", "0,0 300,0 300,20 70,90 300,160 300,180 0,180 105,90"),
      polygon("green-y", "green", "#007a4d", "0,22 112,90 0,158 0,128 64,90 0,52"),
      polygon("yellow-triangle", "yellow", "#ffb612", "0,40 78,90 0,140"),
      polygon("black-triangle", "black", "#000000", "0,54 54,90 0,126")
    ]
  },
  {
    id: "australia",
    name: "Australia",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-field", "blue", "#00008b", 0, 0, 300, 180),
      rect("union-white-horizontal", "white", "#ffffff", 0, 42, 130, 18),
      rect("union-white-vertical", "white", "#ffffff", 56, 0, 18, 90),
      rect("union-red-horizontal", "red", "#ff0000", 0, 46, 130, 10),
      rect("union-red-vertical", "red", "#ff0000", 60, 0, 10, 90),
      star("commonwealth-star", "white", "#ffffff", 70, 132, 18, 8, 7),
      star("southern-cross-1", "white", "#ffffff", 220, 42, 13, 6, 7),
      star("southern-cross-2", "white", "#ffffff", 246, 82, 11, 5, 7),
      star("southern-cross-3", "white", "#ffffff", 208, 124, 12, 5, 7),
      star("southern-cross-4", "white", "#ffffff", 258, 138, 9, 4, 5)
    ]
  },
  {
    id: "spain",
    name: "Spain",
    colors: ["red", "yellow"],
    flagRegions: [
      rect("top-red-band", "red", "#aa151b", 0, 0, 300, 45),
      rect("yellow-band", "yellow", "#f1bf00", 0, 45, 300, 90),
      rect("bottom-red-band", "red", "#aa151b", 0, 135, 300, 45)
    ]
  },
  {
    id: "belgium",
    name: "Belgium",
    colors: ["black", "yellow", "red"],
    flagRegions: [
      rect("black-band", "black", "#000000", 0, 0, 100, 180),
      rect("yellow-band", "yellow", "#fae042", 100, 0, 100, 180),
      rect("red-band", "red", "#ed2939", 200, 0, 100, 180)
    ]
  },
  {
    id: "austria",
    name: "Austria",
    colors: ["red", "white"],
    flagRegions: [
      rect("top-red-band", "red", "#ed2939", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("bottom-red-band", "red", "#ed2939", 0, 120, 300, 60)
    ]
  },
  {
    id: "switzerland",
    name: "Switzerland",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-field", "red", "#ff0000", 0, 0, 300, 180),
      rect("white-vertical", "white", "#ffffff", 132, 42, 36, 96),
      rect("white-horizontal", "white", "#ffffff", 102, 72, 96, 36)
    ]
  },
  {
    id: "norway",
    name: "Norway",
    colors: ["red", "white", "blue"],
    flagRegions: [
      rect("red-field", "red", "#ba0c2f", 0, 0, 300, 180),
      rect("white-vertical", "white", "#ffffff", 86, 0, 42, 180),
      rect("white-horizontal", "white", "#ffffff", 0, 70, 300, 42),
      rect("blue-vertical", "blue", "#00205b", 96, 0, 22, 180),
      rect("blue-horizontal", "blue", "#00205b", 0, 80, 300, 22)
    ]
  },
  {
    id: "greece",
    name: "Greece",
    colors: ["blue", "white"],
    flagRegions: [
      rect("blue-stripe-1", "blue", "#0d5eaf", 0, 0, 300, 20),
      rect("white-stripe-1", "white", "#ffffff", 0, 20, 300, 20),
      rect("blue-stripe-2", "blue", "#0d5eaf", 0, 40, 300, 20),
      rect("white-stripe-2", "white", "#ffffff", 0, 60, 300, 20),
      rect("blue-stripe-3", "blue", "#0d5eaf", 0, 80, 300, 20),
      rect("white-stripe-3", "white", "#ffffff", 0, 100, 300, 20),
      rect("blue-stripe-4", "blue", "#0d5eaf", 0, 120, 300, 20),
      rect("white-stripe-4", "white", "#ffffff", 0, 140, 300, 20),
      rect("blue-stripe-5", "blue", "#0d5eaf", 0, 160, 300, 20),
      rect("blue-canton", "blue", "#0d5eaf", 0, 0, 100, 100),
      rect("white-canton-vertical", "white", "#ffffff", 40, 0, 20, 100),
      rect("white-canton-horizontal", "white", "#ffffff", 0, 40, 100, 20)
    ]
  },
  {
    id: "israel",
    name: "Israel",
    colors: ["white", "blue"],
    flagRegions: [
      rect("white-field", "white", "#ffffff", 0, 0, 300, 180),
      rect("top-blue-stripe", "blue", "#0038b8", 0, 28, 300, 16),
      rect("bottom-blue-stripe", "blue", "#0038b8", 0, 136, 300, 16),
      groupRegion("magen-david", "blue", "#0038b8", [
        polygonShape("150,54 186,116 114,116", strokeOnly(6)),
        polygonShape("150,126 114,64 186,64", strokeOnly(6))
      ])
    ]
  },
  {
    id: "china",
    name: "China",
    colors: ["red", "yellow"],
    flagRegions: [
      rect("red-field", "red", "#de2910", 0, 0, 300, 180),
      star("large-star", "yellow", "#ffde00", 54, 48, 26, 10),
      star("small-star-1", "yellow", "#ffde00", 102, 28, 10, 4),
      star("small-star-2", "yellow", "#ffde00", 122, 52, 10, 4),
      star("small-star-3", "yellow", "#ffde00", 122, 84, 10, 4),
      star("small-star-4", "yellow", "#ffde00", 102, 108, 10, 4)
    ]
  },
  {
    id: "south-korea",
    name: "South Korea",
    colors: ["white", "red", "blue", "black"],
    flagRegions: [
      rect("white-field", "white", "#ffffff", 0, 0, 300, 180),
      path(
        "taegeuk-red",
        "red",
        "#cd2e3a",
        "M150 54 A36 36 0 0 1 150 126 A18 18 0 0 0 150 90 A18 18 0 0 1 150 54 Z"
      ),
      path(
        "taegeuk-blue",
        "blue",
        "#0047a0",
        "M150 126 A36 36 0 0 1 150 54 A18 18 0 0 0 150 90 A18 18 0 0 1 150 126 Z"
      ),
      groupRegion(
        "geon-trigram",
        "black",
        "#000000",
        trigramBarShapes(85, 48, -32, ["solid", "solid", "solid"])
      ),
      groupRegion(
        "gon-trigram",
        "black",
        "#000000",
        trigramBarShapes(215, 132, -32, ["broken", "broken", "broken"])
      ),
      groupRegion(
        "gam-trigram",
        "black",
        "#000000",
        trigramBarShapes(215, 48, 32, ["broken", "solid", "broken"])
      ),
      groupRegion(
        "ri-trigram",
        "black",
        "#000000",
        trigramBarShapes(85, 132, 32, ["solid", "broken", "solid"])
      )
    ]
  },
  {
    id: "mexico",
    name: "Mexico",
    colors: ["green", "white", "red", "yellow"],
    flagRegions: [
      rect("green-band", "green", "#006847", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("red-band", "red", "#ce1126", 200, 0, 100, 180),
      circle("yellow-seal", "yellow", "#d4af37", 150, 90, 18)
    ]
  },
  {
    id: "argentina",
    name: "Argentina",
    colors: ["blue", "white", "yellow"],
    flagRegions: [
      rect("top-blue-band", "blue", "#74acdf", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("bottom-blue-band", "blue", "#74acdf", 0, 120, 300, 60),
      circle("yellow-sun", "yellow", "#f6b40e", 150, 90, 18)
    ]
  },
  {
    id: "colombia",
    name: "Colombia",
    colors: ["yellow", "blue", "red"],
    flagRegions: [
      rect("yellow-band", "yellow", "#ffcd00", 0, 0, 300, 90),
      rect("blue-band", "blue", "#003087", 0, 90, 300, 45),
      rect("red-band", "red", "#c8102e", 0, 135, 300, 45)
    ]
  },
  {
    id: "nigeria",
    name: "Nigeria",
    colors: ["green", "white"],
    flagRegions: [
      rect("left-green-band", "green", "#008751", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("right-green-band", "green", "#008751", 200, 0, 100, 180)
    ]
  },
  {
    id: "egypt",
    name: "Egypt",
    colors: ["red", "white", "black", "yellow"],
    flagRegions: [
      rect("red-band", "red", "#ce1126", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("black-band", "black", "#000000", 0, 120, 300, 60),
      circle("yellow-emblem", "yellow", "#c09300", 150, 90, 14)
    ]
  },
  {
    id: "morocco",
    name: "Morocco",
    colors: ["red", "green"],
    flagRegions: [
      rect("red-field", "red", "#c1272d", 0, 0, 300, 180),
      star("green-star", "green", "#006233", 150, 90, 42, 16, 5)
    ]
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    colors: ["green", "white"],
    flagRegions: [
      rect("green-field", "green", "#006c35", 0, 0, 300, 180),
      groupRegion("shahada", "white", "#ffffff", [
        textShape("لا إله إلا الله", 150, 68, 28, {
          direction: "rtl",
          fontFamily: "serif",
          fontWeight: 700,
          textAnchor: "middle"
        }),
        textShape("محمد رسول الله", 150, 98, 25, {
          direction: "rtl",
          fontFamily: "serif",
          fontWeight: 700,
          textAnchor: "middle"
        })
      ]),
      groupRegion("sword", "white", "#ffffff", [
        polygonShape("50,132 82,122 82,142"),
        rectShape(82, 128, 146, 8, { rx: 3 }),
        rectShape(228, 122, 8, 20, { rx: 2 })
      ])
    ]
  },
  {
    id: "indonesia",
    name: "Indonesia",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-band", "red", "#ff0000", 0, 0, 300, 90),
      rect("white-band", "white", "#ffffff", 0, 90, 300, 90)
    ]
  },
  {
    id: "thailand",
    name: "Thailand",
    colors: ["red", "white", "blue"],
    flagRegions: [
      rect("top-red-band", "red", "#a51931", 0, 0, 300, 30),
      rect("top-white-band", "white", "#f4f5f8", 0, 30, 300, 30),
      rect("blue-band", "blue", "#2d2a4a", 0, 60, 300, 60),
      rect("bottom-white-band", "white", "#f4f5f8", 0, 120, 300, 30),
      rect("bottom-red-band", "red", "#a51931", 0, 150, 300, 30)
    ]
  },
  {
    id: "vietnam",
    name: "Vietnam",
    colors: ["red", "yellow"],
    flagRegions: [
      rect("red-field", "red", "#da251d", 0, 0, 300, 180),
      star("yellow-star", "yellow", "#ffcd00", 150, 90, 48, 18)
    ]
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-field", "blue", "#00247d", 0, 0, 300, 180),
      groupRegion("union-jack", "white", "#ffffff", unionJackWhite()),
      groupRegion("union-jack-red", "red", "#cf142b", unionJackRed()),
      groupRegion(
        "southern-cross-white-stars",
        "white",
        "#ffffff",
        southernCrossStars(1)
      ),
      groupRegion(
        "southern-cross-red-stars",
        "red",
        "#cc142b",
        southernCrossStars(0.62)
      )
    ]
  }
];
