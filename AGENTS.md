# matsci-ui Agent Guide

This repository is a React component library plus Storybook docs site. It builds ESM-only artifacts and is expected to support React 18 and 19.

## Non-negotiables

- React compatibility: must support React 18 and React 19.
- ESM-only: keep `type: "module"` and do not add CommonJS outputs.
- Package exports: keep `exports` and explicitly export `./style.css`.
- Build toolchain: Rollup is the only bundler for library builds; do not reintroduce tsup.
- UI fidelity: components must match legacy `mp-react` visual behavior as closely as possible.
- Avoid heavy deps: prefer lightweight local implementations over large libraries for small tasks.
- Do not log secrets or API keys.

## Project structure (high level)

- Library source: `src/`
- Entry exports: `src/index.ts`
- Rollup build config: `rollup.config.mjs`
- Storybook config: `.storybook/`
- Storybook stories/docs: `src/stories/`
- Build scripts: `scripts/`

## Local commands

- Install: `pnpm install`
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- Lint: `pnpm lint`
- Build library: `pnpm build`
- Run Storybook: `pnpm storybook`
- Build Storybook: `pnpm build-storybook`

## Storybook + API proxy notes

- In Storybook dev, `/mp-api`, `/mp-contribs-api`, `/matscholar-api` are proxied by Vite (see `.storybook/main.ts`).
- Some Search UI stories require `VITE_MP_API_KEY`. Without it, requests may fail and can cause noisy errors.
- Prefer `searchOnMount: false` for high-cost stories to avoid request storms.

## Coding conventions

- Prefer minimal diffs; follow existing patterns in neighboring files.
- Keep CSS/Bulma classnames consistent; avoid introducing new styling approaches unless necessary.
- Do not add comments unless explicitly asked.
- Maintain strict TypeScript (fix typecheck errors; avoid `any` unless unavoidable and localized).

## Validation checklist (before finishing)

- `pnpm typecheck` passes
- `pnpm test` passes
- For build-related changes: `pnpm build` passes
- For Storybook-related changes: `pnpm build-storybook` passes
