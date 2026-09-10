---
title: disclosure
category: "disclosure"
description: >
  HTML-first disclosure state and trigger/panel relationships
---

Native `details` and `summary` own click, keyboard, focus, and disclosure state.
AngularCSS only styles the authored structure. AngularTS may observe native
events when the application needs the state.

```html
<details class="disclosure">
  <summary>Order details</summary>
  <div>Shipping address and item details.</div>
</details>
```

## Example

{{< example src="examples/components/disclosure.html" title="Order details" height="360" >}}

## Basic, settings, and RTL

{{< example src="examples/components/disclosure-workflows.html" title="Disclosure reference workflows" height="900" >}}

## File tree

{{< example src="examples/components/disclosure-compositions.html" title="Nested disclosure file tree" height="720" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native details and summary disclosure.

## Anatomy

### Root styling selector

- `.disclosure`

### Semantic structure

Apply `.disclosure` to a native `details` element with a direct `summary` followed by authored content. No nested AngularCSS attributes are required.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `open` | Authored | Initial or controlled open state. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native `details` and `summary` own disclosure, focus, and keyboard behavior. Use `open` for initial state and AngularTS only when application state must observe or control the native element. AngularCSS registers no disclosure directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a direct `summary` as the accessible trigger. The browser exposes disclosure state and provides Enter and Space activation without authored roles or ARIA state.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
