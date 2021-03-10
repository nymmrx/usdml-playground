import "normalize.css/normalize.css";

import Split from "split.js";

import * as monaco from "monaco-editor";
import { extractImages, preprocess } from "./preprocessor";
import { monarch } from "./dot.monarch";

const defaultSource = `// Inspired by https://i.imgur.com/giRJijl.jpg by https://twitter.com/gabrielhaines

digraph strategy {
	node[shape=none, fontname="sans-serif"];

	node[group=tokens, height=1.35, imagepos="tc", labelloc="b"]
	SUSHI[token="0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", label="SUSHI"];
	YFI[token="0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", label="YFI"];
	ETH[token="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", label="ETH"];
	ETHYFI[token="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", height=1.6, label="ETH/YFI\\nSLP"];
	YFI_VAULT[token="0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", label="yVault"];
	SUSHI2[token="0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", label="SUSHI"];
	XSUSHI[token="0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", label="xSUSHI"];


	node[group=descriptions, height=1, labelloc="c"];
	sushi_desc[label="ETH is paired with YFI\\nand deposited into sushiswap\\nto provide liquidity"];
	{rank = same; sushi_desc; SUSHI;}
	eth_desc[label="ETH / YFI SLP token is\\n deposited into a yearn vault"];
	eth_desc -> ETHYFI [style=invis];
	{rank = same; eth_desc; YFI_VAULT;}
	xsushi_desc[label="SUSHI token is generated and\\nstaked in xSUSHI to generate\\nsushiswap protocol fees"];
	{rank = same; xsushi_desc; XSUSHI;}

	subgraph connections {
		YFI -> SUSHI;
		ETH -> SUSHI;
		SUSHI -> ETHYFI;
		ETHYFI -> YFI_VAULT
		YFI_VAULT -> SUSHI2;
		SUSHI2 -> XSUSHI;
		XSUSHI -> SUSHI2;
	}
}
`;

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
  graphviz.dot(dot).render();
}

function reset() {
  localStorage.removeItem("saved");
}

function save(value) {
  localStorage.setItem("saved", value);
}

window.onload = function () {
  const version = localStorage.getItem("version") || "";

  if (version !== process.env.VERSION) {
    reset();
    localStorage.setItem("version", process.env.VERSION);
  }

  const saved = localStorage.getItem("saved") || defaultSource;

  monaco.languages.register({ id: "dotlang" });
  monaco.languages.setMonarchTokensProvider("dotlang", monarch);
  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: saved,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    language: "dotlang",
    theme: "vs",
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
