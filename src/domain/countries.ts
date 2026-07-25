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
      transform?: string;
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
  hitShape?: FlagShape;
};

export type CountryFlag = {
  id: string;
  name: string;
  phonetic: string;
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

const pathShape = (
  d: string,
  paint?: ShapePaint,
  transform?: string
): FlagShape => ({
  kind: "path",
  d,
  transform,
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
  paint?: ShapePaint,
  transform?: string
): FlagRegion => ({
  id,
  colorName,
  targetColor,
  shape: pathShape(d, paint, transform)
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
    [225, 36, 10.5],
    [254.7, 67, 9],
    [190.3, 77.8, 10.5],
    [225, 144, 12]
  ].map(([cx, cy, outer]) =>
    starShape(cx, cy, outer * scale, outer * scale * 0.44)
  );

const unionJackWhite = (): FlagShape[] => [
  polygonShape("0,0 18,0 150,78 150,90 132,90 0,12"),
  polygonShape("150,0 150,12 18,90 0,90 0,78 132,0"),
  rectShape(0, 30, 150, 30),
  rectShape(60, 0, 30, 90)
];

const unionJackRed = (): FlagShape[] => [
  polygonShape("0,0 9,0 150,83 150,90 141,90 0,7"),
  polygonShape("150,0 150,7 9,90 0,90 0,83 141,0"),
  rectShape(0, 36, 150, 18),
  rectShape(66, 0, 18, 90)
];

const unionJackFullWhite = (): FlagShape[] => [
  polygonShape("0,0 60,0 300,144 300,180 240,180 0,36"),
  polygonShape("300,0 300,36 60,180 0,180 0,144 240,0"),
  rectShape(0, 60, 300, 60),
  rectShape(125, 0, 50, 180)
];

const unionJackFullRed = (): FlagShape[] => [
  polygonShape("0,0 30,0 300,162 300,180 270,180 0,18"),
  polygonShape("300,0 300,18 30,180 0,180 0,162 270,0"),
  rectShape(0, 72, 300, 36),
  rectShape(135, 0, 30, 180)
];

const malaysiaStripeShapes = (redStripes: boolean): FlagShape[] =>
  Array.from({ length: 7 }, (_, index) => {
    const row = index * 2 + (redStripes ? 0 : 1);
    const hiddenByCanton = row < 8;
    const stripeHeight = 180 / 14;

    return rectShape(
      hiddenByCanton ? 150 : 0,
      row * stripeHeight,
      hiddenByCanton ? 150 : 300,
      stripeHeight
    );
  });

const NEPAL_DOUBLE_PENNANT_PATH = "M11 87H262L11 10V175H262L11 51Z";

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
    phonetic: "juh-PAN",
    colors: ["red"],
    flagRegions: [circle("disc", "red", "#bc002d", 150, 90, 54)]
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    phonetic: "bang-gluh-DESH",
    colors: ["green", "red"],
    flagRegions: [
      rect("green-field", "green", "#006a4e", 0, 0, 300, 180),
      circle("red-disc", "red", "#f42a41", 135, 90, 60)
    ]
  },
  {
    id: "france",
    name: "France",
    phonetic: "FRANTS",
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
    phonetic: "JUR-muh-nee",
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
    phonetic: "IT-uh-lee",
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
    phonetic: "EYE-er-lund",
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
    phonetic: "NETH-er-lundz",
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
    phonetic: "POH-lund",
    colors: ["white", "red"],
    flagRegions: [
      rect("white-band", "white", "#ffffff", 0, 0, 300, 90),
      rect("red-band", "red", "#dc143c", 0, 90, 300, 90)
    ]
  },
  {
    id: "ukraine",
    name: "Ukraine",
    phonetic: "yoo-KRAYN",
    colors: ["blue", "yellow"],
    flagRegions: [
      rect("blue-band", "blue", "#0057b7", 0, 0, 300, 90),
      rect("yellow-band", "yellow", "#ffd700", 0, 90, 300, 90)
    ]
  },
  {
    id: "finland",
    name: "Finland",
    phonetic: "FIN-lund",
    colors: ["white", "blue"],
    flagRegions: [
      rect("white-field", "white", "#ffffff", 0, 0, 300, 180),
      rect("blue-vertical", "blue", "#002f6c", 83.33, 0, 50, 180),
      rect("blue-horizontal", "blue", "#002f6c", 0, 65.45, 300, 49.1)
    ]
  },
  {
    id: "sweden",
    name: "Sweden",
    phonetic: "SWEE-dun",
    colors: ["blue", "yellow"],
    flagRegions: [
      rect("blue-field", "blue", "#006aa7", 0, 0, 300, 180),
      rect("yellow-vertical", "yellow", "#fecc00", 93.75, 0, 37.5, 180),
      rect("yellow-horizontal", "yellow", "#fecc00", 0, 72, 300, 36)
    ]
  },
  {
    id: "denmark",
    name: "Denmark",
    phonetic: "DEN-mark",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-field", "red", "#c60c30", 0, 0, 300, 180),
      rect("white-vertical", "white", "#ffffff", 97.3, 0, 32.43, 180),
      rect("white-horizontal", "white", "#ffffff", 0, 77.14, 300, 25.72)
    ]
  },
  {
    id: "turkey",
    name: "Turkey",
    phonetic: "TUR-kee",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-field", "red", "#e30a17", 0, 0, 300, 180),
      circle("white-moon", "white", "#ffffff", 106.25, 90, 47.5),
      circle("red-moon-cutout", "red", "#e30a17", 118.75, 90, 38),
      star("white-star", "white", "#ffffff", 168.5, 90, 23, 9.5, 5, 180)
    ]
  },
  {
    id: "pakistan",
    name: "Pakistan",
    phonetic: "PAK-ih-stan",
    colors: ["white", "green"],
    flagRegions: [
      rect("white-band", "white", "#ffffff", 0, 0, 75, 180),
      rect("green-field", "green", "#01411c", 75, 0, 225, 180),
      circle("white-moon", "white", "#ffffff", 187.5, 90, 54),
      circle("green-moon-cutout", "green", "#01411c", 204, 69, 49.5),
      star("white-star", "white", "#ffffff", 223, 64, 18, 8, 5, -48)
    ]
  },
  {
    id: "india",
    name: "India",
    phonetic: "IN-dee-uh",
    colors: ["orange", "white", "green", "blue"],
    flagRegions: [
      rect("orange-band", "orange", "#ff9933", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("green-band", "green", "#138808", 0, 120, 300, 60),
      groupRegion("ashoka-chakra", "blue", "#000080", [
        chakraShape(150, 90, 25)
      ])
    ]
  },
  {
    id: "canada",
    name: "Canada",
    phonetic: "CAN-uh-duh",
    colors: ["red"],
    flagRegions: [
      rect("left-red-band", "red", "#d52b1e", 0, 0, 75, 180),
      rect("right-red-band", "red", "#d52b1e", 225, 0, 75, 180),
      path(
        "maple-leaf",
        "red",
        "#d52b1e",
        "M4890 4430l-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z",
        undefined,
        "scale(0.03125 0.0375)"
      )
    ]
  },
  {
    id: "united-states",
    name: "United States",
    phonetic: "yoo-NYE-tid STAYTS",
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
    phonetic: "bruh-ZIL",
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
    phonetic: "south AF-ri-kuh",
    colors: ["red", "blue", "green", "white", "yellow", "black"],
    flagRegions: [
      rect("red-band", "red", "#e03c31", 0, 0, 300, 90),
      rect("blue-band", "blue", "#001489", 0, 90, 300, 90),
      path(
        "white-y-border",
        "white",
        "#ffffff",
        "M0 0L150 90L0 180M150 90H300",
        {
          fill: "none",
          stroke: "current",
          strokeWidth: 60,
          strokeLinecap: "butt",
          strokeLinejoin: "miter"
        }
      ),
      path(
        "yellow-fork-border",
        "yellow",
        "#ffb81c",
        "M0 24L100 90L0 156",
        {
          fill: "none",
          stroke: "current",
          strokeWidth: 14,
          strokeLinecap: "butt",
          strokeLinejoin: "miter"
        }
      ),
      polygon("black-triangle", "black", "#000000", "0,30 90,90 0,150"),
      path(
        "green-y",
        "green",
        "#007749",
        "M0 0L150 90L0 180M150 90H300",
        {
          fill: "none",
          stroke: "current",
          strokeWidth: 36,
          strokeLinecap: "butt",
          strokeLinejoin: "miter"
        }
      )
    ]
  },
  {
    id: "australia",
    name: "Australia",
    phonetic: "aw-STRAY-lee-uh",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-field", "blue", "#012169", 0, 0, 300, 180),
      groupRegion("union-jack-white", "white", "#ffffff", unionJackWhite()),
      groupRegion("union-jack-red", "red", "#e4002b", unionJackRed()),
      star("commonwealth-star", "white", "#ffffff", 75, 135, 27, 11.5, 7),
      star("southern-cross-alpha", "white", "#ffffff", 225, 150, 13, 5.7, 7),
      star("southern-cross-beta", "white", "#ffffff", 187.5, 78.75, 13, 5.7, 7),
      star("southern-cross-gamma", "white", "#ffffff", 225, 30, 13, 5.7, 7),
      star("southern-cross-delta", "white", "#ffffff", 258.33, 66.75, 13, 5.7, 7),
      star("southern-cross-epsilon", "white", "#ffffff", 240, 97.5, 8, 3.5, 5)
    ]
  },
  {
    id: "spain",
    name: "Spain",
    phonetic: "SPAYN",
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
    phonetic: "BEL-jum",
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
    phonetic: "AW-stree-uh",
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
    phonetic: "SWIT-ser-lund",
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
    phonetic: "NOR-way",
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
    phonetic: "GREES",
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
    phonetic: "IZ-ray-ul",
    colors: ["white", "blue"],
    flagRegions: [
      rect("white-field", "white", "#ffffff", 0, 0, 300, 180),
      rect("top-blue-stripe", "blue", "#0038b8", 0, 16.88, 300, 28.13),
      rect("bottom-blue-stripe", "blue", "#0038b8", 0, 135, 300, 28.13),
      groupRegion("magen-david", "blue", "#0038b8", [
        polygonShape("150,54 186,116 114,116", strokeOnly(6)),
        polygonShape("150,126 114,64 186,64", strokeOnly(6))
      ])
    ]
  },
  {
    id: "china",
    name: "China",
    phonetic: "CHY-nuh",
    colors: ["red", "yellow"],
    flagRegions: [
      rect("red-field", "red", "#de2910", 0, 0, 300, 180),
      star("large-star", "yellow", "#ffde00", 50, 45, 27, 10.8),
      star("small-star-1", "yellow", "#ffde00", 100, 18, 9, 3.6, 5, 151.6),
      star("small-star-2", "yellow", "#ffde00", 120, 36, 9, 3.6, 5, 172.7),
      star("small-star-3", "yellow", "#ffde00", 120, 63, 9, 3.6, 5, -165.6),
      star("small-star-4", "yellow", "#ffde00", 100, 81, 9, 3.6, 5, -144.2)
    ]
  },
  {
    id: "south-korea",
    name: "South Korea",
    phonetic: "south kuh-REE-uh",
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
    phonetic: "MEK-si-koh",
    colors: ["green", "white", "red", "yellow"],
    flagRegions: [
      rect("green-band", "green", "#006847", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("red-band", "red", "#ce1126", 200, 0, 100, 180),
      circle("coat-of-arms", "yellow", "#d4af37", 150, 90, 38)
    ]
  },
  {
    id: "argentina",
    name: "Argentina",
    phonetic: "ar-jun-TEE-nuh",
    colors: ["blue", "white", "yellow"],
    flagRegions: [
      rect("top-blue-band", "blue", "#74acdf", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("bottom-blue-band", "blue", "#74acdf", 0, 120, 300, 60),
      groupRegion("sun-of-may", "yellow", "#f6b40e", [
        starShape(150, 90, 28, 19, 32),
        circleShape(150, 90, 15)
      ])
    ]
  },
  {
    id: "colombia",
    name: "Colombia",
    phonetic: "kuh-LUM-bee-uh",
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
    phonetic: "ny-JEER-ee-uh",
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
    phonetic: "EE-jipt",
    colors: ["red", "white", "black", "yellow"],
    flagRegions: [
      rect("red-band", "red", "#ce1126", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("black-band", "black", "#000000", 0, 120, 300, 60),
      circle("eagle-of-saladin", "yellow", "#c09300", 150, 90, 24)
    ]
  },
  {
    id: "morocco",
    name: "Morocco",
    phonetic: "muh-ROK-oh",
    colors: ["red", "green"],
    flagRegions: [
      rect("red-field", "red", "#c1272d", 0, 0, 300, 180),
      polygon(
        "green-pentagram",
        "green",
        "#006233",
        "150,48 174.69,123.98 110.06,77.02 189.94,77.02 125.31,123.98",
        strokeOnly(6)
      )
    ]
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    phonetic: "SOW-dee uh-RAY-bee-uh",
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
    phonetic: "in-duh-NEE-zhuh",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-band", "red", "#ff0000", 0, 0, 300, 90),
      rect("white-band", "white", "#ffffff", 0, 90, 300, 90)
    ]
  },
  {
    id: "thailand",
    name: "Thailand",
    phonetic: "TYE-land",
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
    phonetic: "vee-et-NAM",
    colors: ["red", "yellow"],
    flagRegions: [
      rect("red-field", "red", "#da251d", 0, 0, 300, 180),
      star("yellow-star", "yellow", "#ffcd00", 150, 90, 60, 30)
    ]
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    phonetic: "new ZEE-lund",
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
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    phonetic: "yoo-NYE-tid KING-dum",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-field", "blue", "#012169", 0, 0, 300, 180),
      groupRegion("white-crosses", "white", "#ffffff", unionJackFullWhite()),
      groupRegion("red-crosses", "red", "#c8102e", unionJackFullRed())
    ]
  },
  {
    id: "portugal",
    name: "Portugal",
    phonetic: "POR-chuh-gul",
    colors: ["green", "red", "yellow"],
    flagRegions: [
      rect("green-field", "green", "#046a38", 0, 0, 120, 180),
      rect("red-field", "red", "#da291c", 120, 0, 180, 180),
      circle("coat-of-arms", "yellow", "#ffcd00", 120, 90, 46)
    ]
  },
  {
    id: "russia",
    name: "Russia",
    phonetic: "RUSH-uh",
    colors: ["white", "blue", "red"],
    flagRegions: [
      rect("white-band", "white", "#ffffff", 0, 0, 300, 60),
      rect("blue-band", "blue", "#0039a6", 0, 60, 300, 60),
      rect("red-band", "red", "#d52b1e", 0, 120, 300, 60)
    ]
  },
  {
    id: "czechia",
    name: "Czechia",
    phonetic: "CHECK-ee-uh",
    colors: ["white", "red", "blue"],
    flagRegions: [
      rect("white-band", "white", "#ffffff", 0, 0, 300, 90),
      rect("red-band", "red", "#d7141a", 0, 90, 300, 90),
      polygon("blue-triangle", "blue", "#11457e", "0,0 150,90 0,180")
    ]
  },
  {
    id: "iceland",
    name: "Iceland",
    phonetic: "EYES-lund",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-field", "blue", "#003897", 0, 0, 300, 180),
      groupRegion("white-cross", "white", "#ffffff", [
        rectShape(84, 0, 48, 180),
        rectShape(0, 70, 300, 40)
      ]),
      groupRegion("red-cross", "red", "#d72828", [
        rectShape(96, 0, 24, 180),
        rectShape(0, 80, 300, 20)
      ])
    ]
  },
  {
    id: "philippines",
    name: "Philippines",
    phonetic: "FIL-uh-peenz",
    colors: ["blue", "red", "white", "yellow"],
    flagRegions: [
      polygon("blue-field", "blue", "#0038a8", "0,0 300,0 300,90 130,90"),
      polygon("red-field", "red", "#ce1126", "130,90 300,90 300,180 0,180"),
      polygon("white-triangle", "white", "#ffffff", "0,0 130,90 0,180"),
      groupRegion("golden-sun-and-stars", "yellow", "#fcd116", [
        starShape(47, 90, 36, 18, 8),
        circleShape(47, 90, 18),
        starShape(12, 24, 10, 4.3, 5),
        starShape(12, 156, 10, 4.3, 5, 18),
        starShape(107, 90, 10, 4.3, 5, 18)
      ])
    ]
  },
  {
    id: "malaysia",
    name: "Malaysia",
    phonetic: "muh-LAY-zhuh",
    colors: ["red", "white", "blue", "yellow"],
    flagRegions: [
      groupRegion("red-stripes", "red", "#cc0001", malaysiaStripeShapes(true)),
      groupRegion("white-stripes", "white", "#ffffff", malaysiaStripeShapes(false)),
      groupRegion("blue-canton", "blue", "#010066", [
        rectShape(0, 0, 150, 180 * (8 / 14)),
        circleShape(84, 51, 25)
      ]),
      groupRegion("yellow-crescent-and-star", "yellow", "#ffcc00", [
        circleShape(55, 51, 41),
        starShape(94, 51, 31, 12, 14)
      ])
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    phonetic: "SING-uh-por",
    colors: ["red", "white"],
    flagRegions: [
      rect("red-band", "red", "#ed2939", 0, 0, 300, 90),
      groupRegion("white-band-moon-and-stars", "white", "#ffffff", [
        rectShape(0, 90, 300, 90),
        circleShape(65, 45, 40),
        starShape(65, 38, 9, 3.8),
        starShape(105, 38, 9, 3.8),
        starShape(85, 25, 9, 3.8),
        starShape(73, 60, 9, 3.8),
        starShape(97, 60, 9, 3.8)
      ])
    ]
  },
  {
    id: "united-arab-emirates",
    name: "United Arab Emirates",
    phonetic: "yoo-NYE-tid AIR-ub EM-uh-rits",
    colors: ["red", "green", "white", "black"],
    flagRegions: [
      rect("red-band", "red", "#ff0000", 0, 0, 75, 180),
      rect("green-band", "green", "#00732f", 75, 0, 225, 60),
      rect("white-band", "white", "#ffffff", 75, 60, 225, 60),
      rect("black-band", "black", "#000000", 75, 120, 225, 60)
    ]
  },
  {
    id: "nepal",
    name: "Nepal",
    phonetic: "nuh-PAWL",
    colors: ["red", "blue", "white"],
    flagRegions: [
      {
        ...path(
          "blue-border",
          "blue",
          "#003893",
          NEPAL_DOUBLE_PENNANT_PATH,
          strokeOnly(14)
        ),
        hitShape: pathShape(
          NEPAL_DOUBLE_PENNANT_PATH,
          strokeOnly(42)
        )
      },
      path(
        "red-double-pennant",
        "red",
        "#dc143c",
        NEPAL_DOUBLE_PENNANT_PATH
      ),
      groupRegion("white-moon-and-sun", "white", "#ffffff", [
        circleShape(74, 70, 23),
        starShape(74, 132, 23, 14, 12)
      ])
    ]
  },
  {
    id: "chile",
    name: "Chile",
    phonetic: "CHIL-ee",
    colors: ["blue", "white", "red"],
    flagRegions: [
      rect("blue-canton", "blue", "#0039a6", 0, 0, 100, 90),
      groupRegion("white-band-and-star", "white", "#ffffff", [
        rectShape(100, 0, 200, 90),
        starShape(50, 45, 28, 11.2)
      ]),
      rect("red-band", "red", "#d52b1e", 0, 90, 300, 90)
    ]
  },
  {
    id: "peru",
    name: "Peru",
    phonetic: "puh-ROO",
    colors: ["red", "white"],
    flagRegions: [
      rect("left-red-band", "red", "#d91023", 0, 0, 100, 180),
      rect("white-band", "white", "#ffffff", 100, 0, 100, 180),
      rect("right-red-band", "red", "#d91023", 200, 0, 100, 180)
    ]
  },
  {
    id: "cuba",
    name: "Cuba",
    phonetic: "KYOO-buh",
    colors: ["blue", "white", "red"],
    flagRegions: [
      groupRegion("blue-stripes", "blue", "#002a8f", [
        rectShape(0, 0, 300, 36),
        rectShape(0, 72, 300, 36),
        rectShape(0, 144, 300, 36)
      ]),
      groupRegion("white-stripes-and-star", "white", "#ffffff", [
        rectShape(0, 36, 300, 36),
        rectShape(0, 108, 300, 36),
        starShape(43, 90, 22, 8.8)
      ]),
      polygon("red-triangle", "red", "#cf142b", "0,0 130,90 0,180")
    ]
  },
  {
    id: "jamaica",
    name: "Jamaica",
    phonetic: "juh-MAY-kuh",
    colors: ["green", "yellow", "black"],
    flagRegions: [
      groupRegion("green-triangles", "green", "#009b3a", [
        polygonShape("28,0 272,0 150,73"),
        polygonShape("28,180 272,180 150,107")
      ]),
      path(
        "yellow-saltire",
        "yellow",
        "#fed100",
        "M0 0L300 180M300 0L0 180",
        {
          fill: "none",
          stroke: "current",
          strokeWidth: 24,
          strokeLinecap: "butt",
          strokeLinejoin: "miter"
        }
      ),
      groupRegion("black-triangles", "black", "#000000", [
        polygonShape("0,20 130,90 0,160"),
        polygonShape("300,20 170,90 300,160")
      ])
    ]
  },
  {
    id: "kenya",
    name: "Kenya",
    phonetic: "KEN-yuh",
    colors: ["black", "white", "red", "green"],
    flagRegions: [
      rect("black-band", "black", "#000000", 0, 0, 300, 54),
      groupRegion("white-borders", "white", "#ffffff", [
        rectShape(0, 54, 300, 9),
        rectShape(0, 117, 300, 9)
      ]),
      groupRegion("red-band-and-shield", "red", "#bb0000", [
        rectShape(0, 63, 300, 54),
        circleShape(150, 90, 64)
      ]),
      rect("green-band", "green", "#006600", 0, 126, 300, 54)
    ]
  },
  {
    id: "ethiopia",
    name: "Ethiopia",
    phonetic: "ee-thee-OH-pee-uh",
    colors: ["green", "yellow", "red", "blue"],
    flagRegions: [
      rect("green-band", "green", "#078930", 0, 0, 300, 60),
      rect("yellow-band", "yellow", "#fcdd09", 0, 60, 300, 60),
      rect("red-band", "red", "#da121a", 0, 120, 300, 60),
      circle("national-emblem", "blue", "#0f47af", 150, 90, 60)
    ]
  },
  {
    id: "ghana",
    name: "Ghana",
    phonetic: "GAH-nuh",
    colors: ["red", "yellow", "green", "black"],
    flagRegions: [
      rect("red-band", "red", "#ce1126", 0, 0, 300, 60),
      rect("yellow-band", "yellow", "#fcd116", 0, 60, 300, 60),
      rect("green-band", "green", "#006b3f", 0, 120, 300, 60),
      star("black-star", "black", "#000000", 150, 90, 35, 14)
    ]
  },
  {
    id: "algeria",
    name: "Algeria",
    phonetic: "al-JEER-ee-uh",
    colors: ["green", "white", "red"],
    flagRegions: [
      rect("green-half", "green", "#006233", 0, 0, 150, 180),
      rect("white-half", "white", "#ffffff", 150, 0, 150, 180),
      path(
        "red-crescent-and-star",
        "red",
        "#d21034",
        "M580,225a150,150 0 1,0 0,150 120,120 0 1,1 0-150m5,75-135-44 84,115v-142l-84,115z",
        undefined,
        "scale(0.333333 0.3)"
      )
    ]
  },
  {
    id: "fiji",
    name: "Fiji",
    phonetic: "FEE-jee",
    colors: ["blue", "white", "red", "yellow"],
    flagRegions: [
      rect("light-blue-field", "blue", "#69b3e7", 0, 0, 300, 180),
      groupRegion("union-jack-white", "white", "#ffffff", unionJackWhite()),
      groupRegion("union-jack-red", "red", "#c8102e", unionJackRed()),
      rect("coat-of-arms", "yellow", "#fedd00", 194, 42, 63, 96, { rx: 18 })
    ]
  },
  {
    id: "palestine",
    name: "Palestine",
    phonetic: "PAL-uh-stine",
    colors: ["black", "white", "green", "red"],
    flagRegions: [
      rect("black-band", "black", "#000000", 0, 0, 300, 60),
      rect("white-band", "white", "#ffffff", 0, 60, 300, 60),
      rect("green-band", "green", "#007a3d", 0, 120, 300, 60),
      polygon("red-triangle", "red", "#ce1126", "0,0 100,90 0,180")
    ]
  }
];
