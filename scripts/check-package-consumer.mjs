import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const requestedTarball = process.argv[2];
if (!requestedTarball) {
  throw new Error("Usage: node scripts/check-package-consumer.mjs <tarball>");
}

const repository = resolve(fileURLToPath(new URL("..", import.meta.url)));
const tarball = isAbsolute(requestedTarball)
  ? requestedTarball
  : resolve(requestedTarball);
const consumer = mkdtempSync(join(tmpdir(), "angularcss-consumer-"));

try {
  writeFileSync(
    join(consumer, "package.json"),
    `${JSON.stringify({ name: "angularcss-release-consumer", private: true, type: "module" }, null, 2)}\n`,
  );
  run("npm", [
    "install",
    tarball,
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
  ]);

  run(process.execPath, [
    "--input-type=module",
    "--eval",
    `
      const packageModule = await import("@angular-wave/angular.css");
      if (packageModule.angularCssModuleName !== "angular.css") {
        throw new Error("Unexpected AngularCSS module name");
      }
      const css = import.meta.resolve("@angular-wave/angular.css/angular.css");
      if (!css.endsWith("/dist/angular.css")) {
        throw new Error(\`Unexpected CSS export: \${css}\`);
      }
      const tokens = import.meta.resolve(
        "@angular-wave/angular.css/customization-tokens",
      );
      if (!tokens.endsWith("/tokens/angularcss.resolver.json")) {
        throw new Error(\`Unexpected customization token export: \${tokens}\`);
      }
    `,
  ]);

  writeFileSync(
    join(consumer, "consumer.ts"),
    `import {
  angularCssModuleName,
  registerAngularCss,
  type AngularCssCustomEvent,
} from "@angular-wave/angular.css";

const event: AngularCssCustomEvent<"ng:combobox-select"> | undefined =
  undefined;
void [angularCssModuleName, registerAngularCss, event];
`,
  );
  writeFileSync(
    join(consumer, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          lib: ["DOM", "ES2023"],
          module: "NodeNext",
          moduleResolution: "NodeNext",
          noEmit: true,
          strict: true,
          target: "ES2023",
        },
        files: ["consumer.ts"],
      },
      null,
      2,
    )}\n`,
  );
  run(join(repository, "node_modules", ".bin", "tsc"), ["-p", "tsconfig.json"]);

  const customization = `:root {
  --font-sans: Inter, system-ui, sans-serif;
  --spacing: 0.25rem;
  --radius: 0.5rem;
  --input: #9aa4b2;
  --size-control-md: 2.25rem;
  --sidebar: #f5f7fa;
  --sidebar-foreground: #172033;
  --popover: #ffffff;
  --popover-foreground: #172033;
  --shadow-lg: 0 1rem 2rem rgb(23 32 51 / 16%);
  --border: #d4d9e2;
  --muted: #eef1f5;
  --muted-foreground: #536078;
}

[data-density="compact"] {
  --spacing: 0.2rem;
  --size-control-md: 2rem;
}

.operations-area {
  --primary: #174ea6;
  --primary-foreground: #ffffff;
}
`;
  writeFileSync(join(consumer, "customization.css"), customization);
  writeFileSync(
    join(consumer, "application.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Operations</title>
    <link rel="stylesheet" href="./node_modules/@angular-wave/angular.css/dist/angular.css" />
    <link rel="stylesheet" href="./customization.css" />
  </head>
  <body class="operations-area" data-density="compact">
    <form><label class="field">Search <input type="search" /></label></form>
    <aside ng-sidebar aria-label="Operations"><nav><a href="#jobs">Jobs</a></nav></aside>
    <div class="dialog"><dialog open><p>Review job</p></dialog></div>
    <section class="data-table"><figure><table><tbody><tr><td>Job 42</td></tr></tbody></table></figure></section>
  </body>
</html>
`,
  );

  const installed = JSON.parse(
    readFileSync(
      join(
        consumer,
        "node_modules",
        "@angular-wave",
        "angular.css",
        "package.json",
      ),
      "utf8",
    ),
  );
  const resolver = JSON.parse(
    readFileSync(
      join(
        consumer,
        "node_modules",
        "@angular-wave",
        "angular.css",
        "tokens",
        "angularcss.resolver.json",
      ),
      "utf8",
    ),
  );
  if (
    resolver.version !== "2025.10" ||
    !resolver.description?.includes("not a product design system")
  ) {
    throw new Error("Unexpected AngularCSS customization token contract");
  }

  const installedCss = readFileSync(
    join(
      consumer,
      "node_modules",
      "@angular-wave",
      "angular.css",
      "dist",
      "angular.css",
    ),
    "utf8",
  );
  const customizedVariables = [
    ...customization.matchAll(/--([a-z0-9-]+)\s*:/g),
  ].map((match) => `--${match[1]}`);
  const unsupportedVariables = customizedVariables.filter(
    (variable) => !installedCss.includes(`${variable}:`),
  );
  if (unsupportedVariables.length > 0) {
    throw new Error(
      `Consumer customizes unknown variables: ${unsupportedVariables.join(", ")}`,
    );
  }
  if (/--tw-|@apply|@theme|@tailwind/.test(customization + installedCss)) {
    throw new Error("Clean consumer customization unexpectedly requires Tailwind");
  }
  const application = readFileSync(join(consumer, "application.html"), "utf8");
  for (const contract of [
    'class="field"',
    "ng-sidebar",
    'class="dialog"',
    'class="data-table"',
  ]) {
    if (!application.includes(contract)) {
      throw new Error(`Clean consumer is missing ${contract}`);
    }
  }
  console.log(
    `Clean consumer accepted ${installed.name}@${installed.version}, its exports, and token-only form, navigation, overlay, and data-view customization.`,
  );
} finally {
  rmSync(consumer, { force: true, recursive: true });
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: consumer,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} exited with status ${result.status}`);
  }
}
