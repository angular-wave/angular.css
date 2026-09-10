---
title: avatar
category: "media"
description: >
  User avatar, fallback, badge, and group primitives.
---

Use `.avatar` with a native image or authored fallback, plus an optional badge.
Place adjacent avatars and a native `output` in one wrapper to form a group.

```html
<span class="avatar" aria-label="Jane Doe">
  <span>JD</span>
  <output></output>
</span>

<span>
  <span class="avatar"><img src="avatar.jpg" alt="Alex Brown" /></span>
  <output>+3</output>
</span>
```

## Example

{{< example src="examples/components/avatar.html" title="Avatar example" height="180" >}}

## Variants And Composition

Use `size="sm"`, the default size, or `size="lg"`. Badge icons, grouped counts,
RTL layouts, and dropdown triggers compose from the same semantic parts without
changing Avatar behavior.

{{< example src="examples/components/avatar-workflows.html" title="Avatar variants and composition" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native image and fallback composition.

## Anatomy

### Root styling selector

- `.avatar`

### Semantic structure

Apply `.avatar` to a wrapper containing either an image or authored fallback content. Badges are optional. Place adjacent avatars and a native `output` for the remaining count in one `div` or `span`; AngularCSS recognizes that group from its structure.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `size` | Authored | Avatar size: `sm` or `lg`; omit for the default size. |
| `variant` | Authored | Optional direct `output` badge status: `success`; omit for the primary status color. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Avatar is a styling-only authored HTML pattern. Native `img` loading and alternative text remain browser behavior; use a fallback-only avatar when no image is available, or AngularTS structural directives when application state chooses between sources.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give meaningful portrait images useful alternative text. Give fallback-only avatars an accessible name when initials are ambiguous, and keep decorative status badges out of repeated announcements.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
