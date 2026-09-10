---
title: toolbar
category: "action"
description: >
  Keyboard-navigable groups of actions
---

Add `ng-toolbar` to a semantic action container. AngularCSS provides one tab
stop and arrow-key movement while native buttons, links, and AngularTS retain
activation and command ownership.

## Example

{{< example src="examples/components/toolbar.html" title="Document action toolbar" height="260">}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-toolbar]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-toolbar`

### Semantic structure

Apply `ng-toolbar` to a semantic `menu` or container with an accessible name. Use `aria-orientation="vertical"` for a vertical toolbar. Author direct native buttons or links and optional direct separators; no child directives or toolbar part classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-label` | Input | Accessible name when visible text is insufficient. |
| `aria-orientation` | Input/output | Interaction axis exposed to assistive technology. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Input | Native visibility state observed when finding available items. |
| `orientation` | Input | Layout direction: `horizontal` or `vertical`. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Toolbar owns one roving tab stop and direction-aware arrow, Home, and End navigation across direct native buttons and links. Native activation and AngularTS commands remain unchanged.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the toolbar an accessible name. Keep actions as native buttons or links, preserve visible focus, and avoid placing text inputs inside the roving-focus sequence.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-toolbar]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
