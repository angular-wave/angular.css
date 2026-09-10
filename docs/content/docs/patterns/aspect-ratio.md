---
title: aspect-ratio
category: "layout"
description: >
  Fixed-ratio media wrapper
---

Set `ratio` on a `figure` and optionally override `--ratio`. Direct images,
videos, and iframes fill the figure with `object-fit: cover`; applications may
override that fit when media should not crop.

```html
<figure ratio="16 / 9">
  <img src="photo.jpg" alt="Photo" />
</figure>
```

## Example

{{< example src="examples/components/aspect-ratio.html" title="Aspect ratio example" height="320" >}}

## Ratios And Direction

{{< example src="examples/components/aspect-ratio-workflows.html" title="Aspect ratio variants" height="816" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. CSS aspect-ratio layout.

## Anatomy

### Root styling selector

- `figure[ratio]`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `ratio` | Authored | Aspect ratio: `1 / 1`, `9 / 16`, or `16 / 9`; defaults to `16 / 9`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--ratio` | Rendered aspect ratio; defaults to `16 / 9`. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

CSS aspect-ratio layout. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

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
