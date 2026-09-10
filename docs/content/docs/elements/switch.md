---
title: switch
category: "form"
description: >
  Toggleable control with semantic switch state attributes.
---

Use `role="switch"` on a native checkbox. The browser and AngularTS own its
checked state, validation, and form behavior.

```html
<div orientation="horizontal" class="field">
  <input id="airplane-mode" type="checkbox" role="switch" />
  <label for="airplane-mode">Airplane mode</label>
</div>
```

## Example

{{< example src="examples/components/switch.html" title="Switch example" height="220">}}

## Reference Workflows

{{< example src="examples/components/switch-workflows.html" title="Switch workflows" height="980">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native checkbox state with switch presentation.

## Anatomy

### Root styling selector

- `input[type="checkbox"][role="switch"]`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `checked` | Authored | Initial native checked state. |
| `disabled` | Authored | Disables native or component interaction. |
| `required` | Authored | Marks a native form value as required. |
| `role` | Authored | Explicit semantic role when native HTML does not provide one. |
| `size` | Authored | Switch size: `sm`; omit for the default size. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native checkbox state with switch presentation. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Preserve native required, disabled, and invalid semantics, and connect help or error text with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
