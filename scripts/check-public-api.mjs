import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const baselinePath = "contracts/public-api.json";
const write = process.argv.includes("--write");
const source = readFileSync("src/index.ts", "utf8");
const tokens = readFileSync("src/styles/generated/tokens.css", "utf8");
const contexts = readFileSync("src/styles/context.css", "utf8");

const unique = (values) =>
  [...new Set(values)].sort((left, right) => left.localeCompare(right));
const code = (value) =>
  unique([...value.matchAll(/`([^`]+)`/g)].map((match) => match[1]));
const tableKeys = (value) =>
  unique(
    value
      .split("\n")
      .map((line) => line.match(/^\|\s*`([^`]+)`\s*\|/)?.[1])
      .filter(Boolean),
  );
const section = (markdown, start, end) =>
  markdown.match(new RegExp(`${start}\\n\\n([\\s\\S]*?)\\n\\n${end}`))?.[1] ??
  "";

const entries = Object.fromEntries(
  catalogNames.map((name) => {
    const policy = catalogPolicy[name];
    const markdown = readFileSync(
      join("docs/content/docs", policy.category, `${name}.md`),
      "utf8",
    );
    const selectors = code(
      section(
        markdown,
        "### (?:Root styling selector|Directive selectors)",
        "### Semantic structure",
      ),
    );
    const attributes = tableKeys(
      section(
        markdown,
        "### Attributes and state",
        "### CSS custom properties",
      ),
    );
    const frameworkAttributes = attributes.filter(
      (attribute) => attribute.startsWith("ng-") || attribute === "data-change",
    );
    if (frameworkAttributes.length > 0) {
      throw new Error(
        `${name}: AngularTS application directives must not be published as AngularCSS component attributes: ${frameworkAttributes.join(", ")}`,
      );
    }
    const cssCustomProperties = tableKeys(
      section(markdown, "### CSS custom properties", "### DOM events"),
    ).filter((value) => value.startsWith("--"));
    const events = code(
      section(markdown, "### DOM events", "Native DOM events continue"),
    ).filter((value) => value.startsWith("angularcss:"));

    if (selectors.length === 0) {
      throw new Error(
        `${name}: generated documentation has no public selector`,
      );
    }

    return [
      name,
      {
        attributes,
        category: policy.category,
        cssCustomProperties,
        events,
        runtime: policy.runtime,
        selectors,
      },
    ];
  }),
);

const declarationExports = [
  ...source.matchAll(
    /export\s+(?:declare\s+)?(?:const|function|interface|type|class)\s+([A-Za-z_$][\w$]*)/g,
  ),
].map((match) => match[1]);
const listExports = [...source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)]
  .flatMap((match) => match[1].split(","))
  .map((name) =>
    name
      .trim()
      .split(/\s+as\s+/)
      .at(-1),
  )
  .filter(Boolean);

const actual = {
  version: 1,
  module: "angular.css",
  customization: {
    format: "2025.10",
    contexts: unique(
      [
        ...contexts.matchAll(
          /\[(data-(?:contrast|density|print))="([^"]+)"\]/g,
        ),
      ].map(([, attribute, value]) => `${attribute}=${value}`),
    ),
    variables: unique(
      [...tokens.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((match) => match[1]),
    ),
  },
  entries,
  javascript: {
    directives: unique(
      [...source.matchAll(/\["(ng[A-Za-z0-9]+)",\s*[A-Za-z0-9_$]+\]/g)].map(
        (match) => match[1],
      ),
    ),
    exports: unique([...declarationExports, ...listExports]),
  },
};
const serialized = `${JSON.stringify(actual, null, 2)}\n`;

if (write) {
  mkdirSync(dirname(baselinePath), { recursive: true });
  writeFileSync(baselinePath, serialized);
  console.log(`Wrote ${baselinePath} for ${catalogNames.length} entries.`);
  process.exit(0);
}

if (!existsSync(baselinePath)) {
  throw new Error(`Missing ${baselinePath}; run npm run update:public-api`);
}

const expected = readFileSync(baselinePath, "utf8");
if (expected !== serialized) {
  throw new Error(
    `Public API differs from ${baselinePath}; review the change, then run npm run update:public-api`,
  );
}

console.log(
  `Public API contract passed for ${catalogNames.length} entries, ${actual.javascript.directives.length} directives, ${actual.javascript.exports.length} JavaScript exports, and ${actual.customization.variables.length} customization variables.`,
);
