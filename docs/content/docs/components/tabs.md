---
title: tabs
category: "navigation"
description: >
  Tabbed content sections
---

Add `ng-tabs` to a section, place native buttons in its list, and follow the
list with direct semantic `section` or `article` panels. The directive assigns
tab roles, relationships, selection state, and keyboard navigation.

```html
<section ng-tabs>
  <menu>
    <button aria-selected="true">Overview</button>
  </menu>
  <section>Content</section>
</section>
```

## Example

{{< example src="examples/components/tabs.html" title="Tabs example" height="330" >}}

## Workflows

{{< example src="examples/components/tabs-workflows.html" title="Tabs state and layout workflows" height="1080" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-tabs]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-tabs`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-hidden` | Output | Whether generated or collapsed content is hidden from assistive technology. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `aria-orientation` | Input/output | Interaction axis exposed to assistive technology. |
| `aria-selected` | Input/output | Selected item state. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `orientation` | Input/output | Layout direction: `horizontal` or `vertical`. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive supplies navigation semantics and keyboard state where required. URLs, routing, current-page state, and navigation side effects remain application-owned.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use semantic navigation landmarks and links. Expose the current destination with `aria-current` and keep keyboard order consistent with visual order.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-tabs]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
