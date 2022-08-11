// zero-indexed
export type XyCoord = {x: number, y: number};

export type BoardSize = {w: number, h: number};

// flip first, then rotate
const symmetries = {
  'p→p': {flip: false, rotate: 0},
  'p→ᓀ': {flip: false, rotate: 1},
  'p→d': {flip: false, rotate: 2},
  'p→ᓇ': {flip: false, rotate: 3},
  'p→q': {flip: true, rotate: 0},
  'p→ᓄ': {flip: true, rotate: 1},
  'p→b': {flip: true, rotate: 2},
  'p→ᓂ': {flip: true, rotate: 3}
} as const;

type Symmetry = keyof typeof symmetries;

// (16, 3) -> 15, 16)

function transformXyCoord(
  boardSize: BoardSize,
  symmetry: Symmetry,
  coord: XyCoord
): XyCoord {
  let {x, y} = coord;
  const {flip, rotate} = symmetries[symmetry];
  if (flip) x = boardSize.w - x - 1;
  for (let i = 0; i < rotate; i++) {
    [x, y] = [boardSize.h - y - 1, x];
  }
  return {x, y};
}

const kanjiNumbers = [
  "〇",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
] as const;

type KanjiNumber = typeof kanjiNumbers[number];

export type JaCoord = `${number}の${KanjiNumber}`;

export function jaCoordToXyCoord(jaCoord: JaCoord): XyCoord {
  const parts = jaCoord.split("の");
  const x = parseInt(parts[0]) - 1;
  const yKanji = parts[1] as KanjiNumber;
  const y = kanjiNumbers.indexOf(yKanji) - 1;
  return {x, y};
}

export function xyCoordToJaCoord(xyCoord: XyCoord): JaCoord {
  const {x, y} = xyCoord;
  return `${x}の${kanjiNumbers[y + 1]}`
}
