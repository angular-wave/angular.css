import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

export default defineConfig({
  tokens: ["./tokens/angularcss.resolver.json"],
  outDir: "./src/styles/generated",
  plugins: [
    css({
      filename: "tokens.css",
      legacyHex: true,
      permutations: [
        {
          input: { "color-mode": "light" },
          prepare: (contents) => `:root,\n.light {\n${contents}}\n`,
        },
        {
          input: { "color-mode": "dark" },
          prepare: (contents) => `.dark {\n${contents}}\n`,
        },
      ],
      transform: (token) =>
        token.id === "typography.leading.sm" ? "calc(1.25 / 0.875)" : undefined,
      variableName: ({ id }) => `--${customizationVariable(id)}`,
    }),
  ],
});

function customizationVariable(id) {
  const parts = id.split(".");

  if (parts[0] === "palette") return parts.slice(1).join("-");
  if (parts[0] === "color") {
    if (parts[1] === "chart") return `chart-${parts[2]}`;
    if (parts[1] === "sidebar") {
      return parts[2] === "background"
        ? "sidebar"
        : `sidebar-${parts.slice(2).join("-")}`;
    }
    return parts.slice(1).join("-");
  }
  if (id === "spacing.unit") return "spacing";
  if (parts[0] === "spacing") return `space-${parts.slice(1).join("-")}`;
  if (parts[0] === "typography") {
    const [, category, ...name] = parts;
    if (category === "family") return `font-${name.join("-")}`;
    if (category === "size") return `text-${name.join("-")}`;
    if (category === "weight") return `font-weight-${name.join("-")}`;
    if (category === "leading") return `leading-${name.join("-")}`;
  }
  if (parts[0] === "shadow") return `shadow-${parts.slice(1).join("-")}`;
  if (parts[0] === "radius") {
    return parts[1] === "base" ? "radius" : `radius-${parts[1]}`;
  }
  if (parts[0] === "size") return `size-${parts.slice(1).join("-")}`;
  if (parts[0] === "border") return `border-width-${parts.slice(1).join("-")}`;
  if (parts[0] === "focus") return `focus-ring-${parts.slice(1).join("-")}`;
  if (parts[0] === "motion") return `motion-${parts.slice(1).join("-")}`;

  throw new Error(`No CSS customization variable mapping for ${id}`);
}
