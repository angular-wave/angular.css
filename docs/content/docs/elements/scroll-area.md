---
title: scroll-area
category: "layout"
description: >
  A semantic native overflow region with styled scrollbars.
---

Apply `.scroll-area` to a bounded semantic region. Add `tabindex="0"` when the
region should be directly reachable by keyboard.

```html
<section class="scroll-area" tabindex="0" aria-label="Release notes">
  <p>Scrollable content goes here.</p>
</section>
```

The browser owns keyboard, wheel, touch, pointer, RTL, and scrollbar behavior.
AngularTS may add or remove content; native layout updates overflow geometry.

## Example

{{< example src="examples/components/scroll-area.html" title="Scroll area example" height="300" >}}

## Workflows

{{< example src="examples/components/scroll-area-workflows.html" title="Scroll area layout and state workflows" height="1260" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native overflow and scrolling.

## Anatomy

### Root styling selector

- `.scroll-area`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `tabindex` | Authored | Use `0` when the overflow region itself must be reachable by keyboard. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A focusable semantic region with `overflow: auto` uses the browser's native scrolling, keyboard behavior, pointer interaction, direction handling, and scrollbar geometry. AngularTS may insert or remove content; native layout updates the overflow automatically. AngularCSS registers no scroll-area directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Prefer semantic landmarks and native elements inside the layout. Any interactive handles or triggers must retain an accessible name and visible focus indicator.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
