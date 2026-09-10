---
title: badge
category: "feedback"
description: >
  Inline status and metadata labels with semantic variants.
---

Use `class="badge"` on an inline element and set `variant` for appearance.

```html
<span class="badge">Default</span>
<span variant="secondary" class="badge">Secondary</span>
<span variant="outline" class="badge">Outline</span>
```

For user-selected colors, use `variant="custom"` and set `--badge-background`.
Browsers with `contrast-color()` choose a black or white foreground; set
`--badge-foreground` when the application requires a specific contrast result.

```html
<span variant="custom" class="badge" style="--badge-background: var(--cyan-9)">
  Custom
</span>
```

## Example

{{< example src="examples/components/badge.html" title="Badge example" height="170" >}}

## Composition workflows

{{< example src="examples/components/badge-workflows.html" title="Badge colors, icons, links, loading, and RTL" height="340" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Styled inline authored content.

## Anatomy

### Root styling selector

- `.badge`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `icon` | Authored | Direct icon position: `inline-start` or `inline-end`. |
| `variant` | Authored | Presentation: `default`, `secondary`, `destructive`, `outline`, `ghost`, or `custom`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Styled inline authored content. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use the appropriate live-region or status semantics for dynamic feedback. Decorative feedback must stay hidden from assistive technology.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
