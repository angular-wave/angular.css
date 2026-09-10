---
title: validation-summary
category: "form"
description: >
  Linked form validation messages
---

Place a validation summary before the related fields when submission reveals
several errors. Each message links directly to its native form control.

## Example

{{< example src="examples/components/validation-summary.html" title="Form validation summary" height="420">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Authored validation messages linked to form controls.

## Anatomy

### Root styling selector

- `aside[role="alert"]:has(> header + ul)`

### Semantic structure

Use `role="alert"` on a semantic `aside` containing a direct header followed by a list of links to invalid controls. No classes or part markers are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `role` | Authored | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Authored | Keyboard focus order for composite descendants. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Validation Summary presents authored error links. Native form validation, AngularTS form controllers, server responses, message visibility, and focus policy remain application-owned.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the summary a heading and link every message to its corresponding control. Use an alert or live region when errors appear after submission, then apply application focus policy deliberately.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
