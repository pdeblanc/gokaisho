export type Color = "black" | "white" | "empty";

export type Coord = {x: number, y: number};

export type BoardSize = {w: number, h: number};

export class MutableSituation {
  size: BoardSize;
  intersections: Array<Array<Color>>;
  turn: Color;
  ko: Coord | null;

  constructor(
    size: BoardSize,
    intersections: Array<Array<Color>>,
    turn: Color,
    ko: Coord | null
  ) {
    this.size = size;
    this.intersections = intersections;
    this.turn = turn;
    this.ko = ko;
  }

  get(coord: Coord): Color {
    return this.intersections[coord.y][coord.x];
  }
}

export const emptyBoard = (size: BoardSize): MutableSituation => {
  const intersections: Array<Array<Color>> = [];
  for (let y = 0; y < size.h; y++) {
    const newRow: Array<Color> = []
    intersections.push(newRow);
    for (let x = 0; x < size.w; x++) {
      newRow.push("empty");
    }
  }
  return new MutableSituation(size, intersections, "black", null);
}
