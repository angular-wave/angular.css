---
title: select
category: "form"
description: >
  Native select styling integrated with AngularTS models and form state.
---

Use a native `select` directly and bind application state with AngularTS
`ng-model`. No wrapper or styling class is required.

```html
<select id="status" ng-model="status" required>
  <option value="">Select a status</option>
  <option>Todo</option>
  <option>Done</option>
</select>
```

## Example

{{< example src="examples/components/select.html" title="Select example" height="400" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native select, option, and optgroup behavior.

## Anatomy

### Root styling selector

- `select`

### Semantic structure

Use a native `select` directly. Native `option` and `optgroup` elements need no additional attributes. Use AngularTS `ng-model`, validators, and form directives directly on the select.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Authored | Disables native or component interaction. |
| `multiple` | Authored | Allows more than one item to remain selected or open. |
| `name` | Authored | Authored HTML attribute or styling hook. |
| `required` | Authored | Marks a native form value as required. |
| `size` | Authored | Visual size token supported by the component stylesheet. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The native `select` owns values, option groups, keyboard interaction, disabled state, validation, and form submission. AngularTS supplies option registration, `ng-model`, validators, and form-state classes. AngularCSS registers no select directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible `label` connected by `for` and `id`, or provide another accessible name. Preserve native option, optgroup, multiple, disabled, required, invalid, and direction semantics; AngularTS reflects model and validation state without replacing them.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
