---
title: pagination
category: "navigation"
description: >
  Page navigation links
---

Use `nav` with `aria-label="pagination"` and mark the current page with
`aria-current="page"`.

```html
<nav aria-label="pagination" class="pagination">
  <ul>
    <li>
      <a href="#">1</a>
    </li>
    <li>
      <a aria-current="page" href="#">2</a>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/components/pagination.html" title="Pagination example" height="200" >}}

## Workflows

{{< example src="examples/components/pagination-workflows.html" title="Pagination workflow variants" height="720" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native navigation, lists, and links.

## Anatomy

### Root styling selector

- `.pagination`

### Semantic structure

Apply `.pagination` to a native `nav` containing a `ul` or `ol` with direct `li` children. The class distinguishes Pagination from other navigation landmarks; page, previous, and next controls remain native links. Ellipsis is optional. Compose rows-per-page controls beside Pagination with existing native form components; Pagination does not own that model.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-current` | Authored | Current item or date state. |
| `aria-disabled` | Authored | Semantic disabled state. |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `rel` | Authored | Use the `prev` or `next` link type for directional pagination controls. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native navigation, lists, list items, and links own pagination semantics and navigation. URLs, routing, page counts, rows-per-page values, and current-page application state remain AngularTS or application concerns. AngularCSS registers no pagination directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `nav` landmark with an accessible label, a native list, and native links. Expose exactly one current destination with `aria-current="page"`. Previous and next links need destination-specific accessible names; ellipsis is decorative and removed from the accessibility tree.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
