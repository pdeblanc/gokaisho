import { JaCoord, KanjiNumber, XyCoord, kanjiNumbers } from "./types";

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
