import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import Goban from "./Goban";

declare global {
    interface Window { main: any; }
}

window.main = function() {
  createRoot(document.getElementById("react-root")).render(
    <Goban />,
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
