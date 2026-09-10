---
title: alert
category: "feedback"
description: >
  Compact feedback blocks for status and context.
---

Use `section[role="alert"]` for important feedback blocks. The default presentation is
neutral; add `variant="destructive"` for destructive feedback or override the
AngularCSS color tokens for application-specific colors.

```html
<section role="alert">
  <svg aria-hidden="true"><!-- optional icon --></svg>
  <h2>Saved!</h2>
  <p>Your profile was updated.</p>
  <div>
    <button ng-click="dismiss()">Dismiss</button>
  </div>
</section>
```

## Example

{{< example src="examples/components/alert.html" title="Alert examples" height="300">}}

## Variants And Composition

{{< example src="examples/components/alert-workflows.html" title="Alert variants and composition" height="792">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Semantic authored status content.

## Anatomy

### Root styling selector

- `[role="alert"]`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-atomic` | Authored | Whether an assistive technology announces the entire updated region. |
| `aria-live` | Authored | Announcement priority for updates to a live region. |
| `role` | Authored | Explicit semantic role when native HTML does not provide one. |
| `variant` | Authored | Status presentation: `info`, `success`, `warning`, or `destructive`; omit for the default presentation. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Semantic authored status content. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use the appropriate live-region or status semantics for dynamic feedback. Decorative feedback must stay hidden from assistive technology.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
