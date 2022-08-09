import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import Goban from "./Goban";
import fs from "fs";
import { gameStart } from "./go";
const SgfParser = require('ts-sgf-parser').SgfParser;  // using import syntax raises error TS2309??

const SGF_PATH = "/Users/peter/repos/miai/game01__miai_values_tromp.sgf"

declare global {
    interface Window { main: any; }
}

window.main = function() {
  // load a file
  fs.readFile(SGF_PATH, "utf8", (err, data) => {
    console.log(SgfParser);
    const parser = new SgfParser(data);
    console.log(parser.getMainLine())
  });
  const board = gameStart({w: 19, h: 19});
  board.playStone({x: 16, y: 3}, "black");
  // render stuff
  createRoot(document.getElementById("react-root")).render(
    <Goban board={board} />,
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
