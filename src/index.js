import "normalize.css/normalize.css";

import Split from "split.js";

import * as monaco from "monaco-editor";
import { extractImages, preprocess } from "./preprocessor";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function render(value) {
  const dot = preprocess(value);
  const graphviz = d3.select("#canvas").graphviz();
  for (const url of extractImages(dot)) {
    graphviz.addImage(url, "128px", "128px");
  }
  graphviz.renderDot(dot);
}

function save(value) {
  localStorage.setItem("saved", value);
}

window.onload = function () {
  const saved = localStorage.getItem("saved");

  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: saved || "",
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
  });

  Split(["#editor", "#canvas"], {
    elementStyle: (_, size, gutterSize) => ({
      "flex-basis": "calc(" + size + "% - " + gutterSize + "px)",
    }),
    gutterStyle: (_, gutterSize) => ({
      "flex-basis": gutterSize + "px",
    }),
    gutter: () => {
      const div = document.createElement("div");
      div.id = "gutter";
      return div;
    },
  });

  editor.onKeyUp(
    debounce(() => {
      const value = editor.getValue();
      render(value);
      save(value);
    }, 800)
  );

  render(saved);
};
