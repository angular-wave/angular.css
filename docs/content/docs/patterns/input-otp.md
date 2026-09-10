---
title: input-otp
category: "form"
description: >
  A native one-time-code input with a segmented visual treatment.
---

Use one native input. The browser owns editing, paste, autofill, and validation.

```html
<label for="code">One-time code</label>
<input
  id="code"
  autocomplete="one-time-code"
  inputmode="numeric"
  pattern="[0-9]{6}"
  maxlength="6"
  ng-model="code"
/>
```

## Example

{{< example src="examples/components/input-otp.html" title="Input OTP example" height="220">}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. One native one-time-code input.

## Anatomy

### Root styling selector

- `input[autocomplete="one-time-code"]`

### Semantic structure

Use one native `input` with `autocomplete="one-time-code"`. The standard autocomplete purpose identifies the segmented one-time-code presentation; input mode, length, and pattern remain native attributes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `group` | Authored | Optional visual grouping size. Use `3` to separate a six-character code into two groups. |
| `maxlength` | Authored | Maximum native text length. |
| `pattern` | Authored | Native regular-expression validation constraint. |
| `size` | Authored | Native visible-character count; AngularCSS supports four or six code cells. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--otp-cell-size` | Width of one visual code cell; defaults to eight spacing units. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Input OTP is one styling-only native `input`. The browser owns typing, editing, paste, password-manager autofill, `autocomplete=one-time-code`, input mode, length, pattern validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no input-otp directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Preserve native required, disabled, and invalid semantics, and connect help or error text with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
