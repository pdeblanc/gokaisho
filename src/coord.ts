// zero-indexed
export type xyCoord = {x: number, y: number};

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

type kanjiNumber = typeof kanjiNumbers[number];

export type JaCoord = `${number}の${kanjiNumber}`;

function jaCoordToXyCoord(jaCoord: JaCoord): xyCoord {
  const parts = jaCoord.split("の");
  const x = parseInt(parts[0]) - 1;
  const yKanji = parts[1] as kanjiNumber;
  const y = kanjiNumbers.indexOf(yKanji) - 1;
  return {x, y};
}
