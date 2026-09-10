---
title: chart
category: "data display"
description: >
  HTML-first chart container, legend, axis, and tooltip primitives
---

Use Chart to frame application-rendered HTML, SVG, canvas, or a locally bundled
chart library with a consistent container, axis, legend, and tooltip contract.
For simple authored HTML plots, `data-value` and `data-color` synchronize to
`--value` and `--chart-color`.

```html
<figure aria-label="Monthly visitors" class="chart">
  <section>
    <hr />
    <ul>
      <li>
        <span
          aria-label="January desktop"
          data-value="72%"
          data-color="var(--chart-1)"
        ></span>
      </li>
    </ul>
  </section>
  <footer><span>Jan</span></footer>
</figure>
```

AngularCSS does not implement a chart engine. Plotting, scales, data,
formatting, hover selection, and active-series state remain with authored HTML,
the application's selected chart library, and AngularTS. This keeps Chart from
covering AngularTS application behavior while providing stable semantic and
customization hooks.

## Example

{{< example src="examples/components/chart.html" title="Basic grouped bar chart" height="360" >}}

## Axis, grid, tooltip, and legend

{{< example src="examples/components/chart-workflows.html" title="Chart composition workflows" height="1280" >}}

## Interactive, RTL, and tooltip variants

{{< example src="examples/components/chart-compositions.html" title="Chart reference compositions" height="1200" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Authored figures, tables, and CSS variables.

## Anatomy

### Root styling selector

- `.chart`

### Semantic structure

Apply `.chart` to an accessible `figure`. Compose its optional title, plot, grid, grouped bars, axis, legend, and tooltip from semantic `header`, `section`, `hr`, `ul`, `li`, `footer`, `output`, and description-list elements; no anatomy classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `data-color` | Authored | Series color key used by the example or application to set `--chart-color`. |
| `data-value` | Authored | Authored bar height as a percentage when `--value` is not set. |
| `indicator` | Authored | Legend indicator: `line` or `dashed`; omit for a solid mark. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--chart-color` | Color for an authored series, mark, or legend indicator. |
| `--value` | Bar height as a percentage; falls back to `data-value` and then `50%`. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Semantic figure, heading, list, and data markup owns chart meaning. CSS variables provide visual values and colors; authored HTML, SVG, canvas, or an application-selected chart library owns plotting, scales, data, formatting, and interaction. AngularCSS registers no chart directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give every chart root a useful accessible name and provide a textual or tabular equivalent when exact values matter. Bars expose authored labels and values; axes and legends are lists; grid decoration is hidden; visible tooltips are status regions. Never use color as the only distinction between series.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
