# mp-react18-components

English documentation. For Chinese, see [README.zh-CN.md](./README.zh-CN.md). For `mp-react-components` vs `mp-react18-components` comparison, see [component-diff-audit.md](./docs/component-diff-audit.md).

`@hyacinth/mp-react18-components` is a React 18 component library used by Materials Project UI surfaces. It ships Bulma-based styling plus reusable building blocks (Search UI, periodic table, publications, crystal toolkit, etc).

## Install

```bash
npm i @hyacinth/mp-react18-components
```

Peer dependencies:
- `react` / `react-dom`: React 18

## Styles

The package publishes a bundled stylesheet. Import it once in your app entry:

```ts
import '@hyacinth/mp-react18-components/style.css';
```

## Usage

```tsx
import { Modal, ModalContextProvider, ModalTrigger } from '@hyacinth/mp-react18-components';

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
import { SearchUIContainer, SearchUISearchBar, SearchUIDataTable } from '@hyacinth/mp-react18-components';

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
- Styles: `dist/index.css` exposed as `@hyacinth/mp-react18-components/style.css`
