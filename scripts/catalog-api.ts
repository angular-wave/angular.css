import type { CatalogEntryName } from "./component-policy.ts";

export interface CatalogReferenceApi {
  readonly attributes?: readonly string[];
  readonly attributeDescriptions?: Readonly<Record<string, string>>;
  readonly cssVariables?: Readonly<Record<string, string>>;
  readonly rootSelector?: string;
}

/** Public authored styling hooks that cannot be derived from runtime code. */
export const catalogReferenceApi: Record<
  CatalogEntryName,
  CatalogReferenceApi
> = {
  direction: {
    attributes: ["align", "dir"],
    attributeDescriptions: {
      align: "Logical text alignment: `start` or `end`.",
      dir: "Native text direction: `ltr`, `rtl`, or `auto`.",
    },
    rootSelector: "[dir]",
  },
  button: {
    rootSelector: "button",
    attributes: [
      "aria-disabled",
      "aria-haspopup",
      "aria-invalid",
      "icon",
      "size",
      "variant",
    ],
    attributeDescriptions: {
      icon: "Icon position: `inline-start` or `inline-end`.",
      size: "Size: `xs`, `sm`, `default`, `lg`, `icon-xs`, `icon-sm`, `icon`, or `icon-lg`.",
      variant:
        "Style: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `info`, `success`, or `warning`.",
    },
  },
  checkbox: {
    attributes: ["checked", "disabled", "required"],
    rootSelector: 'input[type="checkbox"]:not([role="switch"])',
  },
  dialog: {
    attributes: ["command", "commandfor", "closedby", "dir", "size"],
    attributeDescriptions: {
      size: "Dialog width: `wide`; omit for the default width.",
    },
  },
  input: {
    attributes: ["aria-invalid", "disabled", "size", "type"],
    attributeDescriptions: {
      size: "Native number of visible characters; also enables content sizing when supported.",
      type: "Native input kind, such as `text`, `email`, `password`, `number`, `search`, `tel`, or `url`.",
    },
    rootSelector:
      'input:not([type="button"], [type="checkbox"], [type="color"], [type="hidden"], [type="image"], [type="radio"], [type="range"], [type="reset"], [type="submit"])',
  },
  kbd: { rootSelector: "kbd" },
  label: { attributes: ["for"], rootSelector: "label" },
  progress: {
    attributes: ["dir", "max", "value"],
    rootSelector: "progress",
  },
  "radio-group": {
    attributes: [
      "aria-invalid",
      "checked",
      "dir",
      "disabled",
      "name",
      "required",
      "value",
    ],
    rootSelector: 'fieldset:has(input[type="radio"]):not(.toggle-group)',
  },
  range: {
    attributes: ["disabled", "max", "min", "orientation", "step", "value"],
    rootSelector: 'input[type="range"]',
  },
  "scroll-area": {
    attributes: ["dir", "tabindex"],
    attributeDescriptions: {
      tabindex:
        "Use `0` when the overflow region itself must be reachable by keyboard.",
    },
  },
  select: {
    attributes: [
      "aria-invalid",
      "dir",
      "disabled",
      "multiple",
      "name",
      "required",
      "size",
    ],
    rootSelector: "select",
  },
  separator: {
    attributes: ["aria-orientation"],
    attributeDescriptions: {
      "aria-orientation":
        "Separator axis: `vertical`; omit for the native horizontal separator.",
    },
    rootSelector: "hr",
  },
  switch: {
    attributes: ["checked", "disabled", "required", "role", "size"],
    attributeDescriptions: {
      size: "Switch size: `sm`; omit for the default size.",
    },
    rootSelector: 'input[type="checkbox"][role="switch"]',
  },
  table: { attributes: ["aria-selected"], rootSelector: "table" },
  textarea: {
    attributes: ["aria-invalid", "disabled", "required"],
    rootSelector: "textarea",
  },

  accordion: {
    attributes: ["inert", "name", "open"],
    rootSelector: "section[aria-label]:has(> details)",
  },
  alert: {
    attributes: ["aria-atomic", "aria-live", "role", "variant"],
    attributeDescriptions: {
      variant:
        "Status presentation: `info`, `success`, `warning`, or `destructive`; omit for the default presentation.",
    },
    rootSelector: '[role="alert"]',
  },
  "aspect-ratio": {
    attributes: ["ratio"],
    attributeDescriptions: {
      ratio:
        "Aspect ratio: `1 / 1`, `9 / 16`, or `16 / 9`; defaults to `16 / 9`.",
    },
    cssVariables: {
      "--ratio": "Rendered aspect ratio; defaults to `16 / 9`.",
    },
    rootSelector: "figure[ratio]",
  },
  avatar: {
    attributes: ["size", "variant"],
    attributeDescriptions: {
      size: "Avatar size: `sm` or `lg`; omit for the default size.",
      variant:
        "Optional direct `output` badge status: `success`; omit for the primary status color.",
    },
  },
  badge: {
    attributes: ["icon", "variant"],
    attributeDescriptions: {
      icon: "Direct icon position: `inline-start` or `inline-end`.",
      variant:
        "Presentation: `default`, `secondary`, `destructive`, `outline`, `ghost`, or `custom`.",
    },
  },
  breadcrumb: {
    attributes: ["aria-current", "dir"],
    rootSelector: ".breadcrumb",
  },
  "button-group": {
    attributes: ["aria-orientation", "orientation", "role"],
    attributeDescriptions: {
      "aria-orientation":
        "Use `vertical` on a direct separator when it divides controls along the inline axis.",
      orientation: "Group layout: `vertical`; omit for the horizontal layout.",
    },
    rootSelector: '[role="group"]',
  },
  card: {
    attributes: ["size"],
    attributeDescriptions: {
      size: "Use `sm` for compact spacing; omit for the default size.",
    },
    cssVariables: {
      "--card-padding-block":
        "Block padding; defaults to four spacing units, or three for `size=sm`.",
    },
  },
  chart: {
    attributes: ["data-color", "data-value", "indicator"],
    attributeDescriptions: {
      "data-color":
        "Series color key used by the example or application to set `--chart-color`.",
      "data-value":
        "Authored bar height as a percentage when `--value` is not set.",
      indicator: "Legend indicator: `line` or `dashed`; omit for a solid mark.",
    },
    cssVariables: {
      "--chart-color":
        "Color for an authored series, mark, or legend indicator.",
      "--value":
        "Bar height as a percentage; falls back to `data-value` and then `50%`.",
    },
  },
  "description-list": {
    attributes: ["orientation"],
    attributeDescriptions: {
      orientation:
        "Row layout: `horizontal` or `vertical`; omit to become vertical on narrow viewports.",
    },
    rootSelector: "dl:has(> div > dt):has(> div > dd)",
  },
  disclosure: { attributes: ["open"] },
  empty: {
    attributes: ["variant"],
    attributeDescriptions: {
      variant:
        "Optional direct figure presentation: `icon`; omit for the default media treatment.",
    },
  },
  field: {
    attributes: ["aria-invalid", "orientation", "variant"],
    attributeDescriptions: {
      orientation:
        "Field layout: `horizontal` or `responsive`; omit for the vertical layout.",
      variant: "Compact `label` typography when authored on a fieldset legend.",
    },
  },
  "file-upload": {
    attributes: ["accept", "dragging", "multiple"],
    attributeDescriptions: {
      accept: "Native accepted file types on the direct file input.",
      dragging: "Presentational drop-target state on the root section.",
      multiple: "Allows the direct native file input to accept several files.",
    },
    rootSelector: 'section:has(> label > input[type="file"])',
  },
  "filter-bar": {
    attributes: ["role"],
    rootSelector: 'form[role="search"]:has(> fieldset + menu)',
  },
  "input-group": {
    attributes: ["align", "aria-invalid", "border", "size"],
    attributeDescriptions: {
      align:
        "Direct addon placement: `inline-start`, `inline-end`, `block-start`, or `block-end`.",
      border: "Use `true` on a direct block addon to draw its dividing border.",
      size: "Direct action size: `sm`, `icon-xs`, or `icon-sm`; omit for the compact addon action.",
    },
  },
  "input-otp": {
    attributes: ["aria-invalid", "group", "maxlength", "pattern", "size"],
    attributeDescriptions: {
      group:
        "Optional visual grouping size. Use `3` to separate a six-character code into two groups.",
      size: "Native visible-character count; AngularCSS supports four or six code cells.",
    },
    rootSelector: 'input[autocomplete="one-time-code"]',
    cssVariables: {
      "--otp-cell-size":
        "Width of one visual code cell; defaults to eight spacing units.",
    },
  },
  item: {
    attributes: ["size", "variant"],
    attributeDescriptions: {
      size: "Item density: `xs` or `sm`; omit for the default size.",
      variant:
        "Item surface: `outline` or `muted`; direct figures additionally accept `icon` or `image`.",
    },
  },
  pagination: {
    attributes: ["aria-current", "aria-disabled", "dir", "rel"],
    attributeDescriptions: {
      rel: "Use the `prev` or `next` link type for directional pagination controls.",
    },
    rootSelector: ".pagination",
  },
  popover: {
    attributes: ["align", "popover", "popovertarget", "side"],
    attributeDescriptions: {
      align: "Popover alignment: `start`, `center`, or `end`.",
      popover: "Native Popover API state and behavior on the surface.",
      popovertarget: "ID of the sibling popover controlled by the trigger.",
      side: "Preferred placement: `top`, `right`, `bottom`, or `left`.",
    },
    rootSelector: "span:has(> [popovertarget] ~ [popover])",
  },
  skeleton: {},
  spinner: {
    attributes: ["size"],
    attributeDescriptions: {
      size: "Spinner size: `sm` or `lg`; omit for the default size.",
    },
  },
  stepper: {
    attributes: ["aria-current"],
    rootSelector: 'nav:has([aria-current="step"])',
  },
  toggle: {
    attributes: ["aria-disabled", "aria-pressed", "size", "variant"],
    attributeDescriptions: {
      size: "Toggle size: `sm` or `lg`; omit for the default size.",
      variant: "Toggle presentation: `outline`; omit for the default style.",
    },
    rootSelector: "button[aria-pressed]",
  },
  "toggle-group": {
    attributes: ["orientation", "size", "spacing", "variant"],
    attributeDescriptions: {
      orientation: "Group layout: `vertical`; omit for the horizontal layout.",
      size: "Control size: `sm` or `lg`; omit for the default size.",
      spacing: "Gap in spacing units: `1` or `2`; omit to join controls.",
      variant: "Control presentation: `outline`; omit for the default style.",
    },
    cssVariables: {
      "--toggle-group-gap": "Gap between controls; defaults to `0`.",
    },
  },
  "validation-summary": {
    attributes: ["role", "tabindex"],
    rootSelector: 'aside[role="alert"]:has(> header + ul)',
  },

  calendar: {
    attributes: [
      "data-booked-dates",
      "data-calendar-preset",
      "data-caption-layout",
      "data-disabled-after",
      "data-disabled-before",
      "data-disabled-dates",
      "data-end-year",
      "data-min-nights",
      "data-month",
      "data-number-of-months",
      "data-selection-mode",
      "data-show-outside-days",
      "data-show-week-numbers",
      "data-start-year",
      "data-value",
      "data-values",
      "data-week-start",
    ],
    attributeDescriptions: {
      "data-booked-dates": "Comma-separated ISO dates styled as booked.",
      "data-calendar-preset":
        "Generated calendar preset: `single`, `multiple`, or `range`.",
      "data-caption-layout": "Caption controls: `label` or `dropdown`.",
      "data-disabled-after": "Last selectable date as an ISO date.",
      "data-disabled-before": "First selectable date as an ISO date.",
      "data-disabled-dates":
        "Comma-separated ISO dates that cannot be selected.",
      "data-end-year": "Final year offered by a dropdown caption.",
      "data-min-nights":
        "Minimum number of nights accepted by range selection.",
      "data-month": "Displayed month in `YYYY-MM` form.",
      "data-number-of-months": "Number of consecutive months to render.",
      "data-selection-mode":
        "Selection behavior: `single`, `multiple`, or `range`.",
      "data-show-outside-days": "Shows dates from adjacent months when `true`.",
      "data-show-week-numbers": "Shows ISO-style week numbers when `true`.",
      "data-start-year": "First year offered by a dropdown caption.",
      "data-value": "Selected ISO date for single selection.",
      "data-values":
        "Comma-separated selected ISO dates for multiple selection.",
      "data-week-start":
        "First weekday as an integer from `0` (Sunday) to `6` (Saturday).",
    },
    cssVariables: {
      "--calendar-cell-size":
        "Width and height of calendar controls and day cells.",
    },
  },
  carousel: {
    cssVariables: {
      "--carousel-gap": "Gap between slides; defaults to four spacing units.",
      "--carousel-item-size": "Slide basis; defaults to `100%`.",
    },
  },
  combobox: {
    attributes: ["auto-highlight", "data-value", "multiple", "open"],
    attributeDescriptions: {
      "auto-highlight":
        "Highlights the first enabled result when the popup opens or filters change.",
      "data-value":
        "Application value reported when the corresponding option is selected.",
      multiple:
        "Keeps the popup open and reports selections for an application-owned collection.",
      open: "Initial or externally synchronized disclosure state.",
    },
  },
  command: {},
  "context-menu": {
    attributes: ["align-offset", "side-offset"],
    attributeDescriptions: {
      "align-offset": "Additional alignment offset in CSS pixels.",
      "side-offset": "Distance from the invocation point in CSS pixels.",
    },
  },
  "dropdown-menu": {
    attributes: ["align-offset", "side-offset"],
    attributeDescriptions: {
      "align-offset": "Additional alignment offset in CSS pixels.",
      "side-offset": "Distance from the trigger in CSS pixels.",
    },
  },
  "hover-card": {},
  menubar: {},
  "navigation-menu": {},
  "range-slider": {},
  resizable: {
    attributes: ["data-max-size", "data-min-size", "data-step", "orientation"],
    attributeDescriptions: {
      "data-max-size": "Largest panel flex size allowed during resizing.",
      "data-min-size": "Smallest panel flex size allowed during resizing.",
      "data-step": "Panel flex-size increment used by keyboard resizing.",
      orientation: "Resize axis: `horizontal` or `vertical`.",
    },
  },
  sidebar: {
    attributes: ["collapsed", "collapsible", "responsive", "side", "variant"],
    attributeDescriptions: {
      collapsed: "Current collapsed state.",
      collapsible: "Collapse behavior: `offcanvas`, `icon`, or `none`.",
      responsive:
        "Collapses an off-canvas sidebar below `48rem` and expands it above that breakpoint.",
      side: "Physical placement: `left` or `right`.",
      variant: "Surface style: `sidebar`, `floating`, or `inset`.",
    },
  },
  tabs: {},
  toast: {
    attributes: ["position", "type"],
    attributeDescriptions: {
      position:
        "Viewport placement: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, or `bottom-right`.",
      type: "Toast state: `default`, `error`, `info`, `loading`, `success`, or `warning`.",
    },
  },
  toolbar: { attributes: ["aria-label", "aria-orientation"] },
  tooltip: {},
  tree: {
    attributes: ["aria-label", "aria-multiselectable", "data-value"],
    attributeDescriptions: {
      "aria-multiselectable":
        "Set to `true` to allow Ctrl or Command click selection of several items.",
      "data-value": "Application value included in `angularcss:tree-select`.",
    },
  },
  "application-shell": {},
  "data-table": {
    attributes: ["aria-selected", "aria-sort"],
    attributeDescriptions: {
      "aria-selected": "Selected row state.",
      "aria-sort":
        "Column sort state: `ascending`, `descending`, `none`, or `other`.",
    },
    cssVariables: {
      "--data-table-max-height":
        "Maximum scrollable table height; defaults to `32rem`.",
    },
  },
  "date-picker": {
    attributes: ["aria-invalid"],
    attributeDescriptions: {
      "aria-invalid":
        "Validation state on the Date Picker root, reflected on its trigger border.",
    },
  },
  "form-layout": {
    attributes: ["columns"],
    attributeDescriptions: {
      columns: "Preferred desktop column count: `1`, `2`, or `3`.",
    },
    rootSelector: "form.form-layout",
  },
  "master-detail": {
    attributes: ["orientation"],
    attributeDescriptions: {
      orientation:
        "Resizable panel axis: `horizontal` or `vertical`; the recipe stacks on narrow viewports.",
    },
  },
  "alert-dialog": {
    attributes: ["role", "size"],
    attributeDescriptions: {
      size: "Compact action layout: `sm`; omit for the default dialog layout.",
    },
    rootSelector: 'dialog[role="alertdialog"]',
  },
  drawer: {
    attributes: ["dir", "side", "size"],
    attributeDescriptions: {
      side: "Dialog edge: `top`, `right`, `bottom`, or `left`.",
      size: "Use `half` for a half-height top or bottom drawer.",
    },
  },
  sheet: {
    attributes: ["command", "dir", "side", "size"],
    attributeDescriptions: {
      side: "Dialog edge: `top`, `right`, `bottom`, or `left`.",
      size: "Use `half` for a half-height top or bottom sheet.",
    },
  },
};
