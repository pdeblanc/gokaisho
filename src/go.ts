// TODO:
// Should I have a Position inside of a Situation?
// Should ko intersections specify which player is not allowed to go there?
// Should I use strings for coordinates? That would simplify maps and sets.

import { XyCoord } from "./coord";

export interface SgfMove {
  player: "B" | "W";
  coords: string;
}

const sgfAlphabet = "abcdefghijklmnopqrs";

export type Color = "black" | "white" | "empty";
export type PlayerColor = "black" | "white";

export type Move = {
  player: PlayerColor,
  value: XyCoord | "pass"
}

export type BoardSize = {w: number, h: number};

const parseSgfColor = (sgfColor: string): PlayerColor => {
  if (sgfColor === "B") return "black";
  if (sgfColor === "W") return "white";
  throw new Error(`Invalid SGF color "${sgfColor}"`);
}

export const sgfMoveToMove = (sgfMove: SgfMove): Move => {
  const {coords} = sgfMove;
  const player = parseSgfColor(sgfMove.player);
  const value = coords === "" ? "pass" : {
    x: sgfAlphabet.indexOf(coords[0]),
    y: sgfAlphabet.indexOf(coords[1]),
  };
  return {player, value};
}

const coordKey = (coord: XyCoord): string => `${coord.x}-${coord.y}`;

const oppositeColor = (color: Color): Color => {
  if (color == "black") return "white";
  if (color == "white") return "black";
  return "empty";
};

export class BaseSituation {
  size: BoardSize;
  intersections: Array<Array<Color>>;
  turn: Color;
  ko: XyCoord | null;

  constructor(
    size: BoardSize,
    intersections: Array<Array<Color>>,
    turn: Color,
    ko: XyCoord | null
  ) {
    this.size = size;
    this.intersections = intersections;
    this.turn = turn;
    this.ko = ko;
  }

  get(coord: XyCoord): Color {
    return this.intersections[coord.y][coord.x];
  }

  vertices(): Array<XyCoord> {
    const result: Array<XyCoord> = [];
    const {w, h} = this.size;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
	result.push({x, y});
      }
    }
    return result;
  }

  blackStones(): Array<XyCoord> {
    return this.vertices().filter(coord => this.get(coord) === "black");
  }

  whiteStones(): Array<XyCoord> {
    return this.vertices().filter(coord => this.get(coord) === "white");
  }

  neighbors(coord: XyCoord): Array<XyCoord> {
    const {x, y} = coord;
    const {w, h} = this.size;
    return [
      {x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}
    ].filter(c => c.x >= 0 && c.y >= 0 && c.x < w && c.y < h);
  }

  group(coord: XyCoord): Array<XyCoord> {
    const color = this.get(coord);
    const keys: Set<string> = new Set([coordKey(coord)]);
    const queue: Array<XyCoord> = [coord];
    const result: Array<XyCoord> = [coord];
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

  liberties(group: Array<XyCoord>): Array<XyCoord> {
    const keys: Set<string> = new Set();
    const result: Array<XyCoord> = [];
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
}

export class ImmutableSituation extends BaseSituation {
};

export class MutableSituation extends BaseSituation {
  freeze(): ImmutableSituation {
    return new ImmutableSituation(
      this.size,
      this.intersections.map(row => [...row]),
      this.turn,
      this.ko,
    );
  }

  set(coord: XyCoord, color: Color) {
    this.intersections[coord.y][coord.x] = color;
  }

  captureGroup(stones: Array<XyCoord>) {
      for (const capturedStone of stones) {
	this.set(capturedStone, "empty");
      }
  }

  playMove(move: Move): Array<XyCoord> {
    // return captures
    const {player, value} = move;
    if (value === "pass") {
      this.turn = oppositeColor(player);
      this.ko = null;
    } else {
      return this.playStone(value, player);
    }
  }

  playStone(coord: XyCoord, color: Color): Array<XyCoord> {
    // return captures
    const opponent = oppositeColor(color);
    // TODO: check empty and not ko
    this.set(coord, color);
    // Remove ko restriction
    this.ko = null;
    // Capture opponent stones
    const captures: Array<XyCoord> = [];
    for (const nb of this.neighbors(coord)) {
      if (this.get(nb) == opponent) {
	const opponentGroup: Array<XyCoord> = this.group(nb);
	if (!this.liberties(opponentGroup).length) {
	  captures.push(...opponentGroup);
	  this.captureGroup(opponentGroup);
	}
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
    return captures;
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
