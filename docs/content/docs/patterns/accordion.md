---
title: accordion
category: "disclosure"
description: >
  Expandable content sections
---

Use an accessibly named `section` around native `details` elements. Give
sibling items the same `name` when opening one item should close the others.
The semantic structure needs no component class.

```html
<section aria-label="Sections">
  <details name="sections" open>
    <summary>Section 1</summary>
    <div>Content for section 1</div>
  </details>
</section>
```

Omit `name` to allow more than one section to remain open.

## Example

{{< example src="examples/components/accordion.html" title="Accordion example" height="330" >}}

## State Variants

{{< example src="examples/components/accordion-state-workflows.html" title="Accordion state variants" height="800" >}}

## Layout Variants

{{< example src="examples/components/accordion-layout-workflows.html" title="Accordion layout variants" height="1024" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Named native details disclosures.

## Anatomy

### Root styling selector

- `section[aria-label]:has(> details)`

### Semantic structure

Use an accessibly named `section` around direct `details` children. Each item requires a direct `summary` followed by authored content. Apply the same `name` to sibling details for exclusive disclosure.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `inert` | Authored | Prevents interaction while the component is hidden. |
| `name` | Authored | Authored HTML attribute or styling hook. |
| `open` | Authored | Initial or controlled open state. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native `details` and `summary` own disclosure, focus, and keyboard behavior. Give sibling details the same `name` for an exclusive accordion, or omit `name` when several panels may remain open. AngularCSS registers no accordion directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a direct `summary` as the accessible trigger for each `details` item. The browser exposes disclosure state and keyboard activation. Use `inert` only when an entire unavailable disclosure must be removed from interaction.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
