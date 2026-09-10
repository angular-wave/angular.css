---
title: button
category: "action"
description: >
  Action controls with `variant` and `size` styling hooks.
---

Native `button` elements and button-type inputs are styled directly. Set
`variant`/`size` attributes for variants and spacing. A link may opt into the
same presentation with a `variant` attribute when it navigates to another
location.

```html
<div class="row">
  <button>Default</button>
  <button variant="outline">Outline</button>
  <button size="sm">Small</button>
</div>
```

## Example

{{< example src="examples/components/button.html" title="Button examples" height="260">}}

## Variant workflows

{{< example src="examples/components/button-workflows.html" title="Button variants, sizes, loading, and RTL" height="480">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native button and link activation.

## Anatomy

### Root styling selector

- `button`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Authored | Semantic disabled state. |
| `aria-haspopup` | Authored | Type of popup controlled by the trigger. |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `icon` | Authored | Icon position: `inline-start` or `inline-end`. |
| `size` | Authored | Size: `xs`, `sm`, `default`, `lg`, `icon-xs`, `icon-sm`, `icon`, or `icon-lg`. |
| `variant` | Authored | Style: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `info`, `success`, or `warning`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native button and link activation. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

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
