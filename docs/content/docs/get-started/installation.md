---
title: Install AngularCSS
linkTitle: Installation
weight: 20
description:
  Install AngularTS and AngularCSS locally, load the stylesheet, and connect the
  ui module.
---

AngularCSS is distributed as an npm package. Its behavioral components require
AngularTS. Install both packages locally:

```bash
npm install @angular-wave/angular.ts @angular-wave/angular.css
```

No CDN is required. The package includes ESM, UMD, CSS, and TypeScript
declaration outputs.

## Stylesheet-only setup

Native elements, patterns, foundations, and recipes need only the compiled
AngularCSS stylesheet:

```css
@import "@angular-wave/angular.css/dist/angular.css";
```

```html
<button variant="outline">Save</button>
```

These entries register no AngularCSS directive. Add AngularTS for application
bindings, and load AngularCSS JavaScript with the `angular.css` dependency when
using behavioral components such as tabs or comboboxes.

## Bundler setup

Import AngularTS before AngularCSS so the runtime exists when AngularCSS
registers its directives. Import the compiled stylesheet once in your
application entrypoint:

```ts
import { angular } from "@angular-wave/angular.ts";
import "@angular-wave/angular.css";
import "@angular-wave/angular.css/dist/angular.css";

angular.createModule("app", ["angular.css"]);
```

Then attach your application module to an HTML root:

```html
<main ng-app="app">
  <button>Save</button>
</main>
```

The package registers one AngularTS module named `angular.css`. Your application
should depend on that module; do not register individual AngularCSS directives
again.

## Local script setup

Applications without a bundler can copy the two UMD files and the compiled CSS
into their own static asset directory. Serve all three from the same origin:

```html
<link rel="stylesheet" href="/vendor/angularcss/angular.css" />
<script src="/vendor/angular/angular-ts.umd.js"></script>
<script src="/vendor/angularcss/angular-css.umd.js"></script>

<div ng-app="angular.css">
  <button>Save</button>
</div>
```

Load AngularTS first. The documentation examples use this local script order and
never fetch runtime code or styles from a CDN.

## Application styles

Load AngularCSS before application styles so your custom properties and rules
can configure its defaults:

```css
@import "@angular-wave/angular.css/dist/angular.css";

@layer components {
  :root {
    --primary: #175cd3;
    --radius: 0.375rem;
  }

  button[variant="outline"] {
    border-color: var(--border);
    background: transparent;
  }
}
```

The published CSS is compiled and has no framework dependency. See
[Customization]({{< relref "/docs/get-started/customization">}}) for the
complete CSS-variable and DTCG token contract.

## Verify the installation

Render a button and inspect it in browser developer tools:

```html
<button variant="secondary">Installed</button>
```

The element should retain its native attributes. If it remains unstyled, verify
the CSS import. Behavioral components additionally require the AngularTS script
order and the `angular.css` module dependency.

## TypeScript

The package ships declarations under `@types`. TypeScript resolves them from the
package's `types` field; no separate DefinitelyTyped package is needed.

## Next step

[Build your first component]({{< relref
"/docs/get-started/first-component">}}) with semantic HTML and AngularTS state.
