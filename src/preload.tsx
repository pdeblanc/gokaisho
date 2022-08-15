import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import MiaiValueQuiz from "./miai_value_quiz";
import { loadMiaiValueSgfs } from "./library";
import { KataGo, query } from "./katago";

declare global {
    interface Window { main: any; }
}

window.main = async function() {
  // load problems
  const katago = new KataGo();
  const problems = await loadMiaiValueSgfs();
  createRoot(document.getElementById("react-root")).render(
    <MiaiValueQuiz problems={problems} katago={katago} />
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
