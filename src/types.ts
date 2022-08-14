/*
 * Numberlike types
 ***/

export const kanjiNumbers = [
  "〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一",
  "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九",
] as const;
export type KanjiNumber = typeof kanjiNumbers[number];

export const gtpLetterValues = {
  "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6,
  "H": 7, "J": 8, "K": 9, "L": 10, "M": 11, "N": 12,
  "O": 13, "P": 14, "Q": 15, "R": 16, "S": 17, "T": 18,
}
export type GtpLetter = keyof typeof gtpLetterValues;

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
