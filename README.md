# MatsciUI
English | 中文文档：[README.zh-CN.md](./README.zh-CN.md)
For migration and repository comparison: [repo-diff-report.md](./docs/repo-diff-report.md)

> Project Lineage
> This component library is built upon Materials Project’s `mp-react-components` (https://github.com/materialsproject/mp-react-components) and refactored with **ESM-first architecture, strong TypeScript typing, and modern tooling**, delivering a production-ready UI library for materials science that can be directly installed via npm.

`@hyacinth/matsci-ui` is a React component library designed for **materials science research and production applications**. It specializes in data-intensive scientific workflows including material search, tabular exploration, chemical composition input, and interactive 3D crystal visualization. With a focus on maintainability and reusability, it provides ESM-only outputs, explicit package exports, strict TypeScript support, complete Storybook documentation, and a robust Vitest test suite.

---

## Acknowledgements
We sincerely thank the team at the Next-Gen Materials Project (https://next-gen.materialsproject.org/) for their outstanding contributions to materials science and their open-source ecosystem. Their work has laid a solid foundation for downstream tooling, research interface development, and continuous innovation in scientific UI.

---

## Key Features
- **Packaging**: ESM-first with explicit `exports` field, including a dedicated style entry `./style.css`
- **Tooling**: Rollup bundling, strict TypeScript, Storybook 10, and Vitest
- **UI Stack**: Bulma-based styling + Radix UI primitives + TanStack Table
- **Scientific Workflows**: Composable Search UI, periodic-table-driven formula input, publication utilities, and Crystal Toolkit 3D scenes

---

## Installation
```bash
npm install @hyacinth/matsci-ui
```

### Peer Dependencies
- `react`: `^17.0.0 || ^18.0.0 || ^19.0.0`
- `react-dom`: `^17.0.0 || ^18.0.0 || ^19.0.0`

### Recommended Environment
- Node.js `^20.19.0 || ^22.12.0`
- Modern ESM-compatible bundler (Vite, Rollup, Webpack 5+)

---

## Quick Start
Import global styles at your application entry:
```ts
import '@hyacinth/matsci-ui/style.css';
```

Minimal usage example:
```tsx
import { DataTable } from '@hyacinth/matsci-ui';
```

---

## Development & Documentation
- Run local Storybook: `pnpm storybook`
- Build static documentation: `pnpm build-storybook`

---

## Styling & Theming Status
Currently, the **only stable styling strategy** is bundled Bulma styles combined with component-level CSS/Less.

Files such as [`src/theme/tokens.css`](./src/theme/tokens.css) and [theming-and-style-presets.md](./docs/theming-and-style-presets.md) exist as exploratory planning artifacts and are **not considered stable, backward-compatible public APIs**.

Current stable usage rules:
- Applications must use `@hyacinth/matsci-ui/style.css` as the official style entry
- DOM structure and className conventions follow the Bulma framework
- Alternative presets such as `dark.css`, `materials.css`, or `shadcn.css` are not yet published
- Design token naming and theming strategy remain under discussion and should not be treated as final

---

## TypeScript & Public API
- Source entry: [`src/index.ts`](./src/index.ts)
- Build output: `dist/index.js`
- Type definitions: `dist/index.d.ts`
- Stylesheet: `dist/index.css`, exposed as `@hyacinth/matsci-ui/style.css`

In addition to components, the library exports types and utilities for Search UI, periodic table logic, and localization helpers, allowing you to build application-specific wrappers without forking internal code.

---

## Text & Localization
The library **does not require a global i18n runtime**. All user-facing text is fully configurable via props:
- Structured text overrides: `texts?: Partial<...>`
- Explicit props: `placeholder`, `ariaLabel`, `buttonLabel`, `submitButtonText`
- Custom labels for table columns and filter definitions

---

## Performance Notes
This library is optimized for **real-world production-scale datasets and scientific workflows**, rather than extreme virtualization scenarios.
- `SearchUI` supports `searchOnMount={false}` to avoid expensive automatic requests
- `DataTable` uses TanStack Table with memoized column and row logic
- Stories avoid automatic fetching by default to prevent request storms
- Publication and search components use native `fetch` to reduce dependency overhead

For extremely large datasets, we recommend server-side pagination, limited field selection, and smaller default page sizes.

---

## Browser Support
`MatsciUI` supports modern evergreen browsers:
- Latest Chrome / Edge
- Latest Safari
- Latest Firefox

Due to its ESM-first architecture and use of modern DOM/CSS features, **legacy browsers such as Internet Explorer are not supported**.

---

## Migration from `mp-react-components`
This project is not a line-by-line port. It modernizes tooling, bundling, and dependencies while preserving core component behavior and visual consistency.

Key migration considerations:
- Explicit ESM exports and required `style.css` import
- Tables and overlays now powered by Radix UI + TanStack Table
- Multi-theme and non-Bulma theming support is still planned

Migration references:
- [docs/repo-diff-report.md](./docs/repo-diff-report.md)
- [docs/theming-and-style-presets.md](./docs/theming-and-style-presets.md)

---

## Support the Project ⭐️
If this library helps your research, teaching, or production work, please star the repository ⭐️.
Stars help us prioritize maintenance, attract collaborators, and ensure long-term sustainability for scientific UI tools.

---

## Contributing 🤝
Contributions of all kinds are welcome and greatly appreciated! We especially value:
- Modular theming and style flexibility beyond Bulma 🎨
- Performance and rendering optimizations ⚡️
- Domain-specific components and scientific accuracy (researchers and students welcome) 🧪
- Reusable patterns and guidelines for safer AI-assisted development 🧩

The project maintains an academic tone while fostering a friendly and inclusive contribution environment.
If you’ve ever complained that a laggy filter component “violates the second law of thermodynamics,” you’ll fit right in.

### Standard Workflow
1. Install dependencies: `pnpm install`
2. Type checking & testing: `pnpm typecheck` → `pnpm test`
3. Preview in Storybook: `pnpm storybook`
4. Verify build output: `pnpm build`
5. Update documentation if public props, exports, or behavior change

---

## Related Resources
- Original upstream project: [materialsproject/mp-react-components](https://github.com/materialsproject/mp-react-components)
- Repository diff report: [repo-diff-report.md](./docs/repo-diff-report.md)
- Theming planning document: [theming-and-style-presets.md](./docs/theming-and-style-presets.md)