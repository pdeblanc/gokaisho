import { ipcRenderer } from "electron";
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import MiaiValueQuiz from "./activities/miai_value_quiz";
import Root from "./activities/preferences";
import { loadMiaiValueSgfs } from "./library";
import { KataGoProcess, KataGoIpcClient } from "./katago";
import { getAnalysisConfigPath } from "./paths";

declare global {
    interface Window { main: any; }
}

window.main = async function() {
  ipcRenderer.invoke("get-user-data-path").then(
    result => console.log("GUDP", result)
  );

  // load problems
  const problems = await loadMiaiValueSgfs();
  const analysisConfigPath = await getAnalysisConfigPath();
  const katago = new KataGoProcess(analysisConfigPath);
  createRoot(document.getElementById("react-root")).render(
    <Root />
  );
  // <MiaiValueQuiz problems={problems} katago={katago} />
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
