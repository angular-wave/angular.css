---
title: input-group
category: "form"
description: >
  Grouped input controls and addon content with shared focus/description wiring.
---

Use `.input-group` with one native control and optional authored addons, text,
and buttons. AngularTS continues to own the model and actions.

```html
<div class="input-group">
  <input id="search" placeholder="Search" />
  <label for="search" align="inline-start">Search</label>
  <div align="inline-end">⌘K</div>
</div>
```

## Example

{{< example src="examples/components/input-group.html" title="Input group example" height="260" >}}

## Reference Workflows

These packaged examples cover default, disabled, invalid, inline, text, icon,
keyboard-hint, label, Button Group, and Card compositions.

{{< example src="examples/components/input-group-workflows.html" title="Input group workflows" height="2200" >}}

## Interactive Compositions

Buttons, dropdown menus, tooltips, popovers, calling-code selection, and mixed
Button Group compositions run from AngularTS bindings in the built artifact.

{{< example src="examples/components/input-group-compositions.html" title="Interactive input group compositions" height="1050" >}}

## Textarea And Block Addons

Block-start and block-end addons, textarea states, a code editor, character
counters, and the autosizing custom control remain native form controls.

{{< example src="examples/components/input-group-textarea-workflows.html" title="Input group textarea workflows" height="1750" >}}

## Right To Left

Logical addon placement and AngularTS model updates work without RTL-specific
component markup.

{{< example src="examples/components/input-group-rtl.html" title="Right-to-left input groups" height="560" >}}

## Addon States

Visible addons participate in the control description. AngularCSS preserves
external description IDs as AngularTS inserts or hides addon content.

{{< example src="examples/components/input-group-state-workflows.html" title="Input group addon and button states" height="780" >}}

Clicking a non-button addon focuses the grouped control. Interactive addon
content remains responsible for its own native or composed behavior.

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Grouped native controls and addons.

## Anatomy

### Root styling selector

- `.input-group`

### Semantic structure

Use one native input, textarea, select, combobox, or spinbutton inside `.input-group`. Addons may be placed at inline-start, inline-end, block-start, or block-end with `align`. Buttons, menus, tooltips, and popovers retain their own behavior.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Authored | Direct addon placement: `inline-start`, `inline-end`, `block-start`, or `block-end`. |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `border` | Authored | Use `true` on a direct block addon to draw its dividing border. |
| `size` | Authored | Direct action size: `sm`, `icon-xs`, or `icon-sm`; omit for the compact addon action. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Input Group is styling-only. Native controls own focus, values, validation, and submission. Use a native `label` addon when clicking addon text should focus the control; AngularTS owns dynamic text and actions.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Keep one clearly labeled native control in each group. Use `aria-describedby` for explanatory addon text, `aria-hidden` for decorative text, and a native `label for` when an addon should focus the control.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
