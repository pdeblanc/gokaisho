import { readdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
const SgfParser = require('ts-sgf-parser').SgfParser;
import { gameStart, sgfMoveToMove } from "./go";

// TODO: Make this more portable
const LIBRARY_ROOT = "/Users/peter/gokaisho-local";
const MIAI_DIR = "miai_value_sgfs";
const ATTEMPTS_FILE = "attempts.jsonl";

function getComment(moveNode: any): string {
  const comments: Array<string> = [];
  const commentProps = moveNode.properties.filter(
    (prop: any) => prop.propName === "C"
  )
  for (const commentProp of commentProps) {
    comments.push(...commentProp.propValue);
  }
  return comments.join("\n");
}

function getMiaiValueFromComment(comment: string): number | null {
  const lines = comment.split("\n");
  for (const line of lines) {
    const parts = line.split(":");
    if (parts[0] === "Move value") {
      return parseFloat(parts[1]);
    }
  }
  return null;
}

export function saveAttempt(attempt: any) {
  const attemptFilePath = path.join(LIBRARY_ROOT, ATTEMPTS_FILE);
  const textEntry = JSON.stringify(attempt) + "\n";
  return appendFile(attemptFilePath, textEntry, "utf8");
}

async function loadAttempts() {
  const attemptFilePath = path.join(LIBRARY_ROOT, ATTEMPTS_FILE);
  const data = await readFile(attemptFilePath, "utf8");
  const lines = data.split("\n").map(line => line.trim()).filter(line => line);
  const entries = lines.map(line => JSON.parse(line));
  const attemptKeys: any = {};
  for (const entry of entries) {
    if (!attemptKeys[entry.path]) {
      attemptKeys[entry.path] = {};
    }
    attemptKeys[entry.path][entry.moveNo] = true;
  }
  return attemptKeys;
}

async function loadMiaiValuesFromFile(path: string) {
  const data = await readFile(path, "utf8");
  const board = gameStart({w: 19, h: 19});
  const parser = new SgfParser(data);
  const lines = parser.getMainLine();
  const mainLine = lines[0];
  const moveNodes = mainLine.nodes;
  const result = [];
  let leastValue = 14;
  for (let i = 0; i < moveNodes.length; i++) {
    const moveNode = moveNodes[i];
    const {move} = moveNode;
    if (!move) continue;
    const _move = sgfMoveToMove(move);
    const captures = board.playMove(_move);
    const comment = getComment(moveNode);
    const miaiValue = getMiaiValueFromComment(comment);
    if (miaiValue === null) continue;
    if (miaiValue >= leastValue) continue;
    if (miaiValue < 0) break;
    leastValue = miaiValue;
    result.push({
      path,
      moveNo: i,
      miaiValue,
      move: _move,
      board: board.freeze(),
      captures,
    });
  }
  return result;
}

export async function loadMiaiValueSgfs() {
  // list already attempted problems
  const attemptKeys = await loadAttempts();
  console.log("attempted", attemptKeys);
  const dirContents = await readdir(LIBRARY_ROOT);
  if (!dirContents.includes(MIAI_DIR)) {
    return [];
  }
  const sgfDir = path.join(LIBRARY_ROOT, MIAI_DIR);
  const sgfDirContents = await readdir(sgfDir);
  const sgfFileNames = sgfDirContents.filter(name => name.endsWith(".sgf"));
  const sgfFilePaths = sgfFileNames.map(name => path.join(sgfDir, name));
  const result = [];
  for (const results of await Promise.all(
    sgfFilePaths.map(loadMiaiValuesFromFile)
  )) {
    result.push(...results);
  }
  return result.filter(
    entry => !(attemptKeys[entry.path]) || !(attemptKeys[entry.path][entry.moveNo])
  );
}
