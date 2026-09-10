---
title: stepper
category: "navigation"
description: >
  Ordered multi-step workflow navigation
---

Present workflow progress as an ordered list inside navigation. The current step
is authored with `aria-current="step"`; routing and workflow state remain
application-owned.

## Example

{{< example src="examples/components/stepper.html" title="Customer creation steps" height="300" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native ordered workflow navigation.

## Anatomy

### Root styling selector

- `nav:has([aria-current="step"])`

### Semantic structure

Use a native `nav` containing one direct ordered list. Each item contains a link or text span, and `aria-current=step` on the current item identifies the Stepper without a class.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-current` | Authored | Current item or date state. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Stepper styles native ordered navigation and derives completed presentation from the authored current step. AngularTS or routing owns workflow progress and whether a destination is available.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use an ordered list inside a labeled navigation landmark. Apply `aria-current=step` to exactly one link or text label and do not make unavailable steps interactive.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
