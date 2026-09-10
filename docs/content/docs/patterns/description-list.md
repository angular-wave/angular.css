---
title: description-list
category: "data display"
description: >
  Semantic record details
---

Use a native description list for stable record labels and values. AngularCSS
adds responsive row presentation without changing the relationship between terms
and descriptions.

## Example

{{< example src="examples/components/description-list.html" title="Customer details" height="360" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native description-list structure for record details.

## Anatomy

### Root styling selector

- `dl:has(> div > dt):has(> div > dd)`

### Semantic structure

Use a native `dl` and wrap each related `dt` and `dd` group in a direct `div` so rows adapt without any component or part classes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `orientation` | Authored | Row layout: `horizontal` or `vertical`; omit to become vertical on narrow viewports. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Description List styles native terms and descriptions for record details. The application owns values, formatting, redaction, and conditional rendering.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use native `dl`, `dt`, and `dd` elements. Group each term and its descriptions in a `div` when row styling is needed, and keep sensitive values subject to application authorization.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
