---
title: Build Your First Component
linkTitle: First component
weight: 30
description: Build an interactive accordion and connect ordinary AngularTS state inside it.
---

This page builds an accordion with native `details` and `summary`. The browser
owns disclosure; AngularTS owns the application value inside the panel.

## Add the HTML

```html
<section ng-app="app">
  <section aria-label="Profile sections">
    <details name="profile-sections" open>
      <summary>Profile</summary>
      <div>
        <label for="display-name">Display name</label>
        <input id="display-name" ng-model="profile.name" />
        <output>Preview: {{ profile.name || "Unnamed" }}</output>
      </div>
    </details>
  </section>
</section>
```

Each direct child is a native disclosure item. The browser creates the trigger
relationship and owns open state, focus, and keyboard activation.

## Create the application module

```ts
import { angular } from "@angular-wave/angular.ts";
import "@angular-wave/angular.css";
import "@angular-wave/angular.css/dist/angular.css";

angular.createModule("app", ["angular.css"]);
```

No controller is required for this example. `ng-model` creates the profile name
binding in the application scope, and interpolation updates the preview.
AngularCSS does not parse or store that value.

## Test the result

1. Press Tab until the accordion trigger receives focus.
2. Press Enter or Space to open and close the panel.
3. Enter a display name and confirm the preview updates.
4. Inspect the `details` element's native `open` state.

## Add multiple panels

Add another sibling `details` with the same `name` to make the group exclusive.
Omit `name` when several panels may remain open:

```html
<section aria-label="Sections">
  <details>...</details>
  <details>...</details>
</section>
```

## Next step

[Customize components]({{< relref
"/docs/get-started/customization">}}), then browse the [complete accordion
reference]({{< relref "/docs/patterns/accordion">}}).
