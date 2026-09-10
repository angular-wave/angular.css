---
title: calendar
category: "date input"
description: >
  Calendar date grid structure
---

Use `data-calendar-generated` with `data-month="YYYY-MM"` to render a complete
month, including outside days. Previous and next controls update the visible
month, while selecting a date updates `data-value` and emits
`angularcss:calendar-select`. Bind that event with AngularTS `ng-on-*` so
application state remains responsible for the selected value.

```html
<section
  ng-calendar
  data-calendar-generated
  data-month="2026-05"
  data-value="{{ selectedDate }}"
  ng-on-angularcss:calendar-select="selectedDate = $event.detail.value"
>
  <header>
    <button type="button">Previous</button>
    <h2></h2>
    <button type="button">Next</button>
  </header>
  <div></div>
</section>
```

Use `data-week-start="0"` through `"6"` to choose the first weekday and
`data-show-outside-days="false"` to hide outside dates. Set
`--calendar-cell-size` in CSS to resize cells. Day cells support
arrow keys, Home, End, Page Up, and Page Down. Month changes emit
`angularcss:calendar-month-change`.

Omit `data-calendar-generated` to author every weekday and day cell yourself.
This mode supports selected, today, outside-month, disabled, booked, range, and
week-number attributes without replacing application markup.

Date pickers are compositions rather than a second model implementation: use a
native date or text `input` with `ng-model`, a `field` and `label`, a `popover`,
and this calendar grid. Use native `input[type="time"]` for time values and
ordinary buttons for presets. Booked dates use `disabled` plus
`data-booked="true"`; custom day content can be nested inside a date button, and
generated week numbers use native `data` elements.

The generated calendar is a Gregorian local-date UI backed by `date-fns`.
Non-Gregorian engines, natural-language parsing, and IANA time-zone conversion
are explicit application adapters: they provide localized labels and stable
`YYYY-MM-DD` values to the calendar, or bind native inputs and zone selectors
with AngularTS `ng-model`. AngularCSS does not silently convert calendar systems
or instants because those conversions require application locale and time-zone
policy.

## Example

{{< example src="examples/components/calendar.html" title="Calendar example" height="410" >}}

## Selection And Options

{{< example src="examples/components/calendar-workflows.html" title="Calendar selection and options" height="2820" >}}

## Reference Compositions

Custom day content remains authored HTML, while presets and time values use
ordinary buttons and native inputs bound by AngularTS. The Persian example is an
explicit application-provided calendar-system adapter: it supplies localized
labels and stable Gregorian interchange values without adding a second calendar
engine to AngularCSS.

{{< example src="examples/components/calendar-compositions.html" title="Calendar reference compositions" height="2600" >}}

## Date Picker Compositions

Date Picker is a composition of Field, Input Group, Popover, Calendar, Button,
and native time input primitives. The artifact below implements all eight
checked-in reference workflows: basic, standalone demo, date of birth, parsed
text input, natural-language input, range, RTL, and date with time.

The page loads a locally bundled TypeScript application adapter. AngularTS owns
the values and commands, while `chrono-node` parses natural-language input into
the Calendar's stable `YYYY-MM-DD` interchange value. No CDN or source
TypeScript module is loaded by the example.

{{< example src="examples/components/date-picker-workflows.html" title="Date picker compositions" height="1400" >}}

## Date Picker With Dropdowns

This focused composition keeps the Popover open after selecting a date so the
user can change the month or year and confirm with Done. Selection and the Done
command are implemented in the locally bundled TypeScript adapter.

{{< example src="examples/components/date-picker-with-dropdowns.html" title="Date picker with month and year dropdowns" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS, load its stylesheet, and include the `angular.css` module in your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-calendar]`. Importing the package registers it with the AngularCSS `angular.css` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-calendar`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-current` | Input/output | Current item or date state. |
| `aria-disabled` | Output | Semantic disabled state. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `aria-labelledby` | Output | ID of the element that supplies the accessible name. |
| `aria-live` | Output | Announcement priority for updates to a live region. |
| `aria-pressed` | Input/output | Pressed state of a toggle control. |
| `data-booked` | Output | Whether a generated calendar day is booked. |
| `data-booked-dates` | Input | Comma-separated ISO dates styled as booked. |
| `data-calendar-generated` | Input | Enables generated month markup inside the authored Calendar shell. |
| `data-calendar-preset` | Input | Generated calendar preset: `single`, `multiple`, or `range`. |
| `data-caption-layout` | Input | Caption controls: `label` or `dropdown`. |
| `data-columns` | Input | Number of columns used for calendar grid keyboard movement; defaults to `7`. |
| `data-disabled-after` | Input | Last selectable date as an ISO date. |
| `data-disabled-before` | Input | First selectable date as an ISO date. |
| `data-disabled-dates` | Input | Comma-separated ISO dates that cannot be selected. |
| `data-end-year` | Input | Final year offered by a dropdown caption. |
| `data-min-nights` | Input | Minimum number of nights accepted by range selection. |
| `data-month` | Input/output | Displayed month in `YYYY-MM` form. |
| `data-months` | Output | Number of month grids currently rendered. |
| `data-number-of-months` | Input | Number of consecutive months to render. |
| `data-outside` | Input/output | Whether a day belongs to an adjacent month. |
| `data-range-end` | Output | Marks the final day in the selected range. |
| `data-range-end-value` | Input/output | Selected range end as an ISO date. |
| `data-range-invalid` | Output | Whether the pending range violates the minimum-night constraint. |
| `data-range-middle` | Output | Marks a day between the selected range boundaries. |
| `data-range-start` | Output | Marks the first day in the selected range. |
| `data-range-start-value` | Input/output | Selected range start as an ISO date. |
| `data-selection-mode` | Input | Selection behavior: `single`, `multiple`, or `range`. |
| `data-show-outside-days` | Input | Shows dates from adjacent months when `true`. |
| `data-show-week-numbers` | Input/output | Shows ISO-style week numbers when `true`. |
| `data-start-year` | Input | First year offered by a dropdown caption. |
| `data-value` | Input/output | Selected ISO date for single selection. |
| `data-values` | Input/output | Comma-separated selected ISO dates for multiple selection. |
| `data-week-start` | Input | First weekday as an integer from `0` (Sunday) to `6` (Saturday). |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `lang` | Input | Language used for generated labels and localized text. |
| `selected` | Output | Selected value reflected by the component. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |
| `value` | Output | Native value or authored component value. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--calendar-cell-size` | Width and height of calendar controls and day cells. |

### DOM events

- `angularcss:calendar-month-change`
- `angularcss:calendar-range-invalid`
- `angularcss:calendar-select`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns generated Gregorian month grids, local-date navigation, selectable day state, range and multiple-selection signaling, disabled and booked constraints, caption controls, week numbers, keyboard grid movement, and synchronized authored attributes. AngularTS remains responsible for application models, parsed text, commands, validation, and composed popover state. Natural-language and non-Gregorian conversion remain explicit application adapters; the packaged Date Picker demo uses locally bundled `chrono-node` without adding a second model implementation.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the calendar or its visible title a useful accessible name. Generated weekdays are column headers; week numbers are row headers; day buttons expose selected, current, disabled, outside, booked, and range state. Arrow keys, Home, End, Page Up, and Page Down move through the date grid, while RTL reverses horizontal movement. Date Picker triggers must keep an accessible name and preserve focus through the composed Popover.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-calendar]`, semantic descendants, component classes, and generated state with ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
