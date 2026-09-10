---
title: Introduction
weight: 10
description:
  Understand AngularCSS as semantic HTML, focused TypeScript behavior, and
  customizable CSS.
---

AngularCSS provides HTML-first styles and focused interface components for
AngularTS. Most interface elements are semantic HTML styled directly by CSS.
TypeScript components are reserved for interactions that native HTML, CSS, and
AngularTS do not already provide.

AngularCSS is a customization system, not a design system. It provides a stable
functional baseline and presentation controls; the application owns its brand,
visual language, and product-specific design.

```html
<button variant="outline">Save changes</button>
```

No directive runs for this button. The browser owns activation and disabled
state, AngularTS owns application commands, and CSS targets the native element
and authored variant directly.

## Three layers

1. **HTML owns semantics.** Use `button`, `input`, `dialog`, `nav`, `table`, and
   other native elements whenever they fit the interaction.
2. **AngularTS owns application state.** Use `ng-model`, `ng-click`, validation,
   interpolation, and structural directives for values and business behavior.
3. **AngularCSS fills genuine interaction gaps.** Components add composite
   keyboard navigation, focus management, disclosure coordination, and dynamic
   accessibility relationships only when the first two layers are insufficient.

This boundary prevents a component from creating a second form model, template
engine, validation system, or styling-state mirror over AngularTS and the
browser.

## HTML-first composition

Complex components are composed from named parts rather than hidden templates:

```html
<details class="disclosure">
  <summary>Account settings</summary>
  <section>
    <label for="display-name">Display name</label>
    <input id="display-name" ng-model="profile.name" />
  </section>
</details>
```

You control the elements, content, AngularTS expressions, and application CSS.
Each catalog page documents the authored HTML and any runtime behavior it needs.

## What is included

- 67 documented entries split into foundations, elements, patterns, focused
  behavioral components, and recipes.
- TypeScript declarations generated from the canonical source.
- A compiled CSS entrypoint and a DTCG 2025.10 customization token resolver.
- Local UMD and ESM builds.
- Browser-tested demos isolated from the documentation shell in iframes.

## Next step

[Install AngularCSS]({{< relref "/docs/get-started/installation">}}) and
connect the `angular.css` module to an AngularTS application.
