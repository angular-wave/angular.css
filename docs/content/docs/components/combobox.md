---
title: combobox
category: "form overlay"
description: >
  Search input with selectable options
---

Compose a searchable listbox with one `ng-combobox` root and semantic child
elements identified by combobox part classes. AngularTS `ng-model`, filters, and
event expressions remain the source of truth for query and selected-value state.
AngularCSS supplies popup disclosure, active-descendant navigation, disabled
handling, collision placement, and visual state.

```html
<div
  ng-combobox
  ng-on-angularcss:combobox-select="selected=$event.detail.value; query=selected"
>
  <header>
    <input
      aria-label="Framework"
      ng-model="query"
      placeholder="Select a framework"
    />
    <button type="button" aria-label="Show frameworks" value="toggle"></button>
  </header>
  <aside aria-label="Framework options">
    <p>No items found.</p>
    <div>
      <ul>
        <li
          ng-repeat="framework in frameworks | filter:query"
          data-value="{{ framework }}"
          ng-attr-aria-selected="{{ selected === framework }}"
        >
          {{ framework }}
        </li>
      </ul>
    </div>
  </aside>
</div>
```

Add `auto-highlight` when opening or filtering should highlight the first
enabled result. Without it, the popup opens without an active option until the
user presses an arrow key. Bind `angularcss:combobox-open-change` when the root
uses controlled `open="{{ state.open }}"` state.

For multiple selection, add `multiple`, render chips from AngularTS state, and
bind each option's `aria-selected` value. Selection events include
`multiple: true`; `angularcss:combobox-remove-last` only signals Backspace on an
empty chip input. AngularCSS never replaces the application's collection.

## Example

{{< example src="examples/components/combobox.html" title="Combobox example" height="620" >}}

## Reference Workflows

Clear, disabled, grouped, input-addon, invalid, and separate popup-trigger
compositions are functional in this artifact. Put the selected-value label
inside the direct toggle button. When a composition needs a compact button
inside an input shell, use a direct native button.

{{< example src="examples/components/combobox-workflows.html" title="Combobox workflows" height="980" >}}

## Custom, Multiple, And RTL

Custom option content and chip collections remain ordinary authored HTML and
AngularTS application state.

{{< example src="examples/components/combobox-compositions.html" title="Combobox compositions" height="620" >}}

## Controlled State

The state artifact covers controlled disclosure, disabled-option skipping, Home
and End navigation, dynamic options, and outside dismissal.

{{< example src="examples/components/combobox-state-workflows.html" title="Combobox state workflows" height="520" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-combobox]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-combobox`

### Semantic structure

A combobox root requires one input and one options surface. The root directive inspects semantic headers, sections, lists, options, fieldsets, and buttons; no child directives or anatomy classes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-activedescendant` | Output | ID of the active option while focus remains on the composite control. |
| `aria-autocomplete` | Input/output | How a text control presents completion suggestions. |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | Type of popup controlled by the trigger. |
| `aria-hidden` | Input/output | Whether generated or collapsed content is hidden from assistive technology. |
| `aria-invalid` | Input | Validation state exposed to assistive technology and CSS. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `aria-multiselectable` | Output | Whether the composite allows multiple selected items. |
| `aria-orientation` | Output | Interaction axis exposed to assistive technology. |
| `aria-selected` | Input/output | Selected item state. |
| `auto-highlight` | Input | Highlights the first enabled result when the popup opens or filters change. |
| `data-highlighted` | Output | Current option highlighted for keyboard selection. |
| `data-value` | Input | Application value reported when the corresponding option is selected. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Input | Native visibility state observed when finding available items. |
| `multiple` | Input | Keeps the popup open and reports selections for an application-owned collection. |
| `open` | Input/output | Initial or externally synchronized disclosure state. |
| `required` | Input | Marks a native form value as required. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `side` | Output | Physical placement: `left`, `top`, `bottom`, or `right`. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--combobox-anchor-width` | Component styling variable. |
| `--combobox-content-top` | Component styling variable. |

### DOM events

- `angularcss:combobox-clear`
- `angularcss:combobox-open-change`
- `angularcss:combobox-remove-last`
- `angularcss:combobox-select`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns disclosure, collision-aware placement, active-descendant navigation, enabled-option boundaries, Escape and outside dismissal, and selection, clear, remove-last, and open-change signaling. AngularTS remains responsible for query filtering, selected values and collections, controlled open state, validation, and structural bindings such as `ng-repeat`, `ng-if`, and `ng-model`.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the input an accessible name. The input exposes combobox, expanded, controls, autocomplete, invalid, disabled, and active-descendant state connected to a listbox. Arrow keys, Home, End, Enter, Escape, and Tab operate on enabled visible options; labeled groups retain group relationships, multiple listboxes expose `aria-multiselectable`, and text direction is mirrored to the popup.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-combobox]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
