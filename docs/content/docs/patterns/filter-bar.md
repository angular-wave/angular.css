---
title: filter-bar
category: "form"
description: >
  Search and filter controls for data views
---

Use a native form to collect a data view's search and filter values. Submit,
reset, AngularTS binding, and backend queries keep their existing ownership.

## Example

{{< example src="examples/components/filter-bar.html" title="Order filters" height="300">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Semantic search and filter form.

## Anatomy

### Root styling selector

- `form[role="search"]:has(> fieldset + menu)`

### Semantic structure

Use `role="search"` on a native form with a direct fieldset followed by a direct action menu. Put labeled controls in the fieldset and submit or reset actions in the menu.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `role` | Authored | Explicit semantic role when native HTML does not provide one. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Filter Bar is a native form composition. The browser and AngularTS own control values and submission; the backend may remain authoritative for queries, result counts, and pagination.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native form and fieldset with accessible labels. Submit applies the query, reset restores defaults, and result changes should be announced near the results they affect.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
