---
title: data-table
category: "data display"
description: >
  Sortable and filterable semantic table composition
---

Compose Table, Filter Bar, Pagination, and native controls around backend-owned
rows. AngularCSS supplies the dense workspace presentation while AngularTS owns
local bindings and the backend owns data operations.

## Example

{{< example src="examples/components/data-table.html" title="Orders data table" height="520">}}

## Backend-driven states

The recipe keeps service state in authored HTML so applications can bind it to
their own requests and authorization model:

| State                     | HTML contract                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Loading                   | Set `aria-busy="true"` on `.data-table` and replace the table region with Spinner, Skeleton, or Progress content. |
| Empty                     | Keep a direct explanatory paragraph or compose Empty after the filtered `tbody` has no rows.                      |
| Error                     | Place an Alert with `aria-live="assertive"` before the data region and retain filters for retry.                  |
| Permission limited        | Disable unavailable native actions and connect the reason with `aria-describedby`.                                |
| Stale data                | Place a warning Alert with `aria-live="polite"` before the data region.                                           |
| Filtering and paging      | Bind Filter Bar controls and Pagination links to application-owned query and page state.                          |
| Selection and bulk action | Bind native checkboxes to row `aria-selected` and reveal one shared action `menu` when rows are selected.         |

AngularCSS styles these compositions without defining a request, cache,
authorization, or data-source API.

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Semantic table with application-owned data operations.

## Anatomy

### Root styling selector

- `.data-table`

### Semantic structure

Use `.data-table` on a section containing a semantic header, a `figure` with a native `table`, and an optional footer. Compose Filter Bar, Pagination, Checkbox, Button, Badge, Empty, Skeleton, and Progress without data-table part classes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-selected` | Authored | Selected row state. |
| `aria-sort` | Authored | Column sort state: `ascending`, `descending`, `none`, or `other`. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--data-table-max-height` | Maximum scrollable table height; defaults to `32rem`. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Data Table composes the native Table, Filter Bar, Pagination, and existing controls. AngularTS or the backend owns rows, sorting, filtering, selection, pagination, loading, and mutations.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Keep native table, caption, header scope, and cell relationships. Sorting controls are buttons and expose direction with `aria-sort`; selection uses labeled native checkboxes and row `aria-selected` only when needed.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
