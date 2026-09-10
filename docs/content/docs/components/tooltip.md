---
title: tooltip
category: "overlay"
description: >
  Contextual hover and focus labels
---

Use a native trigger with short, non-interactive descriptive content. Content
can be held visible with the wrapper's concise `open` attribute for controlled
examples.

```html
<span ng-tooltip>
  <button>Hover</button>
  <span side="top">Add to library</span>
</span>
```

## Example

{{< example src="examples/components/tooltip.html" title="Tooltip example" height="210" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-tooltip]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-tooltip`

### Semantic structure

One trigger and one plain-text content element are required. Prefer a native button or link trigger. Tooltip content is descriptive and non-interactive; use Popover when the floating content needs controls or focus.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-describedby` | Output | ID of the element that supplies the accessible description. |
| `aria-hidden` | Output | Whether generated or collapsed content is hidden from assistive technology. |
| `open` | Input | Initial or controlled open state. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `side` | Input/output | Physical placement: `left`, `top`, `bottom`, or `right`. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns immediate hover and focus disclosure, Escape closure, synchronized controlled open state, text direction, and physical side placement. Tooltip content is descriptive, non-interactive, and never receives focus. AngularTS remains responsible for application state and the trigger action.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

The trigger exposes `aria-describedby` while the content uses `role="tooltip"`. Tooltips open from hover and keyboard focus, close on Escape, and must not contain interactive controls or essential information. Wrap a disabled button in a hoverable trigger only when its unavailable state needs explanation.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-tooltip]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
