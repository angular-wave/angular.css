import { readFileSync } from "node:fs";

import selectorParser from "postcss-selector-parser";

const cssFiles = ["dist/angular.css"];
const reviewedNativeStyles = new Set([
  "button",
  "hr",
  "input",
  "kbd",
  "progress",
  "select",
  "table",
  "textarea",
]);
const guardedElements = new Set([
  "audio",
  "body",
  "button",
  "canvas",
  "html",
  "hr",
  "iframe",
  "img",
  "input",
  "kbd",
  "menu",
  "object",
  "ol",
  "progress",
  "select",
  "svg",
  "table",
  "textarea",
  "ul",
  "video",
]);

const extractSelectorBlocks = (css) =>
  css
    .split("{")
    .slice(0, -1)
    .map((chunk) => chunk.slice(chunk.lastIndexOf("}") + 1).trim())
    .filter((selector) => selector && !selector.startsWith("@"));

const failures = [];

for (const file of cssFiles) {
  const css = readFileSync(file, "utf8");

  for (const selectorText of extractSelectorBlocks(css)) {
    const selectors = selectorParser().astSync(selectorText);
    for (const selector of selectors.nodes) {
      const first = selector.nodes[0];
      if (first?.type !== "tag" || !guardedElements.has(first.value)) continue;
      if (reviewedNativeStyles.has(first.value)) continue;

      const compound = selector.nodes.slice(
        0,
        selector.nodes.findIndex((node) => node.type === "combinator") < 0
          ? undefined
          : selector.nodes.findIndex((node) => node.type === "combinator"),
      );
      const optedIn = compound.some(
        (node) =>
          node.type === "class" ||
          node.type === "attribute" ||
          (node.type === "pseudo" && node.value === ":has"),
      );
      if (!optedIn) {
        failures.push(`${file}: broad element selector "${selector}"`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("CSS isolation check passed.");
