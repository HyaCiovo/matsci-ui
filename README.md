# matsci-ui

English documentation. For Chinese, see [README.zh-CN.md](./README.zh-CN.md). For `mp-react-components` vs `matsci-ui` comparison, see [component-diff-audit.md](./docs/component-diff-audit.md).

`@hyacinth/matsci-ui` is a React 18 component library for materials science research UI. It ships Bulma-based styling plus reusable building blocks (Search UI, periodic table, publications, crystal toolkit, etc). It is based on the original `mp-react-components` repository: https://github.com/materialsproject/mp-react-components

## Install

```bash
npm i @hyacinth/matsci-ui
```

Peer dependencies:
- `react` / `react-dom`: React 18

## Styles

The package publishes a bundled stylesheet. Import it once in your app entry:

```ts
import '@hyacinth/matsci-ui/style.css';
```

## Themes

This library supports theme customization via CSS variables.

Pick one approach:
- Global theme: set `data-mpc-theme` on the document root.
- Scoped theme: wrap your app with a theme class.

See [theming-and-style-presets.md](./docs/theming-and-style-presets.md) for the multi-preset plan (Bulma ↔ shadcn).

Example (dark theme):

```ts
import '@hyacinth/matsci-ui/style.css';
import '@hyacinth/matsci-ui/themes/dark.css';
```

```ts
document.documentElement.dataset.mpcTheme = 'dark';
```

## Usage

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

```tsx
import { SearchUIContainer, SearchUISearchBar, SearchUIDataTable } from '@hyacinth/matsci-ui';

const columns = [
  { title: 'Material ID', selector: 'material_id' },
  { title: 'Formula', selector: 'formula_pretty' },
];

export function DemoSearchUI() {
  return (
    <SearchUIContainer columns={columns} resultLabel="material" searchOnMount={false}>
      <SearchUISearchBar
        allowedInputTypesMap={{
          formula: { field: 'formula' },
          elements: { field: 'elements' },
          mpid: { field: 'material_ids' },
        }}
      />
      <SearchUIDataTable />
    </SearchUIContainer>
  );
}
```

## Text Customization

This library avoids hard-coded UI strings by design. Most components expose either:
- a `texts?: Partial<...>` prop (structured, component-scoped strings), or
- dedicated props like `ariaLabel`, `placeholder`, `buttonLabel`, etc. for one-off overrides.

This enables i18n and product-specific wording without introducing a global i18n runtime dependency.

Example (override DataTable + Paginator copy):

```tsx
import { DataTable } from '@hyacinth/matsci-ui';

<DataTable
  data={data}
  columns={columns}
  texts={{
    columns: '列',
    selectAll: '全选',
    rowsPerPage: '每页行数',
    pageSummaryTemplate: '{start}-{end} / 共 {total}',
    paginator: {
      previous: '上一页',
      next: '下一页',
      jumpTo: '跳转到',
    },
  }}
/>;
```

## Public API

- The package entry is [src/index.ts](./src/index.ts).
- A canonical list of exported symbols can also be obtained from `dist/index.d.ts` after `npm run build`.

## Development

```bash
npm i
npm test
npm run build
npm run storybook
```

Storybook notes:
- Some Search UI stories require `VITE_MP_API_KEY` for API access.
- Heavy stories disable `searchOnMount` by default to avoid request storms.

## Packaging

- ESM-only output (`exports.import` → `dist/index.js`)
- Types: `dist/index.d.ts`
- Styles: `dist/index.css` exposed as `@hyacinth/matsci-ui/style.css`
