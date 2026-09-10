---
title: alert-dialog
category: "overlay"
description: >
  Confirmation dialog structure
---

Use alert dialog parts for destructive or confirmation flows that need a clear
action and cancel target.

```html
<section>
  <button commandfor="delete-dialog" command="show-modal">
    Delete project
  </button>
  <dialog id="delete-dialog" role="alertdialog" closedby="closerequest">
    <h2>Delete project?</h2>
  </dialog>
</section>
```

## Example

{{< example src="examples/components/alert-dialog.html" title="Alert dialog example" height="420">}}

## Sizes And Composition

{{< example src="examples/components/alert-dialog-workflows.html" title="Alert dialog sizes and composition" height="480">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. A native dialog configured for decisions.

## Anatomy

### Root styling selector

- `dialog[role="alertdialog"]`

### Semantic structure

Use a native `dialog` with `role="alertdialog"` beside its invoker button. Close controls use `command=close`; semantic headers, figures, and footers need no anatomy classes or nested AngularCSS attributes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `role` | Authored | Explicit semantic role when native HTML does not provide one. |
| `size` | Authored | Compact action layout: `sm`; omit for the default dialog layout. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A native `dialog` opened with `command=show-modal` owns top-layer rendering, modal focus, Escape, background isolation, and trigger focus restoration. Use `closedby=closerequest` when pointer light-dismiss must be disabled. AngularCSS registers no alert-dialog directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Connect the native dialog to a concise title and consequence description with `aria-labelledby` and `aria-describedby`. Put the least destructive action first in focus order and use `closedby=closerequest` when outside dismissal would be unsafe.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
