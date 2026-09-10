---
title: navigation-menu
category: "navigation"
description: >
  Site navigation with optional flyout content
---

Navigation menu is exposed as semantic `nav` markup with list, item, trigger,
link, and content parts.

```html
<nav ng-navigation-menu>
  <ul>
    <li>
      <button>Components</button>
      <section>Links</section>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/components/navigation-menu.html" title="Navigation menu example" height="620">}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-navigation-menu]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-navigation-menu`

### Semantic structure

Use a native `nav` containing one direct list. Each list item may contain either a native link or a native button trigger followed by a semantic section. The root directive needs no child directives or anatomy classes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Input | Cross-axis alignment: `start`, `center`, or `end`. |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Input/output | Whether generated or collapsed content is hidden from assistive technology. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `open` | Input | Initial or controlled open state. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--navigation-menu-content-offset` | Component styling variable. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns site-navigation disclosure, focus restoration, direction-aware arrow movement, dynamic DOM-order synchronization, outside dismissal, and flyout collision handling. Native links continue to own navigation. URLs, routing, current-page state, authored controlled state, and application commands remain AngularTS or application concerns.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `nav` landmark containing a list. Keep destinations as native links and disclosure controls as native buttons; do not add menu or menuitem roles to site navigation. Triggers expose `aria-expanded` and `aria-controls`, direct links remain in horizontal keyboard order, and Escape restores focus to the active trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-navigation-menu]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
