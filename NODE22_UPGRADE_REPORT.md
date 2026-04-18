# Node.js 22 Upgrade Report

## Scope

This report covers the `mp-react18-components` root package and its local `demo` app.

The project does not use the legacy stack mentioned in the request:

- No `webpack`
- No `babel`
- No `jest`

The active toolchain is:

- `React 18`
- `Vite 5`
- `Rollup 4`
- `Vitest 1`
- `Storybook 8`
- `TypeScript 5`

## Environment Notes

- The default shell `node` in this environment was still `v18.20.8`.
- Validation against Node.js 22 was executed with `npx -y -p node@22 ...`.
- Effective validation runtime: `Node.js v22.22.2`.

## Dependency Assessment

### React 18 stack

- `react`: kept on `^18.3.1`
- `react-dom`: kept on `^18.3.1`
- `@types/react`: aligned to `^18.3.28`
- `@types/react-dom`: aligned to `^18.3.7`

Reason:

- The package is explicitly a React 18 component library.
- Upgrading to React 19 is not required for Node.js 22 support and would expand the breaking-change surface.

### Build and test toolchain

- `vite`: aligned to `^5.4.21`
- `@vitejs/plugin-react`: aligned to `^4.7.0`
- `rollup`: aligned to `^4.60.1`
- `@rollup/plugin-commonjs`: aligned to `^25.0.8`
- `@rollup/plugin-node-resolve`: aligned to `^15.3.1`
- `@rollup/plugin-swc`: aligned to `^0.3.1`
- `typescript`: aligned to `^5.9.3`
- `vitest`: aligned to `^1.6.1`
- `jsdom`: aligned to `^24.1.3`
- `storybook` and related packages: unified on `^8.6.18`
- `tsup`: aligned to `^8.5.1`

Reason:

- These versions are already resolved successfully in the project or are the closest verified stable line already in use.
- They support Node.js 22 without forcing an unnecessary jump to Vite 6, Vitest 3/4, Storybook 9/10, or React 19.

### UI and runtime libraries

- `@radix-ui/*`: aligned to currently verified stable versions
- `@floating-ui/react`: aligned to `^0.26.28`
- `@tanstack/react-table`: aligned to `^8.21.3`
- `axios`: aligned to `^1.15.0`
- `react-icons`: aligned to `^5.6.0`
- `three`: kept on `^0.163.0`
- `bulma`: kept on `^0.9.4`

Reason:

- No direct Node.js 22 blocker was found in these packages.
- `three` and `bulma` were intentionally not moved to newer majors because that would introduce unrelated behavior and styling risk.

## Incompatibilities Found

### 1. Rollup config failed under Node.js 22

Problem:

- `rollup.config.mjs` imported `package.json` with `assert { type: 'json' }`.
- Under the validated Node.js 22 runtime, `npm run build` failed with a syntax error on that import.

Fix:

- Replaced the JSON import assertion with `createRequire(import.meta.url)` and `require('./package.json')`.

Result:

- `npm run build` succeeds on Node.js 22.

### 2. Storybook build failed in restricted environments

Problem:

- `storybook build` attempted to write global settings into `~/.storybook/settings.json`.
- In the current environment that path was not writable, so the build failed before completion.

Fix:

- Updated `storybook` and `build-storybook` scripts to run with:
  - `HOME=$PWD/.storybook-home`
  - `--disable-telemetry`

Result:

- `npm run build-storybook` succeeds in a sandboxed or CI-like environment.

### 3. Test suite was effectively empty

Problem:

- The project currently contains no matching Vitest test files.
- `vitest run` exited with code `1`, which blocked validation even though no test failures existed.

Fix:

- Updated the test script to `vitest run --passWithNoTests`.

Result:

- `npm test` completes successfully and makes the current testing gap explicit instead of failing as a false negative.

## Package Changes

### Root package

Updated `package.json` to:

- Align declared versions with validated stable versions already resolved in the project
- Unify Storybook packages on `8.6.18`
- Add:
  - `"engines": { "node": ">=22.0.0 <23", "npm": ">=10.0.0" }`

### Demo package

Updated `demo/package.json` to:

- Align `Vite`, `TypeScript`, React types, and ESLint-related packages with current stable resolved versions
- Add:
  - `"engines": { "node": ">=22.0.0 <23", "npm": ">=10.0.0" }`

## Validation Results

All checks below were executed with `Node.js v22.22.2`.

- `npm install` in root: passed
- `npm install` in `demo`: passed
- `npm run typecheck`: passed
- `npm test`: passed
  - Note: no test files were found
- `npm run build`: passed
  - Note: output is currently empty because `src/index.ts` is empty
- `npm run build-storybook`: passed
  - Note: Storybook warns that no stories were found
- `npm run build` in `demo`: passed

## Official References Used

- React 18 upgrade guide: https://react.dev/blog/2022/03/08/react-18-upgrade-guide
- Vite v5 migration guide: https://v5.vite.dev/guide/migration
- Storybook install and requirements: https://storybook.js.org/docs/get-started/install
- npm package metadata for direct dependency `engines` and `peerDependencies`

## Remaining Risks

- The default shell in this environment still points to Node 18, so local developer machines should verify their active version manager configuration.
- The project currently has no automated component tests.
- The project currently has no Storybook story files under the configured `src/**/*.stories.*` or `src/**/*.mdx` patterns.
- `build` emits empty chunks because `src/index.ts` is empty, which is valid but indicates the package is still skeletal.
- Vite and Storybook emit non-blocking warnings about the CJS Node API and large bundles; they do not block Node.js 22 compatibility.

## Recommended Next Steps

- Switch the default local shell runtime to Node 22 instead of relying on `npx -p node@22`.
- Add real Vitest + Testing Library smoke tests for exported components.
- Restore or add Storybook stories so the Storybook build validates actual components instead of only framework scaffolding.
- Keep React pinned to 18.x until the library is functionally complete and covered by tests.
