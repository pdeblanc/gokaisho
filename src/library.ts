import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const SgfParser = require('ts-sgf-parser').SgfParser;
import { gameStart } from "./go";

// TODO: Make this more portable
const LIBRARY_ROOT = "/Users/peter/gokaisho-local";
const MIAI_DIR = "miai_value_sgfs";

async function loadMiaiValues(path: string) {
  const data = await readFile(path, "utf8");
  const board = gameStart({w: 19, h: 19});
  const parser = new SgfParser(data);
  const lines = parser.getMainLine();
  const mainLine = lines[0];
  const moveNodes = mainLine.nodes;
  return {path, moveNodes: moveNodes};
}

export async function loadMiaiValueSgfs() {
  const dirContents = await readdir(LIBRARY_ROOT);
  if (!dirContents.includes(MIAI_DIR)) {
    return [];
  }
  const sgfDir = path.join(LIBRARY_ROOT, MIAI_DIR);
  const sgfDirContents = await readdir(sgfDir);
  const sgfFileNames = sgfDirContents.filter(name => name.endsWith(".sgf"));
  const sgfFilePaths = sgfFileNames.map(name => path.join(sgfDir, name));
  return Promise.all(
    sgfFilePaths.map(loadMiaiValues)
  )
  return sgfFilePaths.map(path => ({
    path,

  }));
}
