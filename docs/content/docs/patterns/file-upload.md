---
title: file-upload
category: "form"
description: >
  Native file selection and transfer status
---

Keep file selection native and present application-owned queue and progress
state beside it. AngularTS can handle drop events and backend transfer commands
without introducing a second upload model.

## Example

{{< example src="examples/components/file-upload.html" title="Supporting document upload" height="440" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native file input and authored status.

## Anatomy

### Root styling selector

- `section:has(> label > input[type="file"])`

### Semantic structure

Use a semantic section with a direct label containing a native file input. Optional direct `ul`, native `progress`, and `output` elements present application-owned queue and transfer state without component or part classes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `accept` | Authored | Native accepted file types on the direct file input. |
| `dragging` | Authored | Presentational drop-target state on the root section. |
| `multiple` | Authored | Allows the direct native file input to accept several files. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

File Upload styles a native file input, authored queue, native progress, and status output. AngularTS or the application owns drag-and-drop event handling, validation, transfer, retry, cancellation, and persistence.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Keep the native file input operable and labeled. Announce queue changes with a status output, label progress, and expose validation or transfer errors as text rather than color alone.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
