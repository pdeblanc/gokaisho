import React, { Component } from 'react';
import ReactDOM from 'react-dom';

declare global {
    interface Window { do_stuff: any; }
}


window.do_stuff = function() {
  ReactDOM.render(
    <h1>Test</h1>,
    document.getElementById("react-root")
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
