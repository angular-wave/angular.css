---
title: tree
category: "navigation"
description: >
  Hierarchical navigation and selection
---

Add `ng-tree` to a nested native list. The root directive supplies the
hierarchical focus, expansion, selection, and typeahead behavior that HTML does
not provide by itself.

## Example

{{< example src="examples/components/tree.html" title="Organization tree" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-tree]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-tree`

### Semantic structure

Apply `ng-tree` to a native `ul` or `ol`. Each direct or nested `li` contains one direct text `span` followed by an optional nested list; no child directives or tree part classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Input/output | Open or expanded state exposed to assistive technology. |
| `aria-label` | Input | Accessible name when visible text is insufficient. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `aria-multiselectable` | Input | Set to `true` to allow Ctrl or Command click selection of several items. |
| `aria-selected` | Input/output | Selected item state. |
| `data-value` | Input | Application value included in `angularcss:tree-select`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Input | Native visibility state observed when finding available items. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

- `angularcss:tree-select`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Tree owns hierarchical roving focus, expansion, typeahead, selection state, and selection signaling. AngularTS owns node data, rendering, permissions, lazy loading, and the selected application record.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use nested native lists with one direct text span per item. The directive supplies tree, group, and treeitem semantics, expanded and selected state, roving focus, arrow navigation, Home, End, and typeahead.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-tree]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
