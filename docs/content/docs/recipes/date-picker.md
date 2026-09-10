---
title: date-picker
category: "date input"
description: >
  Calendar and native popover composition
---

Compose Calendar with the native Popover API and an application-owned date
value. This recipe packages the existing date workflow without adding another
model, parser, or form directive.

## Example

{{< example src="examples/components/date-picker.html" title="Delivery date picker" height="460" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Calendar, popover, and form-control composition.

## Anatomy

### Root styling selector

- `.date-picker`

### Semantic structure

Use `.date-picker` around a visible label and the existing Popover and Calendar roots. The trigger may display an AngularTS-formatted value; no date-picker part classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Authored | Validation state on the Date Picker root, reflected on its trigger border. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Date Picker composes Calendar with the native Popover API and a native form control or button. Calendar owns date-grid mechanics; AngularTS owns the model, parsing, validation, formatting, and submitted value.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the trigger and calendar useful names, preserve visible focus, and expose the selected date as text. The composed Calendar retains its full keyboard contract inside the native popover.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
