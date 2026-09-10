---
title: card
category: "layout"
description: >
  Sectioned content container using semantic parts.
---

Use `article.card` with optional semantic header, content, footer, and action
regions. Direct headers, headings, and header paragraphs need no part classes.

```html
<article class="card">
  <header>
    <h2>Title</h2>
    <p>Optional description</p>
    <menu>Action</menu>
  </header>
  <section>Content</section>
  <footer>Footer</footer>
</article>
```

## Example

{{< example src="examples/components/card.html" title="Card example" height="500" >}}

## Image And RTL

Card content remains ordinary semantic HTML. Use local images, logical CSS
properties, and AngularTS form or command directives for application state.

{{< example src="examples/components/card-workflows.html" title="Card image, small, and RTL compositions" height="1500" >}}

## Section States

Card sections are optional. CSS adapts spacing to the authored sections and
`size="sm"` attribute; no directive runs for a card.

{{< example src="examples/components/card-state-workflows.html" title="Card section and size states" height="700" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Semantic content composition.

## Anatomy

### Root styling selector

- `.card`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `size` | Authored | Use `sm` for compact spacing; omit for the default size. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--card-padding-block` | Block padding; defaults to four spacing units, or three for `size=sm`. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Semantic content composition. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

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
