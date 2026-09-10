---
title: AngularTS Ownership
weight: 10
description:
  Keep models, validation, bindings, and structural behavior in AngularTS
  instead of duplicating them in components.
---

AngularCSS extends AngularTS; it does not replace framework behavior. This rule
keeps components predictable and prevents two state systems from disagreeing.

## AngularTS owns application state

Use AngularTS for values, commands, collections, and conditional rendering:

```html
<label for="volume">Volume</label>
<input id="volume" type="range" min="0" max="100" ng-model="volume" />
<output>{{ volume }}</output>
```

`ng-model` owns the value while the browser owns the range control. No
AngularCSS directive is needed. Use `ng-range-slider` on a parent only when two
or more native range inputs must share one visual track.

## Native HTML owns platform behavior

Prefer native controls for text, checkboxes, radios, ranges, selects, progress,
tables, and labels. Their form submission, browser validation, autofill, mobile
input, and accessibility behavior should remain intact.

Native `dialog` owns modal focus, Escape closure, background isolation, and
focus restoration. Native `details` and the Popover API own their disclosure
behavior. AngularCSS supplies styles for these elements.

## AngularCSS owns component mechanics

AngularCSS may manage:

- Trigger and panel relationships.
- Composite keyboard navigation and roving focus.
- Focus movement and restoration for composite widgets that need them.
- Required ARIA relationships and state when native HTML cannot express them.
- Component-specific DOM events.

AngularCSS does not own:

- Interpolation or expression parsing.
- `ng-model`, form controllers, or validation rules.
- `ng-if`, `ng-repeat`, or other structural rendering.
- Routing, data fetching, persistence, or business commands.

## Controlled state

Some components observe concise authored attributes such as `open`, `collapsed`,
or native/ARIA state such as `aria-selected`. Use AngularTS bindings to update
those attributes when application code must control the component. The component
reference marks attributes as input, output, or input/output.

## Directive names

AngularCSS avoids collisions with AngularTS. Styling-only elements use native
HTML and roles, so the switch is `input[role="switch"]`; AngularTS owns model
bindings while the browser owns checkbox state and form behavior.
