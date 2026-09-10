---
title: form-layout
category: "form"
description: >
  Responsive enterprise form composition
---

Arrange native fieldsets and existing Field patterns into responsive columns.
Native validation and AngularTS forms remain the authoritative form model.

## Example

{{< example src="examples/components/form-layout.html" title="Customer form layout" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Responsive native form and field composition.

## Anatomy

### Root styling selector

- `form.form-layout`

### Semantic structure

Apply `.form-layout` to a native form containing semantic headers, fieldsets, Field patterns, an optional Validation Summary, and a footer. No form-layout part classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `columns` | Authored | Preferred desktop column count: `1`, `2`, or `3`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Form Layout arranges native fieldsets and Field patterns. Native validation and AngularTS forms remain authoritative for values, errors, submission, and server responses.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Preserve DOM and focus order as the layout changes columns. Group related controls with fieldset and legend, connect errors to controls, and place a Validation Summary before invalid fields.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
