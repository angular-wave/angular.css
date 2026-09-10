---
title: menubar
category: "menu"
description: >
  Keyboard-first top-level navigation with open/close menu behavior.
---

Use `ng-menubar` around a strip of menu groups. Menu triggers support:

- `ArrowLeft`/`ArrowRight` to move between menus
- `Enter`/`Space`/`ArrowDown` to open a menu
- `Escape` to close menus
- `Home`/`End` shortcuts when a trigger is focused

```html
<nav ng-menubar aria-label="Application menu">
  <section>
    <button>File</button>
    <menu>
      <button>New</button>
      <button>Open</button>
    </menu>
  </section>
  <section>
    <button>Edit</button>
  </section>
</nav>
```

## Example

{{< example src="examples/components/menubar.html" title="Menubar example" height="360" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-menubar]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-menubar`

### Semantic structure

Each top-level section requires one native button trigger and one `menu`. The root directive inspects semantic sections, fieldsets, buttons, separators, keyboard hints, and nested details; no child directives or anatomy classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-checked` | Input/output | ARIA relationship or state. |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | Type of popup controlled by the trigger. |
| `aria-hidden` | Output | Whether generated or collapsed content is hidden from assistive technology. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `open` | Input | Initial or controlled open state. |
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

The directive owns top-level roving focus, menu and submenu disclosure, enabled-item navigation, Escape and outside-click closure, DOM-order synchronization for dynamically inserted menus, and direction-aware horizontal keys. AngularTS remains responsible for command execution, checkbox and radio values, and structural content such as `ng-if`.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

The root exposes `role="menubar"` and keeps one enabled top-level trigger in the tab order. Triggers identify their menus with `aria-controls`; disabled triggers and items are skipped. Arrow keys follow visual direction, submenu keys remain local to the submenu, and Escape restores focus to the active trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-menubar]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
