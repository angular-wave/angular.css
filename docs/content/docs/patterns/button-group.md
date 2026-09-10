---
title: button-group
category: "action"
description: >
  Layout primitive for visually connected buttons and form controls.
---

Use `fieldset[role="group"]` around related commands or form controls. Set
`orientation="vertical"` for stacked groups. Use Toggle Group when the controls
represent one or more selectable values.

```html
<fieldset role="group">
  <button>One</button>
  <hr />
  <button>Two</button>
</fieldset>
```

## Example

{{< example src="examples/components/button-group.html" title="Button group examples" height="480">}}

## Composition Workflows

Button groups can connect nested groups, inputs, input groups, Select, Dropdown,
and Popover triggers. Each composed component retains its own behavior and
application state.

{{< example src="examples/components/button-group-workflows.html" title="Button group composition workflows" height="1800">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Grouped native actions.

## Anatomy

### Root styling selector

- `[role="group"]`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-orientation` | Authored | Use `vertical` on a direct separator when it divides controls along the inline axis. |
| `orientation` | Authored | Group layout: `vertical`; omit for the horizontal layout. |
| `role` | Authored | Explicit semantic role when native HTML does not provide one. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Grouped native actions. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `button` whenever the control performs an action. Keep an accessible name, preserve visible focus, and use `disabled` for unavailable native controls.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
