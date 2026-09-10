---
title: master-detail
category: "layout"
description: >
  Resizable record list and detail workspace
---

Compose Resizable with semantic navigation and an article to browse records
without losing context. AngularTS or routing owns the selected record and data.

## Example

{{< example src="examples/components/master-detail.html" title="Customer master-detail workspace" height="560" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Responsive record list and detail workspace.

## Anatomy

### Root styling selector

- `.master-detail`

### Semantic structure

Apply `.master-detail` and `ng-resizable-panel-group` to the same root. Use two direct sections separated by a labeled `hr`; place semantic navigation in the first and record content in the second.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `orientation` | Authored | Resizable panel axis: `horizontal` or `vertical`; the recipe stacks on narrow viewports. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Master–Detail composes Resizable with semantic navigation and record content. The application owns record selection, routing, data loading, responsive overlay policy, and persistence of panel sizes.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a labeled navigation landmark for the master list and a semantic article for detail content. Resizable handles retain separator semantics, while narrow layouts preserve the same reading order.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
