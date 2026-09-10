---
title: checkbox
category: "form"
description: >
  Native checkbox control styled from native state.
---

Use a native checkbox input. AngularCSS styles it directly; native input state
and AngularTS `ng-model` remain the source of truth. Use `role="switch"` only
when the checkbox needs switch semantics and presentation.

```html
<div orientation="horizontal" class="field">
  <input id="terms" name="terms" type="checkbox" ng-model="terms" />
  <label for="terms"> Accept terms </label>
</div>
```

Set the native `HTMLInputElement.indeterminate` property from application code
when a mixed selection is needed. Native `:indeterminate` state owns both the
visual and accessibility contract; AngularCSS does not create a second checkbox
model.

## Example

{{< example src="examples/components/checkbox.html" title="Checkbox example" height="420">}}

## States, group, and RTL

{{< example src="examples/components/checkbox-workflows.html" title="Checkbox reference workflows" height="1200">}}

## Table selection

{{< example src="examples/components/checkbox-compositions.html" title="Checkbox table composition" height="420">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native checkbox state and validation.

## Anatomy

### Root styling selector

- `input[type="checkbox"]:not([role="switch"])`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `checked` | Authored | Initial native checked state. |
| `disabled` | Authored | Disables native or component interaction. |
| `required` | Authored | Marks a native form value as required. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native checkbox state and validation. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Preserve native required, disabled, and invalid semantics, and connect help or error text with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
