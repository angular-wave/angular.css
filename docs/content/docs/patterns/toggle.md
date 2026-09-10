---
title: toggle
category: "action"
description: >
  Pressed-state button primitive with `aria-pressed` state.
---

Use a native button with authored `aria-pressed` state. That state identifies
the control as a toggle and supplies its styling hook.

```html
<button aria-pressed="true">Bold</button>
<button variant="outline" aria-pressed="false">Italic</button>
```

## Example

{{< example src="examples/components/toggle.html" title="Toggle example" height="360">}}

## Workflows

{{< example src="examples/components/toggle-workflows.html" title="Toggle disabled and RTL workflows" height="300">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native button pressed state.

## Anatomy

### Root styling selector

- `button[aria-pressed]`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Authored | Semantic disabled state. |
| `aria-pressed` | Authored | Pressed state of a toggle control. |
| `size` | Authored | Toggle size: `sm` or `lg`; omit for the default size. |
| `variant` | Authored | Toggle presentation: `outline`; omit for the default style. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native button pressed state. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

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
