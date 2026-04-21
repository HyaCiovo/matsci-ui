# mp-react18-components

中文文档。英文文档见 [README.md](./README.md)。`mp-react-components` vs `mp-react18-components` 的差异说明见 [component-diff-audit.md](./docs/component-diff-audit.md)。

`@hyacinth/mp-react18-components` 是面向 Materials Project UI 的 React 18 组件库，提供 Bulma 风格的基础组件与一组可复用业务组件（Search UI、周期表、文献、Crystal Toolkit 等）。

## 安装

```bash
npm i @hyacinth/mp-react18-components
```

peerDependencies：
- `react` / `react-dom`：React 18

## 样式引入

本包会发布一个打包后的样式文件，建议在应用入口只引入一次：

```ts
import '@hyacinth/mp-react18-components/style.css';
```

## 使用示例

```tsx
import { Modal, ModalContextProvider, ModalTrigger } from '@hyacinth/mp-react18-components';

export function DemoModal() {
  return (
    <ModalContextProvider>
      <ModalTrigger>
        <button type="button">打开</button>
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

## 公共导出

- 包根导出入口见 [src/index.ts](./src/index.ts)。
- `npm run build` 后的 `dist/index.d.ts` 也能直接作为导出清单参考。

## 开发

```bash
npm i
npm test
npm run build
npm run storybook
```

Storybook 说明：
- 部分 Search UI stories 需要设置 `VITE_MP_API_KEY` 才能访问接口。
- 高成本 stories 默认关闭 `searchOnMount`，避免打开页面就触发请求风暴。

## 发布产物

- 仅发布 ESM（`exports.import` → `dist/index.js`）
- 类型声明：`dist/index.d.ts`
- 样式：`dist/index.css`，通过 `@hyacinth/mp-react18-components/style.css` 暴露
