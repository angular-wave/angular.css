import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = resolve(fileURLToPath(new URL("..", import.meta.url)));
const tokenFile = resolve(
  repository,
  "tokens/foundation/angularcss.tokens.json",
);
const resolverFile = resolve(repository, "tokens/angularcss.resolver.json");
const generatedFile = resolve(repository, "src/styles/generated/tokens.css");
const terrazzoCli = resolve(
  repository,
  "node_modules/@terrazzo/cli/bin/cli.js",
);

runTerrazzo("check");

const tokens = readJson(tokenFile);
const resolver = readJson(resolverFile);
const requiredGroups = [
  "color",
  "spacing",
  "typography",
  "shadow",
  "radius",
  "size",
  "border",
  "focus",
  "motion",
];
const missingGroups = requiredGroups.filter((group) => !tokens[group]);

if (missingGroups.length > 0) {
  throw new Error(
    `Customization token source is missing groups: ${missingGroups.join(", ")}`,
  );
}
if (resolver.version !== "2025.10") {
  throw new Error("Customization resolver must target DTCG 2025.10");
}
if (!resolver.description?.includes("not a product design system")) {
  throw new Error(
    "Customization resolver must distinguish AngularCSS from a design system",
  );
}

const generatedBefore = readFileSync(generatedFile, "utf8");
runTerrazzo("build");
const generatedAfter = readFileSync(generatedFile, "utf8");

if (generatedAfter !== generatedBefore) {
  writeFileSync(generatedFile, generatedBefore);
  throw new Error(
    "Generated customization tokens are stale; run npm run tokens:build",
  );
}

if (/\.(?:dark|light)-theme\b/.test(generatedBefore)) {
  throw new Error(
    "Generated customization CSS must expose only the concise .light and .dark context selectors",
  );
}

for (const variable of [
  "--background",
  "--spacing",
  "--font-weight-medium",
  "--leading-sm",
  "--shadow-md",
  "--radius",
  "--overlay",
  "--size-control-md",
  "--focus-ring-width",
  "--motion-duration-default",
]) {
  if (!generatedBefore.includes(`${variable}:`)) {
    throw new Error(`Generated CSS is missing ${variable}`);
  }
}

const authoredSources = cssFiles(resolve(repository, "src")).filter(
  (filename) =>
    filename !== resolve(repository, "src/preflight.css") &&
    !filename.startsWith(resolve(repository, "src/styles/generated")),
);
const componentSources = authoredSources.filter(
  (filename) => filename !== resolve(repository, "src/styles/context.css"),
);
const tailwindPattern = /@(?:apply|custom-variant|theme)\b|tailwindcss|--tw-/;
const coupledSources = authoredSources.filter((filename) =>
  tailwindPattern.test(readFileSync(filename, "utf8")),
);

if (coupledSources.length > 0) {
  throw new Error(
    `CSS source retains Tailwind coupling:\n${coupledSources
      .map((filename) => `- ${filename.slice(repository.length + 1)}`)
      .join("\n")}`,
  );
}

const driftPatterns = [
  {
    description: "hard-coded font size",
    pattern: /font-size:\s*(?:\d*\.)?\d+(?:px|rem)\b/,
  },
  {
    description: "hard-coded line height",
    pattern: /line-height:\s*(?:\d*\.)?\d+(?:px|rem)?\b/,
  },
  {
    description: "hard-coded elevation shadow",
    pattern: /box-shadow:\s*0\s+(?!0\b)-?\d+(?:\.\d+)?px\b/,
  },
  {
    description: "derived radius instead of a radius token",
    pattern: /calc\(var\(--radius\)\s*[-+*/]/,
  },
  {
    description: "hard-coded nonzero radius",
    pattern: /border-radius:\s*(?:\d*\.)?\d+(?:px|rem)\b/,
  },
  {
    description: "hard-coded fully rounded radius",
    pattern: /\b9999?px\b/,
  },
  {
    description: "hard-coded focus-ring width",
    pattern:
      /0 0 0 (?:2|3)px\s+(?:color-mix|var\(--ring\))|outline:\s*(?:2|3)px\s+solid\s+var\(--ring\)/,
  },
  {
    description: "hard-coded default border width",
    pattern:
      /\b(?:border|border-(?:top|right|bottom|left|block(?:-start|-end)?|inline(?:-start|-end)?)):\s*1px\s+(?:solid|dashed|dotted|double)\b/,
  },
  {
    description: "hard-coded shared interaction duration",
    pattern:
      /(?<![\w-])(?:0s|0ms|80ms|90ms|100ms|120ms|140ms|150ms|160ms|180ms|200ms|300ms)\b/,
  },
];
const customizationDrift = authoredSources.flatMap((filename) => {
  const source = readFileSync(filename, "utf8");
  return driftPatterns
    .filter(({ pattern }) => pattern.test(source))
    .map(
      ({ description }) =>
        `${filename.slice(repository.length + 1)}: ${description}`,
    );
});

const hardCodedColors = componentSources.filter((filename) =>
  /(?:background(?:-color)?|border(?:-color)?|color):\s*(?:#[0-9a-f]{3,8}\b|(?:rgb|hsl)a?\(|(?:black|white)\b)/i.test(
    readFileSync(filename, "utf8"),
  ),
);
if (hardCodedColors.length > 0) {
  throw new Error(
    `CSS source bypasses shared color tokens:\n${hardCodedColors
      .map((filename) => `- ${filename.slice(repository.length + 1)}`)
      .join("\n")}`,
  );
}

if (customizationDrift.length > 0) {
  throw new Error(
    `CSS source bypasses shared customization tokens:\n${customizationDrift
      .map((failure) => `- ${failure}`)
      .join("\n")}`,
  );
}

console.log(
  "DTCG 2025.10 customization tokens are valid, current, adopted, and Tailwind-independent.",
);

function runTerrazzo(command) {
  const result = spawnSync(
    process.execPath,
    [terrazzoCli, command, "--config", "terrazzo.config.js", "--silent"],
    { cwd: repository, encoding: "utf8" },
  );

  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`Terrazzo ${command} exited with status ${result.status}`);
  }
}

function readJson(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function cssFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const filename = resolve(directory, entry);
    if (statSync(filename).isDirectory()) return cssFiles(filename);
    return filename.endsWith(".css") ? [filename] : [];
  });
}
