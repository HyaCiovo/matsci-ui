# MatsciUI

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/HyaCiovo/matsci-ui)

> Current status: the npm package name, exports, and build artifacts are ready, but the package has not been published to npm yet. Until publication, the live Storybook remains the best way to preview behavior and UI.

English | 中文文档：[README.zh-CN.md](./README.zh-CN.md)
For migration and repository comparison: [repo-diff-report.md](./docs/repo-diff-report.md)

> Project Lineage
> This component library is built upon Materials Project’s `mp-react-components` (<https://github.com/materialsproject/mp-react-components>) and refactored with **ESM-first architecture, strong TypeScript typing, modern bundling, and Storybook-first documentation**, with the goal of becoming a production-ready UI library for materials science applications.

`@hyacinth/matsci-ui` is a React component library for **materials science research and production workflows**. It focuses on reusable search experiences, table and card rendering, chemistry-aware input, publication helpers, and interactive 3D crystal visualization. The current repository emphasizes maintainability, explicit public exports, type safety, visual regression control through Storybook, and a publishable npm package surface.

***

## Acknowledgements

We sincerely thank the team at the Next-Gen Materials Project (<https://next-gen.materialsproject.org/>) for their outstanding contributions to materials science and their open-source ecosystem. Their work laid the foundation that made this modernization effort possible.

***

## Key Features

- **Packaging**: ESM-only package with explicit `exports`, including `./style.css`, `./themes/bulma.css`, and `./themes/gnosys.css`
- **Bundle Optimization**: minified theme CSS output plus preserve-modules ESM build for better consumer-side tree shaking
- **Tooling**: Rollup 4, strict TypeScript, Storybook 10, Vitest, and `lefthook`
- **UI Stack**: library-owned `ms-*` styling contract, Bulma-compatible foundation layer, Radix UI primitives, and TanStack Table
- **Scientific Workflows**: composable Search UI, periodic-table-driven materials input, publication utilities, and Crystal Toolkit scenes
- **Theming Architecture**: publishable theme layers live under `src/themes`, while Storybook-only preview overrides are isolated under `.storybook/themes`

***

## Installation Status

The intended package name is:

```bash
npm install @hyacinth/matsci-ui
# pnpm add @hyacinth/matsci-ui
# yarn add @hyacinth/matsci-ui
# bun add @hyacinth/matsci-ui
```

The package is **not published yet**, so the command above is the future public install contract rather than something users can run today from npm. For now, use the repository workspace and Storybook to evaluate the library.

### Peer Dependencies

- `react`: `^17.0.0 || ^18.0.0 || ^19.0.0`
- `react-dom`: `^17.0.0 || ^18.0.0 || ^19.0.0`

### Recommended Environment

- Node.js `^20.19.0 || ^22.12.0`
- Modern ESM-compatible bundler such as Vite, Rollup, or Webpack 5+
- Bun-managed consumer applications are also supported when they can consume modern ESM packages and CSS entrypoints

***

## Quick Start

Import exactly one theme stylesheet once at your application entry. Components no longer auto-inject styles when you import them:

```ts
import '@hyacinth/matsci-ui/style.css';
// or:
// import '@hyacinth/matsci-ui/themes/bulma.css';
// or:
// import '@hyacinth/matsci-ui/themes/gnosys.css';
```

Theme entrypoint mapping:

- `@hyacinth/matsci-ui/style.css`: alias of the published Bulma theme
- `@hyacinth/matsci-ui/themes/bulma.css`: explicit Bulma theme entry
- `@hyacinth/matsci-ui/themes/gnosys.css`: explicit Gnosys theme entry

Important:

- Do not statically import both `bulma.css` and `gnosys.css` in the same application shell.
- Storybook toolbar theme switching is a docs/runtime convenience, not a public JavaScript theming API.
- If your host app needs runtime theme switching, swap the active stylesheet at the app shell level rather than eagerly importing both preset bundles.

Minimal component usage:

```tsx
import { DataTable } from '@hyacinth/matsci-ui';
```

Recommended current usage:

- Use `@hyacinth/matsci-ui/style.css` or `@hyacinth/matsci-ui/themes/bulma.css` for the stable Bulma appearance
- Use `@hyacinth/matsci-ui/themes/gnosys.css` when you want the secondary flatter preset with deeper blue emphasis and smaller radii

***

## Development & Documentation

- Run local Storybook: `pnpm storybook`
- Build static documentation: `pnpm build-storybook`
- Build the library: `pnpm build`
- Type check: `pnpm typecheck`
- Run tests: `pnpm test`

Storybook is currently the primary interactive documentation surface because the npm package is not yet published.

Repository development remains pnpm-based today. Bun support here refers to consuming the library from Bun-managed applications rather than switching the repository lockfile and script workflow away from pnpm.

***

## Styling & Theming Status

The repository’s styling system has already moved beyond the old “single implicit Bulma bundle” model.

What is stable today:

- Applications must explicitly import `@hyacinth/matsci-ui/style.css` or `@hyacinth/matsci-ui/themes/bulma.css`
- The package also exports `@hyacinth/matsci-ui/themes/gnosys.css`
- Components no longer inject styles automatically
- Global Bulma pollution has been removed from the library’s published selectors by converging on library-owned `ms-*` classes
- The source theme system now lives under a single `src/themes` tree
- Storybook-only preview CSS is not exported from the package and is not emitted into `dist`

What is implemented in the repository:

- `src/themes/foundation/*`: tokens, base reset, Bulma-compatible primitives, and utility rules
- `src/themes/shared/*`: shared component skinning aggregated by domain
- `src/themes/presets/*`: preset-specific assembly and override hooks
- `src/themes/entries/*`: final theme entrypoints used by Storybook and package builds
- `.storybook/themes/*`: Storybook-only preview tokens and overrides
- `dist/themes/bulma.css`: the default published stylesheet
- `dist/themes/gnosys.css`: the published secondary preset stylesheet

Practical takeaway:

- The Bulma theme is stable and should be the primary consumer entry
- The Gnosys theme is the secondary preset for a flatter academic UI direction with stronger blue emphasis

***

## TypeScript & Public API

- Source entry: [`src/index.ts`](./src/index.ts)
- Build output: `dist/index.js`
- Type definitions: `dist/index.d.ts`
- Stylesheets:
  - `dist/themes/bulma.css`, exposed as `@hyacinth/matsci-ui/style.css` and `@hyacinth/matsci-ui/themes/bulma.css`
  - `dist/themes/gnosys.css`, exposed as `@hyacinth/matsci-ui/themes/gnosys.css`

Storybook-only files such as `.storybook/themes/gnosys-preview-tokens.css` and `.storybook/themes/gnosys-preview-overrides.css` are not part of the npm package contract.

The JavaScript build now uses preserve-modules ESM output, so consumer bundlers can tree-shake the package more effectively than a single monolithic bundle.

In addition to components, the library exports types, constants, and utilities for Search UI, periodic-table logic, text helpers, and localization-oriented configuration.

***

## Text & Localization

The library does not require a global i18n runtime. User-facing copy is configurable through props:

- Structured text overrides such as `texts?: Partial<...>`
- Explicit props such as `placeholder`, `ariaLabel`, `buttonLabel`, and `submitButtonText`
- Custom labels for table columns and filter definitions

Storybook docs also support bilingual English and Chinese switching.

***

## Performance Notes

This library is optimized for real scientific-product workflows rather than extreme virtualization scenarios.

- `SearchUI` supports `searchOnMount={false}` to avoid expensive automatic requests
- `DataTable` uses TanStack Table and library helpers rather than the legacy table stack
- Stories avoid automatic fetching by default to reduce noisy traffic
- Search and publication flows use native `fetch` utilities instead of `axios`
- CSS is minified in published theme outputs, and JS output is structured for downstream tree shaking

For very large datasets, prefer server-side pagination, smaller default page sizes, and narrower field selection.

***

## Browser Support

`MatsciUI` targets modern evergreen browsers:

- Latest Chrome / Edge
- Latest Safari
- Latest Firefox

Because the package is ESM-first and uses modern DOM/CSS features, Internet Explorer and similarly old environments are not supported.

***

## Migration from `mp-react-components`

This repository is not a line-by-line port. It modernizes packaging, styling contracts, Storybook infrastructure, table rendering, overlays, and the network layer while preserving the core component families and overall product direction.

Key migration considerations:

- Change imports from `@materialsproject/mp-react-components` to `@hyacinth/matsci-ui`
- Explicitly import `@hyacinth/matsci-ui/style.css`
- Consumer projects can keep using npm / pnpm / Yarn, or move to Bun, as long as the host toolchain supports modern ESM and CSS imports
- Re-test `SearchUI`, `DataTable`, `Tooltip`, `JsonView`, and Crystal Toolkit integrations
- If an older product depended on `dark.css` or `materials.css`, migrate that usage to the new explicit theme entry model
- Prefer the Bulma theme for Bulma-like continuity and `themes/gnosys.css` for the flatter blue-accent preset

Migration references:

- [docs/repo-diff-report.md](./docs/repo-diff-report.md)
- [docs/theming-and-style-presets.md](./docs/theming-and-style-presets.md)

***

## Support the Project

If this library helps your research, teaching, or product work, please star the repository. Stars help prioritize maintenance and attract collaborators for long-term scientific UI work.

***

## Contributing

Contributions of all kinds are welcome. We especially value:

- theming and style-system improvements beyond the default Bulma-like surface
- performance and rendering optimizations
- domain-specific components and scientific accuracy improvements
- safer and clearer AI-assisted development patterns

### Standard Workflow

1. Install dependencies: `pnpm install`
2. Run type checking and tests: `pnpm typecheck` then `pnpm test`
3. Preview docs and examples: `pnpm storybook`
4. Verify build output: `pnpm build`
5. Update documentation whenever public props, exports, styling contracts, or behavior changes

***

## Related Resources

- Original upstream project: [materialsproject/mp-react-components](https://github.com/materialsproject/mp-react-components)
- Repository diff report: [repo-diff-report.md](./docs/repo-diff-report.md)
- Theming and style preset status: [theming-and-style-presets.md](./docs/theming-and-style-presets.md)
