---
title: input
category: "form"
description: >
  Native form text entry styled directly by AngularCSS.
---

Use a native `input`. AngularCSS styles data-entry input types directly, while
the browser and AngularTS own values, events, validation, required state,
disabled state, and form behavior.

```html
<input placeholder="Jane Doe" /> <input placeholder="Disabled" disabled />
```

Use the native `size` attribute when a compact control should size to its
content. The control retains a `max-width` of `100%`; browsers without
`field-sizing` use the requested number of visible characters.

```html
<input value="Compact" size="7" />
```

## Example

{{< example src="examples/components/input.html" title="Input examples" height="220">}}

## Workflows

{{< example src="examples/components/input-workflows.html" title="Input workflows" height="1900">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native input behavior and AngularTS models.

## Anatomy

### Root styling selector

- `input:not([type="button"], [type="checkbox"], [type="color"], [type="hidden"], [type="image"], [type="radio"], [type="range"], [type="reset"], [type="submit"])`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `disabled` | Authored | Disables native or component interaction. |
| `size` | Authored | Native number of visible characters; also enables content sizing when supported. |
| `type` | Authored | Native input kind, such as `text`, `email`, `password`, `number`, `search`, `tel`, or `url`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Input is a native control styled directly by element and type. AngularTS and the browser own value, events, model synchronization, validation, disabled and required state, and form submission. AngularCSS registers no input directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native input with a visible label. Preserve native type, name, autocomplete, required, disabled, and validation semantics; use AngularTS `ng-model` for application state and `aria-invalid` when application validation must be exposed explicitly.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
