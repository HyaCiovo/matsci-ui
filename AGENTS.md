# matsci-ui Development Guide

This repository is a **component library first** project with Storybook as the primary documentation and visual verification surface. It is not a demo app repository and it should not drift back into one.

The package contract, build outputs, and theme architecture are in place, but the npm package is **not published yet**. Development should therefore optimize for:

- a clean publishable library surface
- stable Storybook documentation
- strict type safety
- visual consistency with the current component family
- maintainable theme layering under `src/themes`

## 1. Project priorities

When making changes, keep these priorities in order:

1. Preserve library API stability unless a breaking change is intentional.
2. Preserve component behavior and visual fidelity unless the task explicitly changes them.
3. Keep Storybook stories and docs aligned with real component behavior.
4. Keep the package ESM-only and publishable through Rollup.
5. Prefer maintainable local abstractions over adding heavy dependencies.

## 2. Non-negotiables

- React compatibility must continue to work for React 18 and React 19 usage scenarios.
- Keep `type: "module"` and do not add CommonJS outputs.
- Keep Rollup as the library bundler. Do not reintroduce `tsup` or another parallel library build tool.
- Keep explicit style exports in `package.json`:
  - `./style.css`
  - `./themes/default.css`
  - `./themes/alt.css`
- Do not reintroduce global Bulma selector leakage into host apps.
- Do not move back to per-component scattered CSS imports from component TSX files.
- Do not change `src/components/crystal-toolkit/vis.less` content unless the task explicitly requires it. It is intentionally kept separate because other npm packages depend on it.

## 3. High-level structure

Use these directories according to their responsibilities.

### Library source

- `src/components/`
  - Public component implementation
  - Grouped by domain:
    - `data-display`
    - `data-entry`
    - `navigation`
    - `periodic-table`
    - `publications`
    - `crystal-toolkit`
- `src/primitives/`
  - Low-level reusable UI primitives and wrappers
- `src/utils/`
  - Shared utilities such as HTTP, text, table, and navigation helpers
- `src/constants/`
  - Shared constants used by components and docs
- `src/types/`
  - Shared type declarations when not colocated with components

### Theme system

- `src/themes/foundation/`
  - Base reset
  - tokens
  - Bulma-compatible primitives
  - global utility layer
- `src/themes/shared/`
  - Shared component styling aggregated by domain
  - This is where component skinning belongs
- `src/themes/presets/`
  - Preset-specific token and override composition
  - Currently includes default and alt preset assembly
- `src/themes/entries/`
  - Final theme entrypoints used by Storybook and package builds

### Docs and stories

- `src/stories/`
  - Storybook stories and MDX documentation
  - Organized by the same domain language users see in Storybook
- `.storybook/`
  - Storybook runtime configuration, theming, docs container setup, and proxy configuration

### Build and metadata

- `src/index.ts`
  - Public library entry export surface
- `rollup.config.mjs`
  - Library build configuration
- `scripts/`
  - Build pipeline helpers
- `package.json`
  - Package exports and scripts

## 4. File and naming conventions

Follow the existing naming style consistently.

### Component folders

Most publishable components follow this structure:

- `ComponentName.tsx`
- `ComponentName.test.tsx`
- `index.ts`

Examples:

- `src/components/data-display/DataTable/DataTable.tsx`
- `src/components/data-display/DataTable/DataTable.test.tsx`
- `src/components/data-display/DataTable/index.ts`

### Component names

- Use `PascalCase` for React component files and exported component names.
- Keep the directory name equal to the component name when the component is a standalone public unit.
- Use small colocated helper files when necessary, but avoid exploding a simple component into too many micro-files.

### Storybook files

- Use `*.stories.tsx` for interactive stories.
- Use `*.mdx` for concept, API, migration, or usage guides.
- Keep stories under `src/stories/<domain>/`.
- Keep doc topics grouped by user-facing concerns, not by internal implementation details.

### Re-export files

- Use `index.ts` for public re-export points.
- Keep exports explicit and predictable.
- When adding a new public component, update:
  - the component folder `index.ts`
  - `src/index.ts` if it should be part of the package public surface

## 5. Styling rules

The styling system has already been migrated to a library-owned `ms-*` contract and a unified theme tree. New work should follow that model.

### Required approach

- Put shared structural or visual component styles into `src/themes/shared/*`.
- Put preset-specific visual differences into `src/themes/presets/*`.
- Put base reset / token / utility behavior into `src/themes/foundation/*`.
- Keep theme entry composition in `src/themes/entries/*`.

### Avoid

- Do not add new component-level `.css` or `.less` files under component directories unless there is a strong exception approved by the task.
- Do not import CSS from individual component TSX files as the default pattern.
- Do not introduce raw unprefixed Bulma selectors as the public styling contract.
- Do not create ad hoc parallel theme systems outside `src/themes`.

### Selector conventions

- Prefer library-owned `ms-*` selectors.
- Treat host-app isolation as a core requirement.
- Keep structural rules in shared layers and visual brand differences in preset layers.

### Known exception

- `src/components/crystal-toolkit/vis.less` remains intentionally separate and should stay that way unless explicitly required.

## 6. Storybook expectations

Storybook is not optional documentation in this repository. It is part of the product surface.

### When adding or changing components

- Add or update a relevant `*.stories.tsx` file if the component is user-facing.
- If the change affects usage guidance, theming, migration, configuration, or architecture, update the corresponding MDX documentation.
- Keep bilingual doc tone aligned with existing English / Chinese documentation where relevant.

### What Storybook is used for here

- visual regression checking
- interaction verification
- public-facing usage examples
- migration and architecture guidance

### Storybook-specific notes

- Dev server proxy behavior lives in `.storybook/main.ts`.
- Some Search UI stories rely on API-related environment behavior.
- Prefer `searchOnMount={false}` in stories when automatic requests are expensive or noisy.

## 7. Testing expectations

Tests are colocated with components and should evolve together with implementation.

### Default rule

- If you change behavior, add or update tests near the changed component.

### Test locations

- Component tests typically live beside the component in `*.test.tsx`.
- Search UI has several colocated tests in nested feature folders.
- Storybook build is also a validation layer for documentation and MDX correctness.

### What to test

- component rendering
- state transitions
- interaction behavior
- API/data transformation behavior where relevant
- regressions caused by refactors

## 8. TypeScript expectations

- Keep the codebase strictly typed.
- Prefer narrowing, proper interfaces, and local helpers over `any`.
- If `any` is unavoidable, keep it localized and justified by the surrounding code pattern.
- Public exports should have stable and understandable types.
- Do not weaken types just to make tests or stories easier to write.

## 9. Validation checklist

Use the smallest complete validation set that matches the scope of your change.

### Always run when relevant code changes

- `pnpm typecheck`

### Run when behavior changes

- `pnpm test`

### Run when build output, exports, themes, or packaging changes

- `pnpm build`

### Run when Storybook stories, MDX docs, themes, or UI presentation changes

- `pnpm build-storybook`

## 10. Common task guidance

### Adding a new component

1. Create a `PascalCase` component folder under the correct domain in `src/components/`.
2. Add `ComponentName.tsx`.
3. Add `index.ts`.
4. Add `ComponentName.test.tsx` if the component has behavior worth protecting.
5. Add a story in `src/stories/<domain>/`.
6. If the component needs library styling, place styles in the appropriate `src/themes/shared/*` aggregate file.
7. Export it from `src/index.ts` if it belongs in the public package surface.

### Changing styles

1. Decide whether the change belongs in `foundation`, `shared`, or `presets`.
2. Keep `default` behavior stable unless the task explicitly changes visual behavior.
3. If the change is preset-specific, keep it out of `shared`.
4. Rebuild Storybook when visual output changes.

### Changing exports or package shape

1. Update `src/index.ts` if public exports change.
2. Update `package.json` exports only when the package contract actually changes.
3. Keep style export paths stable unless the task explicitly changes them.
4. Verify with `pnpm build`.

### Updating docs

1. Update README if package contract, install path, theming status, or public usage changes.
2. Update `docs/` when architecture, migration, or project-wide behavior changes.
3. Update Storybook MDX when user-facing guidance or examples change.
4. Keep the docs aligned with the current repository state, not an earlier migration plan.

## 11. Anti-patterns to avoid

- Reintroducing implicit style injection from component JS entrypoints
- Adding new scattered CSS files under component folders as the default pattern
- Writing docs that describe planned behavior as if it were already shipped
- Letting Storybook examples drift away from the real public API
- Changing public exports without updating README / docs / stories
- Reintroducing library-wide assumptions that depend on host global Bulma styles
- Using heavy new dependencies for small local problems

## 12. Quick command reference

- Install dependencies: `pnpm install`
- Run Storybook: `pnpm storybook`
- Build Storybook: `pnpm build-storybook`
- Type check: `pnpm typecheck`
- Run tests: `pnpm test`
- Build library: `pnpm build`
- Lint: `pnpm lint`

Keep this file focused on **how to continue building and maintaining the component library well**. It should describe the repository as it exists now, not as a temporary migration staging area.
