---
title: range-slider
category: "form"
description: >
  Multiple native range inputs coordinated on one shared track.
---

Use `ng-range-slider` only when two or more native range inputs share one visual
track. The parent inspects its direct inputs and computes composite geometry
while every input retains native focus, keyboard, form, and AngularTS model
behavior. Use the Range element for a single value.

```html
<fieldset>
  <legend>Price range</legend>
  <div ng-range-slider min="0" max="100">
    <input
      aria-label="Minimum price"
      type="range"
      min="0"
      max="100"
      value="25"
    />
    <input
      aria-label="Maximum price"
      type="range"
      min="0"
      max="100"
      value="75"
    />
  </div>
</fieldset>
```

## Example

{{< example src="examples/components/range-slider.html" title="Range slider example" height="220" >}}

## Reference workflows

The workflow page covers controlled and multi-thumb ranges, disabled state,
right-to-left direction, and vertical orientation. Every thumb uses the same
absolute bounds so its native position remains accurate. Applications that
require ordered or non-crossing values enforce that policy in AngularTS state.

{{< example src="examples/components/range-slider-workflows.html" title="Range slider workflows" height="720" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-range-slider]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-range-slider`

### Semantic structure

Apply `ng-range-slider` to one container with two or more direct native `input[type=range]` children sharing the same minimum and maximum. Label every input independently. For one value, use a plain range input without an AngularCSS directive.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-orientation` | Output | Interaction axis exposed to assistive technology. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `max` | Input | Maximum native or component value. |
| `min` | Input | Minimum native or component value. |
| `orientation` | Input/output | Layout direction: `horizontal` or `vertical`. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--range-end` | Component styling variable. |
| `--range-start` | Component styling variable. |
| `--value` | Component styling variable. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive coordinates two or more native range inputs on one shared track. It computes only composite geometry and ARIA orientation; each native input and its AngularTS `ng-model` retain value, focus, keyboard, validation, and form ownership. Use a plain range element when only one value is required.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Preserve native required, disabled, and invalid semantics, and connect help or error text with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-range-slider]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
