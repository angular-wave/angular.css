---
title: command
category: "command palette"
description: >
  Command palette layout
---

Build a searchable command menu with one `ng-command` root and semantic child
elements identified by command part classes. AngularTS owns query filtering and
command execution. Command follows the rendered result DOM and supplies listbox
relationships, active-descendant navigation, disabled skipping, and
scroll-to-active behavior.

```html
<section ng-command variant="surface" aria-label="Command menu">
  <header>
    <label>
      <span aria-hidden="true"><!-- search icon --></span>
      <input
        aria-label="Search commands"
        ng-model="query"
        placeholder="Type a command or search..."
      />
    </label>
  </header>
  <div>
    <p>No results found.</p>
    <section>
      <h2>Suggestions</h2>
      <button
        type="button"
        ng-repeat="command in commands | filter:query"
        ng-click="selected=command.label"
      >
        <span ng-bind="command.label"></span>
        <kbd ng-bind="command.shortcut"></kbd>
      </button>
    </section>
  </div>
</section>
```

Use `aria-disabled="true"` or native `disabled` state for unavailable options.
Arrow keys wrap through enabled rendered options; Home and End move to the
boundaries; Enter activates the current option through its ordinary click
handler. Pointer movement updates the same active state.

For a modal palette, place the `ng-command` root inside a native `dialog` within
a `.dialog` wrapper. Use native invoker and close commands to open and close it.
The browser handles modal focus, Escape, configured light dismissal, and focus
restoration. Application
shortcuts such as Ctrl J remain AngularTS `ng-keydown` expressions.

## Example

{{< example src="examples/components/command.html" title="Command example" height="390">}}

## Dialog Workflows

Basic, grouped, shortcut-label, and application-owned Ctrl J dialog references
are functional packaged examples.

{{< example src="examples/components/command-dialog-workflows.html" title="Command dialog workflows" height="980">}}

## Scrollable

The full 23-item reference inventory demonstrates the 288px list constraint,
keyboard scroll-to-active behavior, filtering, and selection.

{{< example src="examples/components/command-scrollable.html" title="Scrollable command" height="700">}}

## RTL

Logical icon, text, shortcut, active-item, and keyboard order are preserved in
an Arabic command surface.

{{< example src="examples/components/command-rtl.html" title="RTL command" height="520">}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-command]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-command`

### Semantic structure

A command root requires one input and a result container. The root directive inspects semantic headers, sections, headings, buttons, separators, and keyboard hints; no child directives or anatomy classes are required. Compose modal palettes from Dialog.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-activedescendant` | Output | ID of the active option while focus remains on the composite control. |
| `aria-autocomplete` | Input/output | How a text control presents completion suggestions. |
| `aria-controls` | Output | ID of the element controlled by a trigger. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Input/output | Whether generated or collapsed content is hidden from assistive technology. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `aria-orientation` | Output | Interaction axis exposed to assistive technology. |
| `aria-selected` | Input/output | Selected item state. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Input | Native visibility state observed when finding available items. |
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

The directive follows the application-rendered result DOM and owns active-descendant navigation, enabled-option wrapping and boundaries, pointer synchronization, Enter activation through the authored click handler, semantic group and empty state, and scroll-to-active behavior. AngularTS remains responsible for query filtering, command execution, result data, structural bindings, and application keyboard shortcuts. Dialog remains responsible for modal disclosure, focus trapping, Escape, outside dismissal, and focus restoration.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the search input and command surface useful accessible names. The input is connected to a listbox through `aria-controls` and `aria-activedescendant`; rendered options expose selected and disabled state, labeled groups retain group relationships, separators are decorative structure, and shortcut labels are hidden from repeated announcement. A modal composition must include an accessible Dialog title and description.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-command]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
