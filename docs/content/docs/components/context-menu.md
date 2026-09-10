---
title: context-menu
category: "menu"
description: >
  Context menu surface and items
---

Use a semantic trigger and content surface. AngularCSS owns right-click and
keyboard disclosure, pointer placement, menu focus, and submenu navigation;
AngularTS owns actions and checkbox or radio values.

```html
<div ng-context-menu>
  <div>Right click here</div>
  <menu aria-label="Browser actions">
    <button ng-click="reload()">Reload</button>
    <button
      aria-checked="{{ showBookmarks }}"
      ng-click="showBookmarks=!showBookmarks"
    >
      Show Bookmarks Bar
    </button>
  </menu>
</div>
```

Ordinary click is left to the authored trigger. Right-click, Shift F10, and the
Context Menu key open this component.

## Basic And Submenu

## Example

{{< example src="examples/components/context-menu.html" title="Context menu example" height="420">}}

## Content And State

Icons, destructive actions, groups, shortcuts, checkbox values, and radio values
are functional packaged scenarios.

{{< example src="examples/components/context-menu-workflows.html" title="Context menu content and state workflows" height="800">}}

## Placement

The six physical and logical side options anchor to the invocation point and
remain constrained to the viewport.

{{< example src="examples/components/context-menu-sides.html" title="Context menu side placement" height="650">}}

## Right To Left

{{< example src="examples/components/context-menu-rtl.html" title="Right-to-left context menu" height="420">}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-context-menu]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-context-menu`

### Semantic structure

A context menu root requires one focusable trigger and one `menu`. The root directive inspects semantic sections, fieldsets, buttons, separators, keyboard hints, and nested details; no child directives or anatomy classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Input/output | Cross-axis alignment: `start`, `center`, or `end`. |
| `align-offset` | Input | Additional alignment offset in CSS pixels. |
| `aria-checked` | Input/output | ARIA relationship or state. |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | Type of popup controlled by the trigger. |
| `aria-hidden` | Output | Whether generated or collapsed content is hidden from assistive technology. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `open` | Input | Initial or controlled open state. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `side` | Input/output | Physical placement: `left`, `top`, `bottom`, or `right`. |
| `side-offset` | Input | Distance from the invocation point in CSS pixels. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--context-menu-available-height` | Component styling variable. |
| `--context-menu-left` | Component styling variable. |
| `--context-menu-top` | Component styling variable. |

### DOM events

- `angularcss:context-menu-select`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns right-click and keyboard disclosure, cursor-relative side placement with viewport collision constraints, menu and submenu focus movement, disabled-item skipping, Escape and outside dismissal, direction-aware submenu keys, semantic roles, and open-state reflection. AngularTS remains responsible for command execution, checkbox and radio values, controlled application state, and structural rendering.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the trigger and menu useful accessible names. The trigger exposes `aria-haspopup`, `aria-controls`, and expanded state; items receive menuitem, menuitemcheckbox, or menuitemradio roles; groups and separators remain semantic; disabled items are skipped. Shift+F10 or the Context Menu key opens from the keyboard, arrow keys move focus, logical submenu keys follow text direction, and Escape restores focus.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-context-menu]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
