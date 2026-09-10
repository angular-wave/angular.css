---
title: application-shell
category: "layout"
description: >
  Enterprise application header, navigation, and workspace
---

Compose a persistent application header, the existing Sidebar, and a semantic
main workspace. Routing, permissions, and page content remain application-owned.
The reference uses the Sidebar's `responsive` attribute so navigation starts
off-canvas on narrow screens without adding an application-specific class.

## Example

{{< example src="examples/components/application-shell.html" title="Operations application shell" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Application header, navigation, and workspace composition.

## Anatomy

### Root styling selector

- `.application-shell`

### Semantic structure

Use one `.application-shell` containing a direct semantic header, an existing Sidebar, and a direct `main` landmark. Existing components keep their own root selectors; no shell part classes are required.

## API

### Attributes and state

This component has no directive-specific attributes beyond its semantic HTML.

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Application Shell composes a semantic header, Sidebar, and main landmark. Routing, session state, permissions, responsive navigation policy, and page content remain application-owned.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Prefer semantic landmarks and native elements inside the layout. Any interactive handles or triggers must retain an accessible name and visible focus indicator.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
