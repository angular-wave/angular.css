---
title: Package Reference
weight: 50
description:
  Public AngularCSS package exports, module registration, distribution files,
  and component contracts.
---

The package root exposes AngularCSS registration state and automatically
registers all canonical directives when AngularTS is available.

```ts
import {
  type AngularCssCustomEvent,
  type AngularCssEventDetailMap,
  angular,
  angularCssDirectives,
  angularCssModuleName,
  registerAngularCss,
} from "@angular-wave/angular.css";
```

## `angularCssModuleName`

- **Type:** `"angular.css"`

The AngularTS module name registered by AngularCSS. Add it as an application
module dependency:

```ts
angular.createModule("app", [angularCssModuleName]);
```

## `angular`

- **Type:** AngularTS runtime or `undefined`

The AngularTS singleton found on the global scope when AngularCSS initializes.
Import AngularTS before AngularCSS in an ESM entrypoint. Most applications
should import their runtime directly from `@angular-wave/angular.ts` instead of
using this optional reference.

## `angularCssDirectives`

- **Type:** array of directive registration tuples

The canonical directive registry. Each tuple contains the AngularTS directive
name and its factory. The list is public for integration diagnostics and custom
bootstrap tooling; applications normally consume it through the `angular.css` module.

## `registerAngularCss()`

```ts
function registerAngularCss(
  angular?: typeof angularRuntime,
): ng.NgModule | undefined;
```

Registers all canonical directives on the `angular.css` AngularTS module. It
returns the module when an AngularTS runtime is available and `undefined`
otherwise. Registration is idempotent for each runtime and reuses an existing
module instead of replacing it. The package calls this function automatically
on import.

Call it explicitly only when AngularTS is loaded after AngularCSS or when an
integration supplies a runtime instance manually.

## Typed DOM events

The root export includes `AngularCssEventName`, `AngularCssEventDetailMap`,
`AngularCssCustomEvent`, and the detail interface for every component event.
It also augments `HTMLElementEventMap`, so TypeScript infers event details from
ordinary DOM listeners:

```ts
calendar.addEventListener("angularcss:calendar-select", (event) => {
  console.log(event.detail.value, event.detail.selectionMode);
});
```

## Distribution files

| File                      | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `dist/angular-css.esm.js` | ESM entrypoint for bundlers.             |
| `dist/angular-css.umd.js` | Local browser script build.              |
| `dist/angular.css`        | Compiled component and token stylesheet. |
| `@types/index.d.ts`       | Root TypeScript declarations.            |

## Component APIs

Use the [component catalog]({{< relref "/docs/components" >}}) for the public
HTML contract of every directive. Those pages are generated from canonical
TypeScript and document selectors, parts, attributes, state, CSS variables,
events, behavior, accessibility, and customization.
