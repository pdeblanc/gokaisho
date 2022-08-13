// TODO:
// Should I have a Position inside of a Situation?
// Should ko intersections specify which player is not allowed to go there?
// Should I use strings for coordinates? That would simplify maps and sets.

import {
  jaCoordToXyCoord,
  xyCoordToJaCoord,
  transformJaCoord,
  transformXyCoord,
} from "./coord";
import { JaCoord, XyCoord, Symmetry, symmetries } from "./types";

export interface SgfMove {
  player: "B" | "W";
  coords: string;
}

const sgfAlphabet = "abcdefghijklmnopqrs";

export type Color = "black" | "white" | "empty";
export type PlayerColor = "black" | "white";

export type Move = {
  player: PlayerColor,
  value: JaCoord | "pass"
}

export function transformMove(
  boardSize: BoardSize,
  symmetry: Symmetry,
  move: Move
): Move {
  const {player, value} = move;
  if (value === "pass") return move;
  return {
    player,
    value: transformJaCoord(boardSize, symmetry, value)
  };
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
  const value = coords === "" ? "pass" : xyCoordToJaCoord({
    x: sgfAlphabet.indexOf(coords[0]),
    y: sgfAlphabet.indexOf(coords[1]),
  });
  return {player, value};
}

const oppositeColor = (color: Color): Color => {
  if (color == "black") return "white";
  if (color == "white") return "black";
  return "empty";
};

export class BaseSituation {
  size: BoardSize;
  intersections: Array<Array<Color>>;
  turn: Color;
  ko: JaCoord | null;

  constructor(
    size: BoardSize,
    intersections: Array<Array<Color>>,
    turn: Color,
    ko: JaCoord | null
  ) {
    this.size = size;
    this.intersections = intersections;
    this.turn = turn;
    this.ko = ko;
  }

  get(coord: JaCoord): Color {
    const {x, y} = jaCoordToXyCoord(coord);
    return this.intersections[y][x];
  }

  vertices(): Array<JaCoord> {
    const result: Array<JaCoord> = [];
    const {w, h} = this.size;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
	result.push(xyCoordToJaCoord({x, y}));
      }
    }
    return result;
  }

  blackStones(): Array<JaCoord> {
    return this.vertices().filter(coord => this.get(coord) === "black");
  }

  whiteStones(): Array<JaCoord> {
    return this.vertices().filter(coord => this.get(coord) === "white");
  }

  neighbors(coord: JaCoord): Array<JaCoord> {
    const {x, y} = jaCoordToXyCoord(coord);
    const {w, h} = this.size;
    return [
      {x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}
    ].filter(c => c.x >= 0 && c.y >= 0 && c.x < w && c.y < h).map(xyCoordToJaCoord);
  }

  group(coord: JaCoord): Set<JaCoord> {
    const color = this.get(coord);
    const queue: Array<JaCoord> = [coord];
    const result: Set<JaCoord> = new Set([coord]);
    while (queue.length) {
      for (const nb of this.neighbors(queue.pop())) {
	if (!result.has(nb) && this.get(nb) === color) {
	  result.add(nb);
	  queue.push(nb);
	}
      }
    }
    return result;
  }

  liberties(group: Set<JaCoord>): Set<JaCoord> {
    const result: Set<JaCoord> = new Set();
    group.forEach(stone => this.neighbors(stone).forEach(nb => this.get(nb) === "empty" && result.add(nb)));
    return result;
  }
}

export class ImmutableSituation extends BaseSituation {
  transform(symmetry: Symmetry): ImmutableSituation {
    const {flip, rotate} = symmetries[symmetry];
    const size = rotate % 2 ? {w: this.size.h, h: this.size.w} : this.size;
    const intersections = gameStart(size).intersections;
    for (let v = 0; v < size.h; v++) {
      for (let u = 0; u < size.w; u++) {
	const {x, y} = transformXyCoord(this.size, symmetry, {x: u, y: v});
	intersections[y][x] = this.intersections[v][u];
      }
    }
    const ko = this.ko === null ? null : transformJaCoord(
      this.size, symmetry, this.ko
    );
    return new ImmutableSituation(size, intersections, this.turn, ko);
  }
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

  set(coord: JaCoord, color: Color) {
    const {x, y} = jaCoordToXyCoord(coord);
    this.intersections[y][x] = color;
  }

  captureGroup(stones: Set<JaCoord>) {
    stones.forEach(stone => this.set(stone, "empty"));
  }

  playMove(move: Move): Array<JaCoord> {
    // return captures
    const {player, value} = move;
    if (value === "pass") {
      this.turn = oppositeColor(player);
      this.ko = null;
    } else {
      return this.playStone(value, player);
    }
  }

  playStone(coord: JaCoord, color: Color): Array<JaCoord> {
    // return captures
    const opponent = oppositeColor(color);
    // TODO: check empty and not ko
    this.set(coord, color);
    // Remove ko restriction
    this.ko = null;
    // Capture opponent stones
    const captures: Set<JaCoord> = new Set();
    for (const nb of this.neighbors(coord)) {
      if (this.get(nb) == opponent) {
	const opponentGroup: Set<JaCoord> = this.group(nb);
	if (!this.liberties(opponentGroup).size) {
	  opponentGroup.forEach(stone => captures.add(stone));
	  this.captureGroup(opponentGroup);
	}
      }
    }
    // Check for suicide
    const group = this.group(coord);
    const liberties = this.liberties(group);
    if (!liberties.size) {
      this.captureGroup(group);  // TODO: forbid suicide in some rule sets
    }
    // Check for simple ko
    if (
      group.size === 1 &&
      liberties.size === 1 &&
      captures.size === 1
    ) {
      liberties.forEach
      this.ko = liberties.values().next().value;
    }
    // Set turn state
    this.turn = opponent;
    return Array.from(captures);
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
