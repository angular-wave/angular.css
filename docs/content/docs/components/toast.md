---
title: toast
category: "feedback"
description: >
  Notification toaster with close actions and toast variants.
---

Use `ng-toast` on the container; direct `article` children are toast items. Application
code owns toast creation and queueing. Set `type` or `variant` to `success`,
`info`, `warning`, `error`, or `loading`; the directive mirrors the result to
`data-type` for styling.

```html
<div ng-toast>
  <article type="success">
    <article>
      <article>Saved</article>
      <article>Update published.</article>
    </article>
  </article>
</div>
```

Toast titles and descriptions are connected through `aria-labelledby` and
`aria-describedby`. Authored relationships are preserved. Toast action and close
buttons default to `type="button"`, so they do not submit an enclosing form.

## Example

{{< example src="examples/components/toast.html" title="Toast example" height="250" >}}

## Reference workflows

The workflow page exercises description, all six positions, notification types,
and the loading-to-success promise transition. Its controller is compiled from
TypeScript; AngularCSS does not own the application queue or asynchronous state.

{{< example src="examples/components/toast-workflows.html" title="Toast reference workflows" height="1200" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-toast]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-toast`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-atomic` | Input/output | Whether an assistive technology announces the entire updated region. |
| `aria-describedby` | Input/output | ID of the element that supplies the accessible description. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `aria-labelledby` | Input/output | ID of the element that supplies the accessible name. |
| `aria-live` | Input/output | Announcement priority for updates to a live region. |
| `position` | Input/output | Viewport placement: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, or `bottom-right`. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `type` | Input/output | Toast state: `default`, `error`, `info`, `loading`, `success`, or `warning`. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive exposes presentation and announcement state. The application decides when feedback appears, changes, or is removed.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use the appropriate live-region or status semantics for dynamic feedback. Decorative feedback must stay hidden from assistive technology.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-toast]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
