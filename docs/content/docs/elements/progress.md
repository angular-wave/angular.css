---
title: progress
category: "feedback"
description: >
  Task completion indicator
---

Use native `progress`. Compose its label and value with native `label` and
`output` elements when needed.

```html
<div>
  <label id="upload-progress-label">Upload progress</label>
  <output>56%</output>
  <progress
    value="56"
    max="100"
    aria-labelledby="upload-progress-label"
  ></progress>
</div>
```

## Example

{{< example src="examples/components/progress.html" title="Progress example" height="190">}}

## Controlled and RTL

{{< example src="examples/components/progress-workflows.html" title="Progress workflows" height="300">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native progress semantics and state.

## Anatomy

### Root styling selector

- `progress`

### Semantic structure

Use a native `progress` element. For a visible label and value, place direct native `label`, `output`, and `progress` children in one `div`; AngularCSS recognizes that semantic structure without another class.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `max` | Authored | Maximum native or component value. |
| `value` | Authored | Native value or authored component value. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The native `progress` element owns progressbar semantics and determinate or indeterminate state. Native `label` and `output` elements provide optional context. AngularTS may bind `value`; AngularCSS registers no progress directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give every native progress element an accessible name with `label`, `aria-label`, or `aria-labelledby`. Set `value` and `max` for determinate progress; omit `value` for indeterminate progress.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
