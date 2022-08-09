// TODO:
// Should I have a Position inside of a Situation?
// Should ko intersections specify which player is not allowed to go there?
// Should I use strings for coordinates? That would simplify maps and sets.

export type Color = "black" | "white" | "empty";

export type Coord = {x: number, y: number};

export type Move = Coord | "pass";

export type BoardSize = {w: number, h: number};

const coordKey = (coord: Coord): string => `${coord.x}-${coord.y}`;

const oppositeColor = (color: Color): Color => {
  if (color == "black") return "white";
  if (color == "white") return "black";
  return "empty";
};

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

  vertices(): Array<Coord> {
    const result: Array<Coord> = [];
    const {w, h} = this.size;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
	result.push({x, y});
      }
    }
    return result;
  }

  blackStones(): Array<Coord> {
    return this.vertices().filter(coord => this.get(coord) === "black");
  }

  whiteStones(): Array<Coord> {
    return this.vertices().filter(coord => this.get(coord) === "white");
  }

  set(coord: Coord, color: Color) {
    this.intersections[coord.y][coord.x] = color;
  }

  neighbors(coord: Coord): Array<Coord> {
    const {x, y} = coord;
    const {w, h} = this.size;
    return [
      {x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}
    ].filter(c => c.x >= 0 && c.y >= 0 && c.x < w && c.y < h);
  }

  group(coord: Coord): Array<Coord> {
    const color = this.get(coord);
    const keys: Set<string> = new Set([coordKey(coord)]);
    const queue: Array<Coord> = [coord];
    const result: Array<Coord> = [coord];
    while (queue.length) {
      for (const nb of this.neighbors(queue.pop())) {
	const nbKey = coordKey(nb);
	if (!keys.has(nbKey) && this.get(nb) === color) {
	  result.push(nb);
	  queue.push(nb);
	  keys.add(nbKey);
	}
      }
    }
    return result;
  }

  liberties(group: Array<Coord>): Array<Coord> {
    const keys: Set<string> = new Set();
    const result: Array<Coord> = [];
    for (const stone of group) {
      for (const nb of this.neighbors(stone)) {
	const nbKey = coordKey(nb);
	if (!keys.has(nbKey) && this.get(nb) === "empty") {
	  result.push(nb);
	  keys.add(nbKey);
	}
      }
    }
    return result;
  }

  captureGroup(stones: Array<Coord>) {
      for (const capturedStone of stones) {
	this.set(capturedStone, "empty");
      }
  }

  playStone(coord: Coord, color: Color) {
    const opponent = oppositeColor(color);
    // TODO: check empty and not ko
    this.set(coord, color);
    // Remove ko restriction
    this.ko = null;
    // Capture opponent stones
    const captures: Array<Coord> = [];
    for (const nb of this.neighbors(coord)) {
      if (this.get(nb) == opponent) {
	const opponentGroup: Array<Coord> = this.group(nb);
	if (!this.liberties(opponentGroup).length) {
	  captures.concat(opponentGroup);
	}
	this.captureGroup(opponentGroup);
      }
    }
    // Check for suicide
    const group = this.group(coord);
    const liberties = this.liberties(group);
    if (!liberties.length) {
      this.captureGroup(group);  // TODO: forbid suicide in some rule sets
    }
    // Check for simple ko
    if (
      group.length === 1 &&
      liberties.length === 1 &&
      captures.length === 1
    ) {
      this.ko = liberties[0];
    }
    // Set turn state
    this.turn = opponent;
  }
}

export const gameStart = (size: BoardSize): MutableSituation => {
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
