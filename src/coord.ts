import {
  BoardSize,
  JaCoord,
  KanjiNumber,
  Symmetry,
  XyCoord,
  kanjiNumbers,
  symmetries
} from "./types";

export function randomSymmetry(): Symmetry {
  const keys: Array<Symmetry> = Object.keys(symmetries) as Array<Symmetry>;
  return keys[Math.floor(Math.random() * keys.length)];
}

export function transformXyCoord(
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

export function transformJaCoord(
  boardSize: BoardSize,
  symmetry: Symmetry,
  coord: JaCoord
): JaCoord {
  const xyCoord = jaCoordToXyCoord(coord);
  const newXyCoord = transformXyCoord(boardSize, symmetry, xyCoord);
  return xyCoordToJaCoord(newXyCoord);
}

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
