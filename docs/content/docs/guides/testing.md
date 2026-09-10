---
title: Testing
weight: 40
description: Run static quality gates, component browser tests, and the complete
  documentation example suite.
---

AngularCSS tests the HTML contract in Chromium with Playwright and validates
source, public entrypoints, documentation inventory, AngularTS overlap, and
forbidden ports with static checks.

## Static checks

```bash
npm run check
```

This command verifies TypeScript, canonical component and element entrypoints,
generated declarations, documentation completeness, component test inventory,
AngularTS directive ownership, CSS isolation, and test ports.

## Component tests

```bash
PLAYWRIGHT_PORT=4101 npm run test:components -- --reporter=dot
```

Use an available port other than `3000` or `4000`. The default is `4100`; set
`PLAYWRIGHT_PORT` when another local service already owns it.

## Documentation tests

```bash
PLAYWRIGHT_PORT=4101 npm run test:docs -- --reporter=dot
```

The documentation suite opens every component and element iframe, verifies that
local AngularTS and AngularCSS assets load, checks that templates compile, and
exercises representative form bindings.

## Hugo build

```bash
hugo --source docs --destination /tmp/angularcss-docs --cleanDestinationDir
```

The repository includes precompiled Docsy shell CSS so the site builds with the
standard Hugo binary. The module may still report that extended Hugo is its
preferred environment; that warning does not require a CDN or prevent the build.

## Regenerate component references

```bash
npm run generate-docs:components
```

The generator reads canonical TypeScript implementations and updates selectors,
parts, attributes, states, CSS variables, and events on all component pages.
`npm run check:docs-content` fails when generated reference content is stale.
