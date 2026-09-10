---
title: Composition
weight: 20
description:
  Combine small AngularCSS primitives into forms, overlays, date pickers, and
  application navigation.
---

AngularCSS components expose HTML parts rather than private templates. Compose
them when a workflow needs behavior from more than one primitive.

## Form field

Combine field, label, input, description, and AngularTS validation:

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" name="email" ng-model="profile.email" required />
  <p>Used for account notices.</p>
  <p ng-if="profileForm.email.invalid" class="field-error">
    Enter a valid email.
  </p>
</div>
```

The native input and AngularTS form controller own the value and validity. The
field styles the authored label, helper, and error text around the control.

## Date picker

A date picker combines a field, text or date input, popover, and calendar. The
calendar emits `angularcss:calendar-select`; application code converts the day
into the required date model and updates the input.

Do not introduce a second hidden date model inside the calendar directive.

## Command dialog

Place command content inside a dialog. Dialog owns modal focus and closure;
command owns active result navigation; AngularTS owns filtering and command
execution.

## Disclosure sidebar group

Place native `details.disclosure` inside a sidebar group. Sidebar owns its
global expanded state and responsive hooks; the browser owns nested disclosure.

## Composition rules

1. Assign each state value to one owner.
2. Preserve semantic elements and authored labels.
3. Reuse an existing primitive for focus or disclosure behavior.
4. Connect composed regions with stable IDs and ARIA relationships.
5. Test the complete workflow, not only each isolated primitive.
