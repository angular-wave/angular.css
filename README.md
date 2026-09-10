# AngularCSS

AngularCSS is an HTML-first style and component layer for AngularTS. Native
HTML owns semantics and browser behavior, AngularTS owns application state, and
AngularCSS adds TypeScript only for interactions those layers cannot provide.

AngularCSS is a customization system, not a design system. It provides stable
CSS variables and presentation contracts for configuring its functional
baseline while each application owns its brand and product-specific design.

```html
<button variant="outline">Save changes</button>

<label for="email">Email</label>
<input id="email" type="email" ng-model="profile.email" />
```

The button and input are styling-only entries. They do not register AngularCSS
directives or mirror native state into `data-*` attributes. Native dialogs and
details disclosures also keep their browser behavior. Composite widgets such as
comboboxes, calendars, and tabs retain focused TypeScript behavior for keyboard
navigation, focus management, and coordinated interaction.

## Installation

```shell
npm install @angular-wave/angular.ts @angular-wave/angular.css
```

Import the stylesheet and register the AngularCSS module with the application:

```js
import "@angular-wave/angular.css/angular.css";
import { angularCssModuleName } from "@angular-wave/angular.css";
import { angular } from "@angular-wave/angular.ts";

angular.createModule("app", [angularCssModuleName]);
```

The UMD bundle registers `angular.css` automatically when AngularTS is already
available on `globalThis.angular`. ESM consumers can call `registerAngularCss()`
explicitly when they use a separate AngularTS runtime.

## Customization

AngularCSS ships browser-ready CSS variables and a DTCG 2025.10 token resolver.
Applications can override the variables directly without adopting a token
compiler:

```css
:root {
  --primary: #175cd3;
  --radius: 0.375rem;
  --spacing: 0.25rem;
}
```

Token tools can resolve the same customization contract from
`@angular-wave/angular.css/customization-tokens`. The contract covers colors,
spacing, typography, shadows, radii, sizing, borders, focus, and motion; it does
not prescribe an application's brand or product design.

Use `data-density="compact"` or `data-density="comfortable"` on a subtree for
coordinated spacing and control geometry. `data-contrast="more"` strengthens
semantic boundaries, while `data-print="exclude"` and `data-print="only"`
express document intent without component-specific classes.

## Compatibility and support

AngularCSS tests the latest published AngularTS release and current Chromium,
Firefox, and WebKit engines. Development and package builds require Node.js 24
or newer. See the
[compatibility and upgrade guide](https://angular-wave.github.io/angular.css/docs/get-started/compatibility/)
before updating a production application.

Use [GitHub Discussions](https://github.com/angular-wave/angular.css/discussions)
for usage questions and the
[issue tracker](https://github.com/angular-wave/angular.css/issues) for reduced,
reproducible defects. Contribution requirements are in
[the repository contribution guide](https://github.com/angular-wave/angular.css/blob/master/CONTRIBUTING.md).

## Development

```shell
npm install
npm run check
npm test
```

The default developer catalog is `index.html`; every entry links to a
standalone functional HTML example. The canonical HTML-first classification is
maintained in `scripts/component-policy.ts` and enforced by
`npm run check:component-registry`.
