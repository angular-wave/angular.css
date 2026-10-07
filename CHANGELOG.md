# Changelog

## [Unreleased]

## [0.0.2] - 2026-10-08

### Added

- Added a DTCG 2025.10 customization contract for colors, spacing, typography,
  shadows, radii, sizing, borders, focus, and motion, with global, subtree,
  dark, density, contrast, and print usage.
- Added enterprise catalog coverage for descriptions, filtering, pagination,
  validation, empty states, data views, application shells, overlays, and
  master-detail workflows while keeping the catalog at 67 entries.
- Added catalog-wide mobile and automated accessibility checks, Chromium,
  Firefox, and WebKit contracts, package and runtime performance budgets, and a
  clean tarball consumer test.
- Added public API drift detection and compatibility, upgrade, support, and
  contribution documentation.

### Changed

- Renamed product references to AngularCSS and clarified that it is a
  customization system rather than a product design system.
- Consolidated shared spacing, control geometry, state color, motion, border,
  focus, density, contrast, and print behavior across the catalog.
- Updated every catalog example for consistent proportions, narrow viewports,
  semantic HTML, keyboard behavior, and focused AngularTS ownership.
- Simplified component custom events from the `angularcss:*` namespace to the
  AngularTS-aligned `ng:*` namespace across the API, examples, and documentation.
- Declared AngularTS through the npm `latest` tag and added daily testing against
  the registry's current release, with the bundled compatibility runtime updated
  to AngularTS `0.37.0`.

### Fixed

- Fixed combobox filtering, popup sizing, grouped results, mobile layout, and
  selection behavior.
- Fixed sidebar off-canvas isolation, calendar selection semantics, carousel
  list semantics, command ownership, chart compatibility, status announcements,
  color contrast, and inconsistent error-state presentation.

### Build

- Removed Tailwind from the source, build, and distributed CSS in favor of a
  standards-based Lightning CSS pipeline.
- Added OIDC-only npm trusted publishing with provenance and post-publish
  integrity, shasum, and dist-tag verification against the exact local tarball.

## [0.0.1] - 2026-09-06

### Added

- Published an HTML-first catalog of 67 foundations, elements, patterns,
  interactive components, and enterprise application recipes.
- Added focused AngularTS behavior for calendars, carousels, comboboxes,
  commands, menus, resizable panels, sidebars, tabs, toasts, toolbars, trees,
  and tooltips.
- Added responsive application shell, data table, date picker, form layout,
  master-detail, drawer, sheet, and alert-dialog recipes.
- Added typed AngularCSS custom events and generated TypeScript declarations.
- Added complete component, workflow, visual, documentation, and narrow
  viewport browser coverage.

### Design

- Kept native HTML responsible for semantics, form behavior, dialogs,
  disclosure, scrolling, and selection wherever browser behavior is sufficient.
- Kept CSS classes small and semantic, with shared spacing, sizing, color,
  motion, responsive, RTL, and overlay contracts.
- Reserved AngularCSS directives for coordinated keyboard, focus, geometry, and
  application integration behavior.
- Added reproducible release builds and underscore-prefixed internal properties
  so production minification can safely mangle private property names.
