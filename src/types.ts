/*
 * Numberlike types
 ***/

export const kanjiNumbers = [
  "〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一",
  "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九",
] as const;
export type KanjiNumber = typeof kanjiNumbers[number];

export const gtpLetters = [
  "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", 
  "Q", "R", "S", "T", 
]
export type GtpLetter = typeof gtpLetters[number];

/*
 * Vector-like types
 ***/

export type BoardSize = {w: number, h: number};
export type XyCoord = {x: number, y: number};  // zero-indexed
export type JaCoord = `${number}の${KanjiNumber}`;
export type GtpCoord = `${GtpLetter}${number}`

/*
 * Board symmetries
 ***/

export const symmetries = {
  'p→p': {flip: false, rotate: 0},
  'p→ᓀ': {flip: false, rotate: 1},
  'p→d': {flip: false, rotate: 2},
  'p→ᓇ': {flip: false, rotate: 3},
  'p→q': {flip: true, rotate: 0},
  'p→ᓄ': {flip: true, rotate: 1},
  'p→b': {flip: true, rotate: 2},
  'p→ᓂ': {flip: true, rotate: 3}
} as const;  // flip first, then rotate

export type Symmetry = keyof typeof symmetries;

/*
 * Colors
 ***/

// this app
export type Color = "black" | "white" | "empty";
export type PlayerColor = "black" | "white";
// gtp
export type GtpPlayer = "B" | "W";

/*
 * Moves
 ***/

export type Move = {
  player: PlayerColor,
  value: JaCoord | "pass"
}

export type KataGoMove = [GtpPlayer, GtpCoord];

/*
 * KataGo Analysis
 ***/

export type KataGoQuery = {
  id: string,
  initialStones: Array<KataGoMove>,
  initialPlayer: GtpPlayer,
  moves: Array<KataGoMove>,
  rules: string,
  komi: number,
  boardXSize: number,
  boardYSize: number,
  includePolicy: boolean,
  includeOwnership: boolean,
}
