# @nuvioo/automapper-nestjs

Fork of [`@automapper/nestjs`](https://github.com/nartc/mapper/tree/main/packages/nestjs) (MIT, © Chau Tran) that
declares support for **NestJS 12**. Upstream 9.0.2 only lists `@nestjs/common` / `@nestjs/core` `^10 || ^11` as
peers, so Nest 12 projects needed an npm `overrides` entry to install it.

## What differs from upstream

- `peerDependencies` add `^12.0.0` for `@nestjs/common` and `@nestjs/core`.
- An integration test boots `AutomapperModule` in a real Nest 12 testing module (`test/nest-integration.spec.ts`).

The source under `src/` is upstream's, unchanged (synced from `nartc/mapper@f73fe49`). The build reproduces the
published 9.0.2 package: ESM-only `dist/index.mjs` + `dist/index.d.mts`, identical code apart from bundler comments.

## Using it in a nuvioo service

Install it under the original name with an npm alias, so no import changes:

```json
"dependencies": {
    "@automapper/nestjs": "npm:@nuvioo/automapper-nestjs@^9.0.2-nuvioo.1"
}
```

and drop the `@automapper/nestjs` entry from `overrides`. The package lives on GitHub Packages, so the project needs
an `.npmrc` that reads the token from the environment (never commit a literal token):

```
@nuvioo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN?}
```

## Development

```bash
npm ci
npm run typecheck && npm test && npm run build
```

Versions follow `<upstream version>-nuvioo.<n>`. To publish, bump `version`, commit, and push a `v<version>` tag;
the `publish` workflow runs the checks and publishes with the workflow's `GITHUB_TOKEN`.

## Syncing with upstream

Copy `packages/nestjs/src` from `nartc/mapper`, run the checks, and bump the version. Once upstream declares Nest 12
itself, switch the services back to `@automapper/nestjs` and retire this fork.
