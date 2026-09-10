---
title: breadcrumb
category: "navigation"
description: >
  Page location navigation
---

Use a `.breadcrumb` navigation landmark with a native ordered list, links,
separators, and `aria-current="page"` for the current location. The class
distinguishes the trail from other navigation landmarks.

```html
<nav aria-label="breadcrumb" class="breadcrumb">
  <ol>
    <li>
      <a href="#">Home</a>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <span aria-current="page">Docs</span>
    </li>
  </ol>
</nav>
```

## Example

{{< example src="examples/components/breadcrumb.html" title="Breadcrumb example" height="160" >}}

## Variants And Composition

Empty separator and ellipsis parts receive their standard icons. Author custom
separator content directly, and compose dropdowns with the existing semantic
Dropdown component.

{{< example src="examples/components/breadcrumb-workflows.html" title="Breadcrumb variants and composition" height="1024" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native navigation and list composition.

## Anatomy

### Root styling selector

- `.breadcrumb`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-current` | Authored | Current item or date state. |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native navigation and list composition. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use semantic navigation landmarks and links. Expose the current destination with `aria-current` and keep keyboard order consistent with visual order.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
