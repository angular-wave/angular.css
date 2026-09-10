import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const roots = [
  "src",
  "docs/content",
  "docs/static/examples",
  "docs/tests",
  "examples",
  "scripts",
];
const rootFiles = ["CONTRIBUTING.md", "README.md", "index.html"];
const extensions = new Set([".css", ".html", ".js", ".md", ".mjs", ".ts"]);
const removedSlotAttribute = `data-${"slot"}`;
const removedInputAttribute = `data-${"input"}`;
const redundantPresentationDataAttributes = new Set([
  "active",
  "align",
  "border",
  "disabled",
  "empty",
  "icon",
  "invalid",
  "logical-align",
  "mobile",
  "open",
  "orientation",
  "required",
  "selected",
  "side",
  "size",
  "state",
  "variant",
  "visible",
]);
const componentNames = new Set<string>(catalogNames);
const elementNames = new Set(
  Object.entries(catalogPolicy)
    .filter(([, policy]) => !policy.runtime)
    .map(([name]) => name),
);
const componentPrefixes = [...componentNames].sort(
  (left, right) => right.length - left.length,
);
const rootAliases = new Set(["resizable-panel-group"]);
const redundantRuntimeRootClasses = new Set(
  Object.entries(catalogPolicy)
    .filter(([, policy]) => policy.runtime)
    .map(([name]) => (name === "resizable" ? "resizable-panel-group" : name)),
);
const redundantPartClasses = new Set([
  "accordion-content",
  "accordion",
  "accordion-demo",
  "accordion-item",
  "alert",
  "alert-action",
  "alert-action-demo",
  "alert-demo",
  "alert-description",
  "alert-dialog",
  "alert-dialog-action",
  "alert-dialog-cancel",
  "alert-dialog-content",
  "alert-dialog-demo",
  "alert-dialog-description",
  "alert-dialog-footer",
  "alert-dialog-header",
  "alert-dialog-media",
  "alert-dialog-title",
  "alert-dialog-trigger",
  "alert-icon",
  "alert-title",
  "alert-warning-demo",
  "aspect-ratio-landscape",
  "aspect-ratio",
  "aspect-ratio-image",
  "avatar-badge",
  "avatar-demo",
  "avatar-dropdown-demo",
  "avatar-fallback",
  "avatar-group",
  "avatar-group-count",
  "avatar-image",
  "breadcrumb-dropdown-example",
  "breadcrumb-ellipsis",
  "breadcrumb-item",
  "breadcrumb-link",
  "breadcrumb-list",
  "breadcrumb-menu-stage",
  "breadcrumb-page",
  "breadcrumb-plain-trigger",
  "breadcrumb-separator",
  "breadcrumb-workflow-output",
  "breadcrumb-workflow-section",
  "breadcrumb-workflow-wide",
  "breadcrumb-workflows",
  "button",
  "button-group",
  "button-group-canonical",
  "button-group-canonical-row",
  "button-group-separator",
  "button-group-size-stack",
  "button-group-text",
  "calendar-day",
  "calendar-grid",
  "calendar-header",
  "calendar-month",
  "calendar-month-grid",
  "calendar-month-select",
  "calendar-month-title",
  "calendar-nav",
  "calendar-next",
  "calendar-previous",
  "calendar-row",
  "calendar-title",
  "calendar-week-number",
  "calendar-week-number-header",
  "calendar-weekday",
  "calendar-year-select",
  "card-action",
  "card-content",
  "card-description",
  "card-footer",
  "card-header",
  "card-title",
  "carousel-canonical-stage",
  "carousel-content",
  "carousel-dot",
  "carousel-dots",
  "carousel-example-body",
  "carousel-item",
  "carousel-next",
  "carousel-previous",
  "carousel-track",
  "carousel-workflow-tall",
  "chart-axis",
  "chart-axis-item",
  "chart-bar",
  "chart-bar-group",
  "chart-bar-groups",
  "chart-bars",
  "chart-basic-demo",
  "chart-description",
  "chart-example-body",
  "chart-grid",
  "chart-header",
  "chart-legend",
  "chart-legend-item",
  "chart-plot",
  "chart-swatch",
  "chart-title",
  "chart-tooltip",
  "chart-tooltip-indicator",
  "chart-tooltip-item",
  "chart-tooltip-items",
  "chart-tooltip-label",
  "chart-tooltip-name",
  "chart-tooltip-value",
  "checkbox",
  "checkbox-demo",
  "checkbox-example-body",
  "combobox-chip",
  "combobox-chip-input",
  "combobox-chip-remove",
  "combobox-chips",
  "combobox-clear",
  "combobox-collection",
  "combobox-content",
  "combobox-control",
  "combobox-custom-composition",
  "combobox-demo",
  "combobox-empty",
  "combobox-group",
  "combobox-group-label",
  "combobox-groups-workflow",
  "combobox-input",
  "combobox-input-group-workflow",
  "combobox-item",
  "combobox-label",
  "combobox-list",
  "combobox-separator",
  "combobox-trigger",
  "combobox-value",
  "command-demo",
  "command-empty",
  "command-group",
  "command-group-heading",
  "command-input",
  "command-input-group",
  "command-input-icon",
  "command-input-wrapper",
  "command-item",
  "command-item-icon",
  "command-list",
  "command-rtl-demo",
  "command-separator",
  "command-shortcut",
  "component-state-workflows",
  "context-menu-checkbox-item",
  "context-menu-content",
  "context-menu-demo",
  "context-menu-group",
  "context-menu-item",
  "context-menu-label",
  "context-menu-radio-group",
  "context-menu-radio-item",
  "context-menu-rtl-demo",
  "context-menu-separator",
  "context-menu-shortcut",
  "context-menu-sub",
  "context-menu-sub-content",
  "context-menu-sub-trigger",
  "context-menu-trigger",
  "date-picker-dropdown-body",
  "date-picker-workflow-time",
  "dialog-body",
  "dialog-close",
  "dialog-content",
  "dialog-demo",
  "dialog-description",
  "dialog-footer",
  "dialog-form-row",
  "dialog-header",
  "dialog-overlay-probe",
  "dialog-profile-form",
  "dialog-title",
  "dialog-trigger",
  "description-list",
  "direction",
  "disclosure-composition-body",
  "disclosure-example-body",
  "drawer-body",
  "drawer-close",
  "drawer-content",
  "drawer-demo",
  "drawer-description",
  "drawer-footer",
  "drawer-goal-body",
  "drawer-goal-chart",
  "drawer-goal-chart-rtl",
  "drawer-goal-control",
  "drawer-goal-panel",
  "drawer-goal-value",
  "drawer-handle",
  "drawer-header",
  "drawer-title",
  "drawer-trigger",
  "dropdown-demo",
  "dropdown-example-body",
  "dropdown-menu-checkbox-item",
  "dropdown-menu-checkbox-item-indicator",
  "dropdown-menu-content",
  "dropdown-menu-group",
  "dropdown-menu-item",
  "dropdown-menu-label",
  "dropdown-menu-radio-group",
  "dropdown-menu-radio-item",
  "dropdown-menu-radio-item-indicator",
  "dropdown-menu-separator",
  "dropdown-menu-shortcut",
  "dropdown-menu-sub",
  "dropdown-menu-sub-content",
  "dropdown-menu-sub-trigger",
  "dropdown-menu-trigger",
  "empty-content",
  "empty-demo",
  "empty-description",
  "empty-header",
  "empty-icon",
  "empty-media",
  "empty-title",
  "example-card",
  "example-sr-only",
  "field-content",
  "field-description",
  "field-label",
  "field-legend",
  "field-separator",
  "field-separator-content",
  "field-title",
  "file-upload",
  "filter-bar",
  "hover-card-content",
  "hover-card-demo",
  "hover-card-description",
  "hover-card-example-body",
  "hover-card-title",
  "hover-card-trigger",
  "icon",
  "icon-sm",
  "icon-xs",
  "input",
  "input-fit",
  "input-group-addon",
  "input-group-button",
  "input-group-control",
  "input-group-input",
  "input-group-text",
  "input-group-workflow-body",
  "input-otp",
  "input-otp-composition-body",
  "input-otp-example-body",
  "input-otp-grouped",
  "input-otp-large",
  "item-actions",
  "item-content",
  "item-description",
  "item-group",
  "item-media",
  "item-title",
  "kbd",
  "kbd-group",
  "kbd-workflows",
  "label",
  "label-workflows",
  "media-surface",
  "menubar-checkbox-item",
  "menubar-content",
  "menubar-demo",
  "menubar-example-body",
  "menubar-group",
  "menubar-item",
  "menubar-label",
  "menubar-menu",
  "menubar-radio-group",
  "menubar-radio-item",
  "menubar-separator",
  "menubar-shortcut",
  "menubar-sub",
  "menubar-sub-content",
  "menubar-sub-trigger",
  "menubar-trigger",
  "navigation-menu-components-item",
  "navigation-menu-components-list",
  "navigation-menu-content",
  "navigation-menu-content-list",
  "navigation-menu-demo",
  "navigation-menu-example-body",
  "navigation-menu-icon-list",
  "navigation-menu-indicator",
  "navigation-menu-intro-list",
  "navigation-menu-item",
  "navigation-menu-link",
  "navigation-menu-link-copy",
  "navigation-menu-list",
  "navigation-menu-rtl-demo",
  "navigation-menu-trigger",
  "pagination-compact",
  "pagination-compact-section",
  "pagination-content",
  "pagination-demo",
  "pagination-ellipsis",
  "pagination-item",
  "pagination-link",
  "pagination-next",
  "pagination-next-text",
  "pagination-previous",
  "pagination-previous-text",
  "pagination-sr-only",
  "pagination-workflows",
  "popover-alignment-section",
  "popover-basic-stage",
  "popover-content",
  "popover",
  "popover-demo",
  "popover-demo-content",
  "popover-description",
  "popover-dimension-field",
  "popover-dimension-fields",
  "popover-example-body",
  "popover-header",
  "popover-side-stage-bottom",
  "popover-side-stage-top",
  "popover-state-section",
  "popover-title",
  "popover-trigger",
  "progress",
  "progress-demo",
  "progress-group",
  "progress-label",
  "progress-value",
  "radio-group",
  "radio-group-demo",
  "radio-group-item",
  "resizable-demo",
  "resizable-handle",
  "resizable-handle-grip",
  "resizable-panel",
  "row-start",
  "scroll-area-workflow-wide",
  "select",
  "select-demo",
  "select-icon",
  "select-sm",
  "select-wrapper",
  "separator",
  "separator-workflows",
  "sheet-body",
  "sheet-close",
  "sheet-content",
  "sheet-demo",
  "sheet-description",
  "sheet-footer",
  "sheet-header",
  "sheet-profile-field",
  "sheet-profile-fields",
  "sheet-profile-form",
  "sheet-title",
  "sheet-trigger",
  "sidebar-container",
  "sidebar-content",
  "sidebar-demo-shell",
  "sidebar-example-body",
  "sidebar-footer",
  "sidebar-gap",
  "sidebar-group",
  "sidebar-group-action",
  "sidebar-group-content",
  "sidebar-group-label",
  "sidebar-header",
  "sidebar-inner",
  "sidebar-input",
  "sidebar-inset",
  "sidebar-layout",
  "sidebar-menu",
  "sidebar-menu-action",
  "sidebar-menu-badge",
  "sidebar-menu-button",
  "sidebar-menu-item",
  "sidebar-menu-skeleton",
  "sidebar-menu-sub",
  "sidebar-menu-sub-button",
  "sidebar-menu-sub-item",
  "sidebar-rail",
  "sidebar-separator",
  "sidebar-trigger",
  "sidebar-wrapper",
  "skeleton-workflows",
  "slider-demo",
  "slider-example-body",
  "slider-label-row",
  "slider-range",
  "slider-thumb",
  "slider-track",
  "spinner-demo",
  "stepper",
  "switch",
  "switch-demo",
  "table",
  "table-body",
  "table-caption",
  "table-cell",
  "table-container",
  "table-footer",
  "table-head",
  "table-header",
  "table-row",
  "tabs-content",
  "tabs-demo-canonical",
  "tabs-list",
  "tabs-trigger",
  "textarea",
  "textarea-workflows",
  "toast",
  "toast-action",
  "toast-close",
  "toast-content",
  "toast-demo",
  "toast-description",
  "toast-example-body",
  "toast-icon",
  "toast-title",
  "toggle",
  "toggle-demo",
  "toggle-group-item",
  "tooltip-content",
  "tooltip-demo",
  "tooltip-example-body",
  "tooltip-trigger",
  "typography-demo",
  "validation-summary",
]);
const resultClasses = new Set([
  "button-group-output",
  "calendar-workflow-output",
  "carousel-status",
  "output",
]);
const redundantPartClassAllowlist = new Map<string, Set<string>>();
const write = process.argv.includes("--write");
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

const replaceElementTagByClass = (
  source: string,
  className: string,
  replacement: string,
  authoredTag?: string,
): string => {
  const stack: { name: string; replacement: string | null }[] = [];
  return source.replace(
    /<(\/)?([a-z][a-z0-9-]*)(\s[^<>]*?)?(\/?)>/gi,
    (
      tag,
      closing: string | undefined,
      authoredName: string,
      attributes = "",
      slash = "",
    ) => {
      const name = authoredName.toLowerCase();
      if (closing) {
        const index = stack.findLastIndex((entry) => entry.name === name);
        if (index < 0) return tag;
        const [{ replacement: closeAs }] = stack.splice(index);
        return closeAs === null ? tag : closeAs ? `</${closeAs}>` : "";
      }

      const classValue = attributes.match(/\bclass=(["'])(.*?)\1/i)?.[2];
      const replaceAs =
        classValue?.split(/\s+/).includes(className) &&
        (!authoredTag || name === authoredTag)
          ? replacement
          : null;
      if (!slash && !voidElements.has(name)) {
        stack.push({
          name,
          replacement:
            replaceAs && voidElements.has(replaceAs) ? "" : replaceAs,
        });
      }
      return replaceAs
        ? `<${replaceAs}${attributes}${slash ? " /" : ""}>`
        : tag;
    },
  );
};

const normalizeSeparators = (source: string): string =>
  replaceElementTagByClass(source, "separator", "hr").replace(
    /<hr\b[^>]*\bclass=(["'])[^"']*\bseparator\b[^"']*\1[^>]*>/gi,
    (tag) => {
      const isVertical = /\s(?:aria-)?orientation=(["'])vertical\1/i.test(tag);
      const normalized = tag.replace(
        /\s(?:aria-)?orientation=(["'])(?:horizontal|vertical)\1/gi,
        "",
      );
      return isVertical
        ? normalized.replace(/\s*\/?>(?=$)/, ' aria-orientation="vertical" />')
        : normalized;
    },
  );

interface FieldsetNode {
  readonly openStart: number;
  readonly openEnd: number;
  readonly openTag: string;
  readonly parent?: FieldsetNode;
  closeStart?: number;
  closeEnd?: number;
}

const flattenRedundantRadioFieldsets = (source: string): string => {
  const stack: FieldsetNode[] = [];
  const nodes: FieldsetNode[] = [];

  for (const match of source.matchAll(/<\/?fieldset\b[^>]*>/gi)) {
    if (match.index === undefined) continue;
    if (match[0].startsWith("</")) {
      const node = stack.pop();
      if (node) {
        node.closeStart = match.index;
        node.closeEnd = match.index + match[0].length;
      }
      continue;
    }

    const node: FieldsetNode = {
      openStart: match.index,
      openEnd: match.index + match[0].length,
      openTag: match[0],
      parent: stack.at(-1),
    };
    nodes.push(node);
    stack.push(node);
  }

  const edits: { start: number; end: number; value: string }[] = [];
  for (const node of nodes) {
    const parent = node.parent;
    const classValue = node.openTag.match(/\bclass=(["'])(.*?)\1/is)?.[2];
    if (
      !parent ||
      !classValue?.split(/\s+/).includes("radio-group") ||
      node.closeStart === undefined ||
      node.closeEnd === undefined ||
      !/<legend\b/i.test(source.slice(parent.openEnd, node.openStart))
    ) {
      continue;
    }

    const parentClass =
      parent.openTag.match(/\bclass=(["'])(.*?)\1/is)?.[2] ?? "";
    const mergedClasses = [
      ...new Set(
        `${parentClass} ${classValue}`.trim().split(/\s+/).filter(Boolean),
      ),
    ].join(" ");
    const innerAttributes = node.openTag
      .replace(/^<fieldset\b/i, "")
      .replace(/>$/, "")
      .replace(/\sclass=(["']).*?\1/is, "")
      .trim();
    let parentTag = parent.openTag;
    if (/\bclass=(["']).*?\1/is.test(parentTag)) {
      parentTag = parentTag.replace(
        /\bclass=(["']).*?\1/is,
        `class="${mergedClasses}"`,
      );
    } else {
      parentTag = parentTag.replace(/>$/, ` class="${mergedClasses}">`);
    }
    if (innerAttributes) {
      parentTag = parentTag.replace(/>$/, ` ${innerAttributes}>`);
    }

    edits.push(
      { start: parent.openStart, end: parent.openEnd, value: parentTag },
      { start: node.openStart, end: node.openEnd, value: "" },
      { start: node.closeStart, end: node.closeEnd, value: "" },
    );
  }

  return edits
    .sort((left, right) => right.start - left.start)
    .reduce(
      (result, edit) =>
        `${result.slice(0, edit.start)}${edit.value}${result.slice(edit.end)}`,
      source,
    );
};

const addTableHeaderScopes = (source: string): string =>
  source
    .replace(/<thead\b[\s\S]*?<\/thead>/gi, (section) =>
      section.replace(/<th\b(?![^>]*\bscope=)/gi, '<th scope="col"'),
    )
    .replace(/<tbody\b[\s\S]*?<\/tbody>/gi, (section) =>
      section.replace(/<th\b(?![^>]*\bscope=)/gi, '<th scope="row"'),
    );

const normalizeLabeledFieldsets = (source: string): string =>
  source.replace(
    /<fieldset(\b[^>]*)>(\s*)<legend\b/gi,
    (_match, attributes: string, spacing: string) => {
      const normalizedAttributes = attributes
        .replace(/\saria-label=(["']).*?\1/is, "")
        .replace(/\saria-labelledby=(["']).*?\1/is, "")
        .replace(/\saria-disabled=(["'])true\1/is, " disabled");
      return `<fieldset${normalizedAttributes}>${spacing}<legend`;
    },
  );

const isRedundantPartClass = (className: string, path: string): boolean =>
  (redundantPartClasses.has(className) ||
    redundantRuntimeRootClasses.has(className)) &&
  !redundantPartClassAllowlist.get(className)?.has(path);

const filesIn = (directory: string): string[] =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? filesIn(path) : path;
    })
    .filter((path) => extensions.has(extname(path)));

const files = [...roots.flatMap(filesIn), ...rootFiles];
const failures: string[] = [];

for (const path of files) {
  let source = readFileSync(path, "utf8");
  const displayPath = relative(".", path);

  if (write && [".html", ".md"].includes(extname(path))) {
    const normalizedFields = normalizeLabeledFieldsets(
      addTableHeaderScopes(
        flattenRedundantRadioFieldsets(normalizeSeparators(source)),
      ),
    );
    const normalizedFieldContainers = replaceElementTagByClass(
      normalizedFields,
      "field",
      "div",
      "fieldset",
    ).replace(/<div\b[^>]*>/gi, (tag) => {
      const classValue = tag.match(/\bclass=(["'])(.*?)\1/i)?.[2];
      return classValue?.split(/\s+/).includes("field")
        ? tag.replace(/\sdisabled(?=\s|=|>)/i, "")
        : tag;
    });
    const commandParts = /(?:^|\/)command(?:[-./]|$)/.test(displayPath)
      ? normalizedFieldContainers.replace(
          /<li(\b[^>]*)>\s*<button(\b[^>]*)>([\s\S]*?)<\/button>\s*<\/li>/gis,
          "<button$1$2>$3</button>",
        )
      : normalizedFieldContainers;
    const comboboxParts = [
      ["combobox-content", "aside"],
      ["combobox-control", "header"],
      ["combobox-chips", "fieldset"],
      ["combobox-empty", "p"],
      ["combobox-label", "h3"],
      ["combobox-group-label", "h3"],
    ].reduce(
      (result, [className, tag]) =>
        replaceElementTagByClass(result, className, tag),
      commandParts,
    );
    const menuParts = [
      ["dropdown-menu-content", "menu"],
      ["dropdown-menu-group", "section"],
      ["dropdown-menu-label", "h3"],
      ["dropdown-menu-radio-group", "fieldset"],
      ["dropdown-menu-sub", "details"],
      ["dropdown-menu-sub-trigger", "summary"],
      ["dropdown-menu-sub-content", "menu"],
      ["dropdown-menu-shortcut", "kbd"],
      ["context-menu-content", "menu"],
      ["context-menu-group", "section"],
      ["context-menu-label", "h3"],
      ["context-menu-radio-group", "fieldset"],
      ["context-menu-sub", "details"],
      ["context-menu-sub-trigger", "summary"],
      ["context-menu-sub-content", "menu"],
      ["context-menu-shortcut", "kbd"],
      ["menubar-menu", "section"],
      ["menubar-content", "menu"],
      ["menubar-group", "section"],
      ["menubar-label", "h3"],
      ["menubar-radio-group", "fieldset"],
      ["menubar-sub", "details"],
      ["menubar-sub-trigger", "summary"],
      ["menubar-sub-content", "menu"],
      ["menubar-shortcut", "kbd"],
    ].reduce(
      (result, [className, tag]) =>
        replaceElementTagByClass(result, className, tag),
      comboboxParts,
    );
    const overlayParts = [
      ["alert-dialog-media", "figure"],
      ["button-group-separator", "hr"],
      ["chart-axis", "footer"],
      ["chart-axis-item", "span"],
      ["chart-bar-group", "li"],
      ["chart-bar-groups", "ul"],
      ["chart-description", "p"],
      ["chart-grid", "hr"],
      ["chart-legend", "ul"],
      ["chart-plot", "section"],
      ["chart-tooltip", "output"],
      ["chart-tooltip-items", "dl"],
      ["chart-tooltip-name", "dt"],
      ["chart-tooltip-value", "dd"],
      ["dialog-body", "section"],
      ["drawer-body", "section"],
      ["drawer-goal-body", "section"],
      ["drawer-goal-chart", "figure"],
      ["drawer-goal-control", "menu"],
      ["drawer-goal-panel", "article"],
      ["drawer-goal-value", "output"],
      ["field-separator", "hr"],
      ["sheet-body", "section"],
      ["toast", "article"],
      ["toast-icon", "figure"],
      ["item-media", "figure"],
    ].reduce(
      (result, [className, tag]) =>
        replaceElementTagByClass(result, className, tag),
      menuParts,
    );
    const semanticParts = overlayParts
      .replace(/<\/hr>/gi, "")
      .replace(/\btabs-list\b/g, "tabs")
      .replace(/\bbutton-group-separator\b/g, "separator")
      .replace(/\bfield-separator\b/g, "separator")
      .replace(
        /<button(\b[^>]*\bclass=(["'])[^"']*\btoast-close\b[^"']*\2[^>]*)>/gis,
        (tag) =>
          /\bvalue=/i.test(tag) ? tag : tag.replace(/>$/, ' value="close">'),
      )
      .replace(
        /<div\b[^>]*\bclass=(["'])[^"']*\bdrawer-handle\b[^"']*\1[^>]*>\s*<\/div>/gis,
        "",
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bsidebar-menu-badge\b[^"']*\2[^>]*)>([\s\S]*?)<\/span\s*>/gis,
        "<output$1>$3</output>",
      )
      .replace(/\bsidebar-menu-skeleton\b/g, "skeleton")
      .replace(/\bdata-sidebar-target=/gi, "aria-controls=")
      .replace(
        /<span\b[^>]*\bclass=(["'])[^"']*\bnavigation-menu-indicator\b[^"']*\1[^>]*>\s*<\/span\s*>/gis,
        "",
      )
      .replace(
        /<span\b[^>]*\bclass=(["'])[^"']*\bdropdown-menu-(?:checkbox|radio)-item-indicator\b[^"']*\1[^>]*>[\s\S]*?<\/span\s*>/gis,
        "",
      )
      .replace(/(<summary\b[^>]*)\s+type=(["'])button\2/gi, "$1")
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\b(?:dropdown-menu|context-menu)-separator\b[^"']*\2[^>]*)>\s*<\/div>/gis,
        "<hr$1 />",
      )
      .replace(
        /<button(\b[^>]*\bclass=(["'])[^"']*\bcombobox-trigger\b[^"']*\2[^>]*)>/gis,
        (tag) =>
          /\bvalue=/i.test(tag) ? tag : tag.replace(/>$/, ' value="toggle">'),
      )
      .replace(
        /<button(\b[^>]*\bclass=(["'])[^"']*\bcombobox-clear\b[^"']*\2[^>]*)>/gis,
        (tag) =>
          /\bvalue=/i.test(tag) ? tag : tag.replace(/>$/, ' value="clear">'),
      )
      .replace(
        /<button(\b[^>]*\bclass=(["'])[^"']*\bcombobox-chip-remove\b[^"']*\2[^>]*)>/gis,
        (tag) =>
          /\bvalue=/i.test(tag) ? tag : tag.replace(/>$/, ' value="remove">'),
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bcombobox-separator\b[^"']*\2[^>]*)>\s*<\/div>/gis,
        "<hr$1 />",
      )
      .replace(
        /<ul(\b[^>]*\bclass=(["'])[^"']*\bcommand-list\b[^"']*\2[^>]*)>([\s\S]*?)<\/ul>/gis,
        "<div$1>$3</div>",
      )
      .replace(
        /<li(\b[^>]*\bclass=(["'])[^"']*\bcommand-item\b[^"']*\2[^>]*)>([\s\S]*?)<\/li>/gis,
        '<button type="button"$1>$3</button>',
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bcommand-separator\b[^"']*\2[^>]*)>\s*<\/div>/gis,
        "<hr$1 />",
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bcommand-shortcut\b[^"']*\2[^>]*)>([\s\S]*?)<\/span>/gis,
        "<kbd$1>$3</kbd>",
      )
      .replace(
        /<\/div>\s*<\/div>(\s*)(?=<(?:ul|div)\b[^>]*\bclass=(["'])[^"']*\bcommand-list\b)/gis,
        "</label></header>$1",
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bcommand-input-wrapper\b[^"']*\2[^>]*)>/gis,
        "<header$1>",
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bcommand-input-group\b[^"']*\2[^>]*)>/gis,
        "<label$1>",
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bresizable-handle\b[^"']*\2[^>]*)>\s*(?:<span\b[^>]*\bclass=(["'])[^"']*\bresizable-handle-grip\b[^"']*\3[^>]*>\s*<\/span>)?\s*<\/div>/gis,
        "<hr$1 />",
      )
      .replace(
        /<div\b[^>]*\bclass=(["'])[^"']*\bslider-track\b[^"']*\1[^>]*>\s*<div\b[^>]*\bclass=(["'])[^"']*\bslider-range\b[^"']*\2[^>]*>\s*<\/div>\s*<\/div>/gis,
        "",
      )
      .replace(
        /<button\b[^>]*\bclass=(["'])[^"']*\bcalendar-day\b[^"']*\1[^>]*>/gis,
        (tag) => tag.replace(/\bdata-value=/i, "value="),
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bcalendar-weekday\b[^"']*\2[^>]*)>([\s\S]*?)<\/span>/gi,
        "<abbr$1>$3</abbr>",
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bfield-description\b[^"']*\2[^>]*)>([\s\S]*?)<\/span>/gi,
        "<small$1>$3</small>",
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bfield-title\b[^"']*\2[^>]*)>([\s\S]*?)<\/span>/gi,
        "<strong$1>$3</strong>",
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bfield-title\b[^"']*\2[^>]*)>([\s\S]*?)<\/div>/gi,
        "<strong$1>$3</strong>",
      )
      .replace(
        /<div(\b[^>]*\bclass=(["'])[^"']*\bfield-content\b[^"']*\2[^>]*)>([\s\S]*?)<\/div>/gi,
        "<section$1>$3</section>",
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bavatar-badge\b[^"']*\2[^>]*)>([\s\S]*?)<\/span>/gi,
        "<output$1>$3</output>",
      )
      .replace(
        /<span(\b[^>]*\bclass=(["'])[^"']*\bavatar-group-count\b[^"']*\2[^>]*)>([\s\S]*?)<\/span>/gi,
        "<output$1>$3</output>",
      );
    const repairedParts = /(?:^|\/)chart(?:[-./]|$)/.test(displayPath)
      ? semanticParts
          .replace(/\bdata-label=/gi, "aria-label=")
          .replace(
            /<ul>(\s*)<span(\b[^>]*)>([\s\S]*?)<\/span>([\s\S]*?)<\/ul>/gi,
            "<li>$1<span$2>$3</span>$4</li>",
          )
          .replace(/<output(\b[^>]*)>\s*<\/output>/gi, "<span$1></span>")
          .replace(
            /<output>(\s*(?:\{\{[\s\S]*?\}\}|[^<]+)\s*)<\/output>/gi,
            "<strong>$1</strong>",
          )
          .replace(
            /<output>(\s*<span\b[\s\S]*?<\/span>\s*<dt\b[\s\S]*?<\/dt>\s*<dd\b[\s\S]*?<\/dd>\s*)<\/output>/gi,
            "<div>$1</div>",
          )
      : semanticParts;
    const unwrapped = repairedParts.replace(
      /<(div|span)\s+class=(["'])(?:native-)?select-wrapper\2>\s*(<select\b[\s\S]*?<\/select>)(?:\s*<svg\b[\s\S]*?<\/svg>)?\s*<\/\1>/gi,
      "$3",
    );
    const simplified = unwrapped.replace(
      /\sclass=(["'])(.*?)\1/gis,
      (_attribute, quote: string, value: string) => {
        const classes = value
          .split(/\s+/)
          .filter(Boolean)
          .filter((className) => !isRedundantPartClass(className, displayPath));
        return classes.length > 0
          ? ` class=${quote}${classes.join(" ")}${quote}`
          : "";
      },
    );
    if (simplified !== source) {
      writeFileSync(path, simplified);
      source = simplified;
    }
  }

  if (source.includes(removedSlotAttribute)) {
    failures.push(`${displayPath}: removed slot attribute is not allowed`);
  }

  if (source.includes(removedInputAttribute)) {
    failures.push(
      `${displayPath}: removed input styling attribute; use a native input`,
    );
  }

  if (extname(path) === ".css") {
    for (const classSelector of source.matchAll(
      /\.([a-z][a-z0-9-]*)(?=[^a-z0-9-]|$)/gi,
    )) {
      const className = classSelector[1];
      if (isRedundantPartClass(className, displayPath)) {
        failures.push(
          `${displayPath}: CSS targets redundant .${className}; target semantic structure under the component root`,
        );
      }
    }

    for (const selector of source.matchAll(/:is\((\.[a-z][a-z0-9-]*)\)/gi)) {
      failures.push(
        `${displayPath}: ${selector[0]} wraps one class without changing its selector; use ${selector[1]} directly`,
      );
    }
  }

  if ([".html", ".md"].includes(extname(path))) {
    for (const tag of source.match(/<[a-z][^>]*>/gis) ?? []) {
      const role = tag.match(/\srole=(["'])(.*?)\1/is)?.[2];
      const classValue = tag.match(/\sclass=(["'])(.*?)\1/is)?.[2];
      const classNames = new Set(classValue?.split(/\s+/).filter(Boolean));
      if (role && classValue?.trim()) {
        failures.push(
          `${displayPath}: role="${role}" identifies this element; remove its authored class and target the role`,
        );
      }

      if (classNames.has("disclosure") && !/^<details\b/i.test(tag)) {
        failures.push(
          `${displayPath}: .disclosure must use the native details element`,
        );
      }

      if (classNames.has("output") && classNames.has("visually-hidden")) {
        failures.push(
          `${displayPath}: visually hidden live output does not need the .output presentation class`,
        );
      }

      if (
        [...classNames].some((className) => /^lucide(?:-|$)/.test(className))
      ) {
        failures.push(
          `${displayPath}: Lucide generator classes are redundant; target the semantic icon position`,
        );
      }

      if (
        !/^<output\b/i.test(tag) &&
        [...classNames].some((className) => resultClasses.has(className))
      ) {
        failures.push(
          `${displayPath}: calculated results must use the native output element`,
        );
      }

      for (const match of tag.matchAll(/\sdata-([a-z][a-z0-9-]*)/g)) {
        if (redundantPresentationDataAttributes.has(match[1])) {
          failures.push(
            `${displayPath}: data-${match[1]} is presentation metadata; use the concise ${match[1]} attribute`,
          );
        }
      }
    }

    for (const classAttribute of source.matchAll(/\bclass=(["'])(.*?)\1/gis)) {
      for (const className of classAttribute[2].split(/\s+/)) {
        if (isRedundantPartClass(className, displayPath)) {
          failures.push(
            `${displayPath}: redundant .${className} class; use semantic structure under the component root`,
          );
        }
      }
    }

    const danglingAttribute = source.match(
      /<[a-z][^>]*\s-[a-z][a-z0-9-]*(?=\s|=|>)/i,
    );
    if (danglingAttribute) {
      failures.push(
        `${displayPath}: malformed attribute begins with a hyphen (${danglingAttribute[0].trim()})`,
      );
    }

    const invalidCustomElement = source.match(
      /<\/?(?:fieldset-group|fieldset-otp)\b/i,
    );
    if (invalidCustomElement) {
      failures.push(
        `${displayPath}: invalid migrated element ${invalidCustomElement[0]}`,
      );
    }

    const singleControlFieldset = (
      source.match(/<fieldset\b[^>]*>/gi) ?? []
    ).find((tag) => {
      const classValue = tag.match(/\bclass=(["'])(.*?)\1/i)?.[2];
      return classValue?.split(/\s+/).includes("field");
    });
    if (singleControlFieldset) {
      failures.push(
        `${displayPath}: .field wraps one control; use a div and reserve fieldset for related control groups`,
      );
    }

    const nestedRadioFieldset = source.match(
      /<fieldset\b[^>]*>(?:(?!<\/?fieldset\b)[\s\S])*<fieldset\b[^>]*>(?:(?!<\/?fieldset\b)[\s\S])*<input\b[^>]*\btype=(["'])radio\1/i,
    );
    if (nestedRadioFieldset) {
      failures.push(
        `${displayPath}: put the radio inputs in the labeled fieldset instead of nesting another fieldset`,
      );
    }

    const nonSemanticSeparator = (source.match(/<[a-z][^>]*>/gis) ?? []).find(
      (tag) => {
        const classValue = tag.match(/\bclass=(["'])(.*?)\1/i)?.[2];
        return (
          classValue?.split(/\s+/).includes("separator") && !/^<hr\b/i.test(tag)
        );
      },
    );
    if (nonSemanticSeparator) {
      failures.push(`${displayPath}: .separator must use a native hr element`);
    }

    const redundantSeparatorOrientation = (
      source.match(/<hr\b[^>]*>/gis) ?? []
    ).find((tag) => {
      const classValue = tag.match(/\bclass=(["'])(.*?)\1/i)?.[2];
      return (
        classValue?.split(/\s+/).includes("separator") &&
        (/\sorientation=/i.test(tag) ||
          /\saria-orientation=(["'])horizontal\1/i.test(tag))
      );
    });
    if (redundantSeparatorOrientation) {
      failures.push(
        `${displayPath}: separator orientation must use only aria-orientation="vertical" when vertical`,
      );
    }

    const unscopedTableHeader = source.match(/<th\b(?![^>]*\bscope=)[^>]*>/i);
    if (unscopedTableHeader) {
      failures.push(
        `${displayPath}: table headers require an explicit row or column scope`,
      );
    }

    const redundantlyLabeledFieldset = source.match(
      /<fieldset\b[^>]*\baria-label(?:ledby)?=[^>]*>\s*<legend\b/i,
    );
    if (redundantlyLabeledFieldset) {
      failures.push(
        `${displayPath}: a native legend must be the fieldset accessible name`,
      );
    }

    const ariaDisabledFieldset = source.match(
      /<fieldset\b[^>]*\baria-disabled=(["'])true\1/i,
    );
    if (ariaDisabledFieldset) {
      failures.push(
        `${displayPath}: use native fieldset disabled instead of aria-disabled`,
      );
    }

    for (const tag of source.match(/<[a-z][^>]*>/gis) ?? []) {
      const classNames = new Set(
        (tag.match(/\bclass=(["'])(.*?)\1/is)?.[2] ?? "")
          .split(/\s+/)
          .filter(Boolean),
      );
      for (const match of tag.matchAll(/\sng-([a-z][a-z0-9-]*)/g)) {
        const name = match[1];
        if (componentNames.has(name) && classNames.has(name)) {
          failures.push(
            `${displayPath}: [ng-${name}] already identifies the component root; remove redundant .${name}`,
          );
        }
        if (elementNames.has(name)) {
          failures.push(
            `${displayPath}: [ng-${name}] is styling-only; use native HTML and the catalog root selector`,
          );
          continue;
        }
        if (componentNames.has(name) || rootAliases.has(name)) continue;
        const owner = componentPrefixes.find((prefix) =>
          name.startsWith(`${prefix}-`),
        );
        if (owner) {
          failures.push(
            `${displayPath}: [ng-${name}] is a child marker; [ng-${owner}] must inspect its own semantic contents`,
          );
        }
      }
    }

    if (extname(path) === ".md") {
      for (const match of source.matchAll(/\bng-([a-z][a-z0-9-]*)/g)) {
        const name = match[1];
        if (componentNames.has(name) || rootAliases.has(name)) continue;
        if (elementNames.has(name)) {
          failures.push(
            `${displayPath}: documentation advertises styling-only ng-${name}`,
          );
          continue;
        }
        const owner = componentPrefixes.find((prefix) =>
          name.startsWith(`${prefix}-`),
        );
        if (owner) {
          failures.push(
            `${displayPath}: documentation advertises child marker ng-${name}; ng-${owner} must inspect semantic descendants`,
          );
        }
      }
    }
  }

  if (extname(path) === ".css") {
    for (const match of source.matchAll(/\[ng-([a-z][a-z0-9-]*)\]/g)) {
      const name = match[1];
      if (elementNames.has(name)) {
        failures.push(
          `${displayPath}: CSS targets styling-only [ng-${name}]; use its native HTML selector`,
        );
        continue;
      }
      if (componentNames.has(name) || rootAliases.has(name)) continue;
      const owner = componentPrefixes.find((prefix) =>
        name.startsWith(`${prefix}-`),
      );
      if (owner) {
        failures.push(
          `${displayPath}: CSS targets child marker [ng-${name}]; use .${name}`,
        );
      } else {
        failures.push(
          `${displayPath}: CSS targets unregistered [ng-${name}]; use semantic HTML or a class`,
        );
      }
    }
  }

  if (extname(path) === ".ts") {
    for (const className of redundantRuntimeRootClasses) {
      const directiveName = className;
      const selectorAlias = new RegExp(
        "([\"'`])\\." + className + "(?=\\1|\\s*,)",
      );
      if (selectorAlias.test(source)) {
        failures.push(
          `${displayPath}: runtime selectors must use [ng-${directiveName}] without the redundant .${className} alias`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  "Semantic authored-selector check passed: no slot attributes, role-bearing classes, redundant presentation classes, or child component markers.",
);
