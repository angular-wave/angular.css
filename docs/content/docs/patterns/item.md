---
title: item
category: "layout"
description: >
  Flexible list item primitive
---

Items compose media, content, title, description, and actions.

```html
<div variant="outline" class="item">
  <section>
    <h3>Item title</h3>
    <p>Supporting description.</p>
  </section>
</div>
```

## Example

{{< example src="examples/components/item.html" title="Item example" height="360" >}}

## Workflows

{{< example src="examples/components/item-workflows.html" title="Item workflows" height="3900" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Semantic repeated-content composition.

## Anatomy

### Root styling selector

- `.item`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `size` | Authored | Item density: `xs` or `sm`; omit for the default size. |
| `variant` | Authored | Item surface: `outline` or `muted`; direct figures additionally accept `icon` or `image`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Semantic repeated-content composition. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

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
