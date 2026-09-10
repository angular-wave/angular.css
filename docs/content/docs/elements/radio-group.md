---
title: radio-group
category: "form"
description: >
  Native radio input grouping with role and focus behavior.
---

Use a native `fieldset` with a `legend` and radio inputs. AngularCSS recognizes
the semantic group and styles its native radio descendants directly.

```html
<fieldset>
  <div class="field" orientation="horizontal">
    <input id="default" name="density" type="radio" value="default" />
    <label for="default">Default</label>
  </div>
</fieldset>
```

## Example

{{< example src="examples/components/radio-group.html" title="Radio group example" height="240">}}

## Reference Workflows

{{< example src="examples/components/radio-group-workflows.html" title="Radio group workflows" height="1320">}}

## Field Compositions

{{< example src="examples/components/radio-fields.html" title="Radio fields" height="1180">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native fieldset and radio behavior.

## Anatomy

### Root styling selector

- `fieldset:has(input[type="radio"]):not(.toggle-group)`

### Semantic structure

Use a native `fieldset` with a `legend`. Place labeled `input type="radio"` controls inside it and give related controls the same `name`. AngularCSS styles the fieldset from that semantic structure.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `checked` | Authored | Initial native checked state. |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Authored | Disables native or component interaction. |
| `name` | Authored | Authored HTML attribute or styling hook. |
| `required` | Authored | Marks a native form value as required. |
| `value` | Authored | Native value or authored component value. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A native `fieldset` and `legend` group radio inputs sharing one `name`. The browser owns selection, arrow-key behavior, disabled state, validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no radio-group directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use native radio inputs with a shared `name` and an explicit label for every control. Use `fieldset` and `legend` for a visible group label when appropriate. Preserve native disabled and invalid semantics, and connect supporting descriptions with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
