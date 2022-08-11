import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import Goban from "./goban/goban";
import { loadMiaiValueSgfs } from "./library";
import { randomSymmetry, transformJaCoord } from "./coord";
import { transformMove } from "./go";

declare global {
    interface Window { main: any; }
}

window.main = async function() {
  // load a file
  const problems = await loadMiaiValueSgfs();
  // choose example
  const example = problems[Math.floor(Math.random() * problems.length)];
  // choose rotation
  const symmetry = randomSymmetry();
  // rotate example
  const rotatedExample = {
    board: example.board.transform(symmetry),
    captures: example.captures.map(
      stone => transformJaCoord(example.board.size, symmetry, stone)
    ),
    miaiValue: example.miaiValue,
    move: transformMove(example.board.size, symmetry, example.move),
    moveNo: example.moveNo,
    path: example.path,
    symmetry,
  }
  console.log(rotatedExample);
  createRoot(document.getElementById("react-root")).render(
    <Goban
      board={rotatedExample.board}
      lastMove={rotatedExample.move}
      justCaptured={rotatedExample.captures}
    />
  );
};

"use strict";
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: any, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };
    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type]);
    }
});
