# matsci-ui

English documentation. Chinese version: [README.zh-CN.md](./README.zh-CN.md). Migration and repo comparison: [repo-diff-report.md](./docs/repo-diff-report.md).

`@hyacinth/matsci-ui` is a React component library for materials science applications. It evolves the legacy `mp-react-components` codebase into a modern npm-first package with ESM output, typed public exports, Storybook 10 docs, Vitest-based tests, and a cleaner separation between reusable components and app-specific pages.

## Project Background

The original `mp-react-components` repository mixed reusable UI primitives, page-level demos, legacy Dash-oriented integration patterns, and a transitional release workflow. This repository narrows the scope to the publishable library surface:

- Reusable UI building blocks for materials science products
- Search-oriented composition primitives for REST-backed datasets
- Periodic-table-driven data entry and formula parsing
- Publication and bibliography helpers
- Crystal Toolkit visualization components
- Storybook as the primary documentation and interactive playground

This repository is the recommended baseline when you want a package-consumable component library instead of a source-only fork.

## Feature Overview

### Component Families

- **Search UI**
  - Container, search bar, filters, data header, table, grid, cards, and synthesis recipe views
  - Query serialization, sort / pagination integration, configurable columns, and conditional row styles
- **Data Entry**
  - `MaterialsInput`, periodic table selectors, sliders, selects, switches, checkboxes, and text inputs
- **Data Display**
  - `DataTable`, `DataBlock`, `DataCard`, `Markdown`, `JsonView`, `Tooltip`, `Modal`, `Drawer`, `Paginator`
- **Navigation**
  - `Dropdown`, `Navbar`, `NavbarDropdown`, `NotificationDropdown`, `Scrollspy`, `Tabs`, `Sidebar`, `Link`, `Accordion`
- **Publications**
  - `BibCard`, `BibFilter`, `BibjsonCard`, `BibtexButton`, `CrossrefCard`, `OpenAccessButton`, `PublicationButton`
- **Crystal Toolkit**
  - `CrystalToolkitScene`, `CrystalToolkitAnimationScene`, `PhononAnimationScene`, `ReactGraphComponent`, `Download`

### Ecosystem Choices

- **Styling**: Bulma + local CSS/Less
- **Headless primitives**: Radix UI
- **Tables**: `@tanstack/react-table`
- **Markdown / math**: `react-markdown`, `remark-math`, `rehype-katex`
- **3D**: `three`
- **Docs**: Storybook 10 + docs blocks
- **Tests**: Vitest + Testing Library + jsdom

## Architecture

### Repository Shape

```text
src/
  components/          reusable library surface
  constants/           domain constants such as point groups / space groups
  stories/             Storybook stories and MDX docs
  text/                text helpers such as template formatting / merges
  theme/               theme exploration and token experiments
  utils/               cross-component utilities
.storybook/            Storybook runtime and proxy setup
docs/                  migration notes and comparison reports
scripts/               build helpers
```

### Design Principles

- Prefer composable container + child APIs over page-specific wrappers
- Expose TypeScript types and utility helpers when they improve consumer ergonomics
- Keep CSS bundled for easy adoption and treat theme abstraction as future work
- Keep consumer-facing copy configurable through `texts` props or dedicated label props
- Make Storybook the canonical source of usage examples

## Installation

```bash
npm install @hyacinth/matsci-ui
```

Peer dependencies:

- `react`: `^17.0.0 || ^18.0.0 || ^19.0.0`
- `react-dom`: `^17.0.0 || ^18.0.0 || ^19.0.0`

Recommended runtime:

- Node.js `^20.19.0 || ^22.12.0`
- A modern bundler with ESM support

## Quick Start

Import styles once at your app entry:

```ts
import '@hyacinth/matsci-ui/style.css';
```

### Example: Modal

```tsx
import { Modal, ModalContextProvider, ModalTrigger } from '@hyacinth/matsci-ui';

export function DemoModal() {
  return (
    <ModalContextProvider>
      <ModalTrigger>
        <button type="button">Open</button>
      </ModalTrigger>
      <Modal>
        <div className="box">Hello from Modal</div>
      </Modal>
    </ModalContextProvider>
  );
}
```

### Example: Search UI

```tsx
import {
  SearchUIContainer,
  SearchUISearchBar,
  SearchUIFilters,
  SearchUIDataHeader,
  SearchUIDataTable,
} from '@hyacinth/matsci-ui';

const columns = [
  { title: 'Material ID', selector: 'material_id' },
  { title: 'Formula', selector: 'formula_pretty', formatType: 'FORMULA' },
];

const filterGroups = [
  {
    name: 'Composition',
    filters: [
      {
        name: 'Formula',
        params: ['formula'],
        type: 'MATERIALS_INPUT',
        props: { type: 'formula' },
      },
    ],
  },
];

export function DemoSearchUI() {
  return (
    <SearchUIContainer
      apiEndpoint="/mp-api/materials/summary"
      columns={columns}
      filterGroups={filterGroups}
      resultLabel="material"
      searchOnMount={false}
    >
      <SearchUISearchBar
        allowedInputTypesMap={{
          formula: { field: 'formula' },
          elements: { field: 'elements' },
          mpid: { field: 'material_ids' },
        }}
      />
      <SearchUIFilters />
      <SearchUIDataHeader />
      <SearchUIDataTable />
    </SearchUIContainer>
  );
}
```

### Example: Materials Input

```tsx
import { MaterialsInput, PeriodicTableMode } from '@hyacinth/matsci-ui';

export function DemoMaterialsInput() {
  return (
    <MaterialsInput
      label="Composition"
      placeholder="Li-Fe-O"
      periodicTableMode={PeriodicTableMode.TOGGLE}
      allowedInputTypes={['chemical_system', 'elements', 'formula']}
    />
  );
}
```

## Using Named Imports and Tree Shaking

The package is published as ESM. In practice, the recommended consumption model is:

- import only the symbols you use from `@hyacinth/matsci-ui`
- import `@hyacinth/matsci-ui/style.css` once at the application entry
- rely on your bundler for dead-code elimination of unused JavaScript exports

Example:

```tsx
import { DataTable, Paginator, MaterialsInput } from '@hyacinth/matsci-ui';
```

## Styling and Theme Status

The current library ships one practical styling path: bundled Bulma plus component-level CSS/Less. The repository does contain theme-related exploration files such as [`src/theme/tokens.css`](./src/theme/tokens.css) and [theming-and-style-presets.md](./docs/theming-and-style-presets.md), but that work should be treated as planning rather than as a stable, officially adopted theming API.

What is true today:

- consumers should rely on `@hyacinth/matsci-ui/style.css`
- the rendered DOM and class structure still assume the Bulma-oriented styling model
- no alternate preset such as `dark.css`, `materials.css`, or `shadcn.css` is currently published
- token naming and preset strategy are still under discussion and should not yet be treated as a compatibility contract

If you need product-specific visual customization today, prefer targeted stylesheet overrides in the consuming application and validate them per component.

## TypeScript and Public API

- Source entry: [`src/index.ts`](./src/index.ts)
- Published JS entry: `dist/index.js`
- Published types: `dist/index.d.ts`
- Published stylesheet: `dist/index.css`, exposed as `@hyacinth/matsci-ui/style.css`

The package exports both components and supporting types/utilities, especially for Search UI and periodic-table composition. This makes it easier to build product-specific wrappers without forking internals.

## Text and Localization Strategy

The library avoids a required runtime i18n dependency. Consumer-facing copy is generally exposed through one of the following:

- `texts?: Partial<...>` structured copy objects
- one-off props like `placeholder`, `ariaLabel`, `buttonLabel`, `submitButtonText`
- explicit consumer-managed labels in column and filter definitions

Example:

```tsx
import { DataTable } from '@hyacinth/matsci-ui';

<DataTable
  data={data}
  columns={columns}
  texts={{
    columns: 'Columns',
    selectAll: 'Select all',
    rowsPerPage: 'Rows per page',
    pageSummaryTemplate: '{start}-{end} of {total}',
    paginator: {
      previous: 'Previous',
      next: 'Next',
      jumpTo: 'Jump to',
    },
  }}
/>;
```

## Accessibility Notes

Accessibility is handled component-by-component instead of by a global abstraction. Current implementation highlights include:

- Radix-based primitives for dialogs, tooltips, dropdowns, tabs, and checkboxes
- explicit `aria-*` labels in table pagination, row selection, and inputs
- keyboard-friendly focus management in modal / drawer / dropdown interactions
- text overrides for screen-reader-specific copy via `texts` props

When integrating into a product, validate final keyboard flow and color contrast after applying your own stylesheet overrides.

## Performance Notes

This repository is optimized for typical product-sized datasets and documentation workflows rather than aggressive virtualization.

- `SearchUI` supports `searchOnMount={false}` for expensive endpoints
- `DataTable` uses TanStack Table and memoized column / row helpers
- docs and stories default to safer API behavior to avoid request storms
- publication and search components use `fetch`, reducing dependency overhead

For very large datasets, prefer server-side pagination, narrower field selection, and smaller default page sizes.

## Testing and Quality

Development scripts:

```bash
npm install
npm test
npm run typecheck
npm run build
npm run storybook
```

Current quality signals in this repository:

- Vitest + Testing Library test suite
- Storybook 10 documentation and interactive examples
- strict TypeScript configuration
- `oxlint` for fast source linting
- `lefthook` for local automation

Current automated test breadth at the time of this README update:

- 60 test files
- 157 passing tests

This number reflects suite breadth, not a line-coverage percentage badge.

## Browser Support

`matsci-ui` targets modern evergreen browsers:

- current Chrome / Edge
- current Safari
- current Firefox

Because the package is ESM-first and uses modern DOM / CSS features, legacy browsers such as Internet Explorer are not supported.

## Storybook and Docs

Storybook is the main interactive documentation surface.

- Local docs: `npm run storybook`
- Static docs build: `npm run build-storybook`
- Storybook includes locale switching for English / Chinese docs pages
- Search-related stories may require `VITE_MP_API_KEY` for authenticated endpoints

## Migration from `mp-react-components`

The migration is not a simple package rename. Major changes include:

- ESM-first packaging
- Storybook 10 + Vite docs stack
- Vitest instead of Jest
- `@tanstack/react-table` instead of `react-data-table-component`
- Radix-based primitives replacing several legacy UI dependencies
- broader public exports for types and composition helpers

Start here:

- [docs/repo-diff-report.md](./docs/repo-diff-report.md)
- [docs/theming-and-style-presets.md](./docs/theming-and-style-presets.md)

## Contribution Workflow

1. Install dependencies with `npm install` or `pnpm install`
2. Run `npm test` and `npm run typecheck`
3. Validate examples in `npm run storybook`
4. Build the publishable package with `npm run build`
5. Update docs when public props, exports, or behavior changes

Contribution expectations:

- add or update tests when behavior changes materially
- keep public exports intentional and documented
- avoid reintroducing app-specific pages into the package surface
- prefer additive migration paths when changing component APIs

## Versioning Strategy

The repository currently follows a pragmatic semver-oriented strategy:

- patch: bug fixes, docs fixes, internal refactors without public behavior changes
- minor: additive components, props, exports, and non-breaking behavior improvements
- major: export removals, dependency shifts with clear consumer impact, or behavior changes that require migration work

## Roadmap

- keep aligning Search UI behavior with legacy product expectations where it improves migration
- expand docs coverage and bilingual examples
- strengthen published-package validation across React 17 / 18 / 19 consumer setups
- continue simplifying legacy compatibility layers in favor of typed, composable primitives

## Related Resources

- Legacy upstream inspiration: [materialsproject/mp-react-components](https://github.com/materialsproject/mp-react-components)
- Repository comparison: [repo-diff-report.md](./docs/repo-diff-report.md)
- Theme planning notes: [theming-and-style-presets.md](./docs/theming-and-style-presets.md)
