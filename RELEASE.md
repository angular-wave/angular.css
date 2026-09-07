# Release procedure

AngularCSS publishes one npm package and one matching GitHub release from an
immutable version tag. The release workflow publishes the exact tarball that
passed package and clean-consumer checks.

## npm authentication and provenance

The npm package uses trusted publishing from the GitHub-hosted release runner.
The npm trust relationship must identify organization `angular-wave`, repository
`angular.css`, and workflow file `release.yml`, with direct `npm publish`
permission. Do not configure an npm environment unless the publish job declares
the same GitHub environment.

The publishing job uses `id-token: write`, Node.js 24, and npm 11.18.0. npm
exchanges the GitHub OIDC identity for a short-lived publishing credential and
attaches signed provenance; no long-lived `NPM_TOKEN` secret is required.

The public `repository.url` in `package.json` must continue to identify this
repository exactly because npm validates it as part of trusted publishing.

## Prepare a release

Resolve the current AngularTS release while retaining the `latest` dependency
declaration:

```sh
npm install --package-lock-only
npm run check:angular-ts-version -- --registry-latest
```

Move user-visible notes from `Unreleased` into a dated changelog section. Update
the version in `package.json`, `package-lock.json`, `docs/hugo.yaml`, and the
documentation version shortcode.

Run the complete local gate:

```sh
npm ci
npm run release:build
npm run check
npm test
npm run test:docs
```

Create and inspect the exact package:

```sh
rm -rf release
mkdir release
npm pack --ignore-scripts --pack-destination release --json > release/npm-pack.json
node scripts/release.mjs verify-pack release/npm-pack.json
tarball="$(node -p 'require("./release/npm-pack.json")[0].filename')"
npm run check:package-consumer -- "release/$tarball"
```

Commit the complete release once, then push the release commit. Do not bypass
the required checks or split generated files from their source changes.

## Publish

Create and push a tag that exactly matches `v<package.version>`:

```sh
git tag -a v0.0.2 -m "AngularCSS 0.0.2"
git push origin v0.0.2
```

The tag starts `.github/workflows/release.yml`. The workflow:

1. Runs the complete reusable CI workflow against the tagged commit.
2. Validates the tag, package metadata, changelog, and registry state.
3. Rebuilds declarations, JavaScript, CSS, and documentation artifacts.
4. Verifies the exact npm package contents and a clean tarball consumer.
5. Creates a draft GitHub release with curated changelog notes.
6. Publishes the exact tarball with npm authentication and OIDC provenance.
7. Waits for npm and verifies the published integrity, shasum, and dist-tag
   against the local pack result.
8. Publishes the GitHub release only after registry verification succeeds.

The release is complete when npm `latest`, tag `v0.0.2`, the GitHub release, and
the documentation site all expose version `0.0.2`.

## Recover a partial release

Rerun a failed job first when the failure is transient. If npm publication
succeeded but the GitHub release did not, manually dispatch the Release
workflow with the existing immutable tag. The recovery path verifies the exact
npm artifact, skips republishing the version, and finishes the GitHub release.

Never move a published tag or overwrite an npm version. Prepare a new patch
version for corrections.
