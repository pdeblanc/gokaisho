import { BoardSize, GtpCoord, JaCoord, KanjiNumber, XyCoord, gtpLetters, kanjiNumbers } from "./types";

export function jaCoordToXyCoord(jaCoord: JaCoord): XyCoord {
  const parts = jaCoord.split("の");
  const x = parseInt(parts[0]) - 1;
  const yKanji = parts[1] as KanjiNumber;
  const y = kanjiNumbers.indexOf(yKanji) - 1;
  return {x, y};
}

export function xyCoordToJaCoord(xyCoord: XyCoord): JaCoord {
  const {x, y} = xyCoord;
  return `${x + 1}の${kanjiNumbers[y + 1]}`
}

export function xyCoordToGtpCoord(boardSize: BoardSize, xyCoord: XyCoord): GtpCoord {
  // TODO: flip y
  const {x, y} = xyCoord;
  return `${gtpLetters[x]}${boardSize.h - y}`
}

export function jaCoordToGtpCoord(boardSize: BoardSize, jaCoord: JaCoord): GtpCoord {
  return xyCoordToGtpCoord(boardSize, jaCoordToXyCoord(jaCoord));
}
