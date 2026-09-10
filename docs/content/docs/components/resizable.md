---
title: resizable
category: "layout"
description: >
  Pointer- and keyboard-resizable split panels powered by `--panel-size` CSS
  variables.
---

Use `ng-resizable-panel-group` with alternating native `section` and `hr`
elements. Resize separators support pointer dragging and keyboard control.

```html
<div ng-resizable-panel-group aria-label="Resizable layout">
  <section style="--panel-size: 1">Preview</section>
  <hr aria-label="Resize preview and details" />
  <section>Details</section>
</div>
```

Set `orientation="vertical"` on the group to stack panels. Handles receive
separator roles, orientation, value bounds, current values, and `aria-controls`
relationships. Dragging or pressing Arrow, Home, and End keys updates adjacent
panel `--panel-size` values within `data-min-size` and `data-max-size`; RTL
reverses horizontal changes. CSS renders a visible grip without additional
markup.

## Example

{{< example src="examples/components/resizable.html" title="Resizable panels" height="250" >}}

## Orientations and RTL

{{< example src="examples/components/resizable-workflows.html" title="Resizable workflows" height="500" >}}

## Reactive Structure

{{< example src="examples/components/resizable-state-workflows.html" title="Reactive resizable structure" height="520" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-resizable-panel-group]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-resizable-panel-group`

### Semantic structure

Alternate direct `.resizable-panel` and `.resizable-handle` children inside each panel group. The root directive inspects those children; no child directives are required. Nested groups belong inside a panel.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-orientation` | Input/output | Interaction axis exposed to assistive technology. |
| `aria-valuemax` | Output | Maximum value exposed by an adjustable control. |
| `aria-valuemin` | Output | Minimum value exposed by an adjustable control. |
| `aria-valuenow` | Output | Current value exposed by an adjustable control. |
| `data-max-size` | Input | Largest panel flex size allowed during resizing. |
| `data-min-size` | Input | Smallest panel flex size allowed during resizing. |
| `data-resizing` | Output | Present while a pointer resize operation is active. |
| `data-step` | Input | Panel flex-size increment used by keyboard resizing. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `orientation` | Input/output | Resize axis: `horizontal` or `vertical`. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--panel-size` | Component styling variable. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns pairwise pointer and keyboard resizing, minimum and maximum bounds, direct-child panel/handle ownership, direction-aware deltas, and synchronized separator state. AngularTS or the application owns authored orientation, initial/external sizes, structural insertion, persistence, and business layout decisions.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give each resize handle a concise accessible name. Handles expose separator semantics, the physical resize axis through `aria-orientation`, current and bounded values, and `aria-controls` relationships to both adjacent panels. Keyboard resizing follows text direction and preserves visible focus.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-resizable-panel-group]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
