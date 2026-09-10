---
title: carousel
category: "media"
description: >
  Accessible drag and snap carousel powered by Embla
---

Use a required content viewport and track around authored slide items. The
TypeScript directive initializes the locally bundled Embla engine, synchronizes
controls and accessible state, and supports pointer dragging and keyboard
navigation.

```html
<section
  ng-carousel
  align="start"
  style="--carousel-item-size: 50%; --carousel-gap: 0.5rem"
>
  <div>
    <ul>
      <li>Slide</li>
    </ul>
  </div>
</section>
```

Use `orientation="vertical"` for vertical movement and `dir="rtl"` for RTL.
`--carousel-item-size` controls single or multi-item layouts and
`--carousel-gap` controls spacing. Add `autoplay` and optionally
`autoplay-delay="2000"` for the same locally bundled plugin behavior as the
checked-in reference. The root mirrors snap index, snap count, item count, and
boundary state.

`angularcss:carousel-ready` and `angularcss:carousel-change` expose the Embla
API, zero-based snap index, snap count, selected item index, selected item, and
total item count. Bind those events with AngularTS when the application needs a
counter; AngularCSS does not create or replace an AngularTS model.

## Example

{{< example src="examples/components/carousel.html" title="Carousel example" height="420" >}}

## Behavior workflows

The following functional page covers API state, multiple visible items, vertical
orientation, and autoplay.

{{< example src="examples/components/carousel-workflows.html" title="Carousel behavior workflows" height="1100" >}}

## Layout workflows

RTL direction, responsive item sizing, and custom spacing remain semantic HTML
and authored CSS composition.

{{< example src="examples/components/carousel-compositions.html" title="Carousel layout workflows" height="760" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-carousel]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-carousel`

### Semantic structure

The content viewport and its direct track child are required. Items must be direct track children. Navigation controls and dots are optional.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Input | Cross-axis alignment: `start`, `center`, or `end`. |
| `aria-current` | Output | Current item or date state. |
| `aria-disabled` | Output | Semantic disabled state. |
| `aria-hidden` | Output | Whether generated or collapsed content is hidden from assistive technology. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `aria-roledescription` | Output | Human-readable description of the component role. |
| `autoplay` | Input | Enables the locally bundled Embla autoplay plugin. |
| `autoplay-delay` | Input | Autoplay delay in milliseconds. |
| `contain-scroll` | Input | Embla scroll containment mode. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `drag-free` | Input | Allows free dragging between snap points. |
| `draggable` | Input | Set to `false` to disable pointer dragging. |
| `loop` | Input | Allows navigation to wrap from the final item to the first. |
| `orientation` | Input/output | Layout direction: `horizontal` or `vertical`. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `skip-snaps` | Input | Allows momentum to skip snap points. |
| `slides-to-scroll` | Input | Number of slides advanced as one snap group. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--carousel-gap` | Gap between slides; defaults to four spacing units. |
| `--carousel-item-size` | Slide basis; defaults to `100%`. |

### DOM events

- `angularcss:carousel-change`
- `angularcss:carousel-ready`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive uses Embla to own drag gestures, snap selection, orientation, loop boundaries, control availability, and optional autoplay. AngularTS remains responsible for counters, business actions, and other application state consumed from the carousel DOM events.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

The root is an accessible carousel region, every authored item is exposed as a labeled slide, and unavailable previous or next controls are disabled. Give the region a useful accessible name and keep authored slide content semantic.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-carousel]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
