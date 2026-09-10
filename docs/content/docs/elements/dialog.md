---
title: dialog
category: "overlay"
description: >
  Modal dialog structure
---

Compose a modal from a declarative invoker and native `dialog`. The browser owns
modal focus and disclosure; AngularTS owns form values and application actions.

```html
<section class="dialog">
  <button commandfor="profile-dialog" command="show-modal">Edit profile</button>
  <dialog id="profile-dialog">
    <header>
      <h2>Edit profile</h2>
      <p>Update your public profile.</p>
    </header>
    <button commandfor="profile-dialog" command="close">Save changes</button>
  </dialog>
</section>
```

## Profile Dialog

## Example

{{< example src="examples/components/dialog.html" title="Dialog example" height="420" >}}

## Close Controls

Corner and footer close actions are distinct, and the corner control can be
omitted without changing modal behavior.

{{< example src="examples/components/dialog-close-workflows.html" title="Dialog close controls" height="480" >}}

## Scrolling

Use a `section` directly inside the native `dialog` or its `form` for scrollable
content, and add `class="scroll-area"` for native overflow. Keep the footer
outside that section when its actions must remain visible.

{{< example src="examples/components/dialog-scroll-workflows.html" title="Scrollable dialogs" height="480" >}}

## Right To Left

{{< example src="examples/components/dialog-rtl.html" title="Right-to-left dialog" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native dialog top-layer and modal behavior.

## Anatomy

### Root styling selector

- `.dialog`

### Semantic structure

Use `.dialog` as a composition wrapper containing a native invoker button and `dialog`. Close controls use `command=close`; semantic headers, sections, forms, and footers need no anatomy classes or nested AngularCSS attributes.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `closedby` | Authored | Native dialog dismissal behavior. |
| `command` | Authored | Native invoker action such as `show-modal` or `close`. |
| `commandfor` | Authored | ID of the native dialog controlled by an invoker. |
| `dir` | Authored | Text and interaction direction: `ltr` or `rtl`. |
| `size` | Authored | Dialog width: `wide`; omit for the default width. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A native `dialog` opened with `command=show-modal` owns top-layer rendering, modal focus, Escape, background isolation, and trigger focus restoration. Declarative `command=close` controls dismiss it. AngularTS remains responsible for form models, validation, submission, authored content, and application state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible title and description connected with `aria-labelledby` and `aria-describedby`. Native modal dialogs contain focus, isolate the background, close on Escape, and restore focus to their declarative invoker.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
