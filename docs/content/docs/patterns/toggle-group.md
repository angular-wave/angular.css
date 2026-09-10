---
title: toggle-group
category: "action"
description: >
  Native radio or checkbox groups with a toggle-button presentation.
---

Use radios sharing a name for single selection, or checkboxes for independent
multiple selection.

```html
<fieldset variant="outline" class="toggle-group">
  <legend class="visually-hidden">Alignment</legend>
  <label>
    <input type="radio" name="alignment" value="left" ng-model="alignment" />
    Left
  </label>
  <label>
    <input type="radio" name="alignment" value="center" ng-model="alignment" />
    Center
  </label>
</fieldset>
```

## Example

{{< example src="examples/components/toggle-group.html" title="Toggle group example" height="180" >}}

## Workflows

{{< example src="examples/components/toggle-group-workflows.html" title="Toggle group state and layout workflows" height="1260" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native radio or checkbox grouping.

## Anatomy

### Root styling selector

- `.toggle-group`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `orientation` | Authored | Group layout: `vertical`; omit for the horizontal layout. |
| `size` | Authored | Control size: `sm` or `lg`; omit for the default size. |
| `spacing` | Authored | Gap in spacing units: `1` or `2`; omit to join controls. |
| `variant` | Authored | Control presentation: `outline`; omit for the default style. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--toggle-group-gap` | Gap between controls; defaults to `0`. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Toggle Group is a styling-only native `fieldset`: use radios sharing a `name` for single selection and checkboxes for multiple selection. The browser owns selection, arrow-key radio navigation, disabled state, focus, validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no toggle-group directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `button` whenever the control performs an action. Keep an accessible name, preserve visible focus, and use `disabled` for unavailable native controls.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
