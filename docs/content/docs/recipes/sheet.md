---
title: sheet
category: "overlay"
description: >
  Edge anchored overlay panels
---

Use a native `dialog` and declarative invoker. Author `side` on the dialog as
`right`, `left`, `top`, or `bottom`; CSS owns only physical placement.

```html
<section class="sheet">
  <button commandfor="profile-sheet" command="show-modal">Open</button>
  <dialog id="profile-sheet" side="right">
    <header>
      <h2>Edit profile</h2>
      <p>Update your account details.</p>
    </header>
    <section>Content</section>
    <footer>
      <button commandfor="profile-sheet" command="close">Close</button>
    </footer>
  </dialog>
</section>
```

## Example

{{< example src="examples/components/sheet.html" title="Profile form sheet" height="420" >}}

The example keeps profile values and save state in AngularTS. Sheet owns only
modal disclosure, semantics, focus, and placement.

## Without Corner Close

{{< example src="examples/components/sheet-no-close.html" title="Sheet without a close button" height="360" >}}

The panel intentionally omits close controls and remains dismissible through the
exact overlay or Escape.

## Sides

{{< example src="examples/components/sheet-sides.html" title="Physical sheet sides" height="420" >}}

Top and bottom panels use a half-viewport maximum in this composition. The
scrolling body remains independent from the header and footer.

## RTL

{{< example src="examples/components/sheet-rtl.html" title="RTL profile sheet" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. A native dialog presented as a side sheet.

## Anatomy

### Root styling selector

- `.sheet`

### Semantic structure

Use `.sheet` as a wrapper containing a native invoker button and `dialog` with authored `side`. Close controls use `command=close`; semantic headers, sections, forms, and footers need no anatomy classes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `command` | Authored | Native invoker action such as `show-modal` or `close`. |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `side` | Authored | Dialog edge: `top`, `right`, `bottom`, or `left`. |
| `size` | Authored | Use `half` for a half-height top or bottom sheet. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A native `dialog` owns modal disclosure, focus, Escape, background isolation, and restoration. The concise authored `side` attribute selects CSS edge placement. AngularTS remains responsible for form values, validation, submission, language, and authored content.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible title and description connected to the native dialog. Keep the physical edge as presentation only; content order, focus order, and inherited text direction remain semantic.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
