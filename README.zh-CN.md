# matsci-ui

中文文档。英文文档见 [README.md](./README.md)。`mp-react-components` vs `matsci-ui` 的差异说明见 [component-diff-audit.md](./docs/component-diff-audit.md)。

`@hyacinth/matsci-ui` 是面向材料科学学术研究的 React 18 组件库，提供 Bulma 风格的基础组件与一组可复用业务组件（Search UI、周期表、文献、Crystal Toolkit 等）。本仓库基于原仓库 `mp-react-components` 演进而来：https://github.com/materialsproject/mp-react-components

## 安装

```bash
npm i @hyacinth/matsci-ui
```

peerDependencies：
- `react` / `react-dom`：React 18

## 样式引入

本包会发布一个打包后的样式文件，建议在应用入口只引入一次：

```ts
import '@hyacinth/matsci-ui/style.css';
```

## 主题定制

本组件库通过 CSS 变量支持主题定制。

你可以任选其一：
- 全局主题：在根节点设置 `data-mpc-theme`
- 局部主题：在某个容器上挂主题 class

示例（深色主题）：

```ts
import '@hyacinth/matsci-ui/style.css';
import '@hyacinth/matsci-ui/themes/dark.css';
```

```ts
document.documentElement.dataset.mpcTheme = 'dark';
```

## 使用示例

```tsx
import { Modal, ModalContextProvider, ModalTrigger } from '@hyacinth/matsci-ui';

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

## 文案定制（Text 填充方案）

本组件库尽量避免在组件内部写死 UI 文案。大多数组件会提供两类可覆写入口：
- `texts?: Partial<...>`：按组件维度组织的一组文案字段（推荐）
- `ariaLabel` / `placeholder` / `buttonLabel` 等单独 props：用于覆盖个别文案

这样可以在不引入全局 i18n 运行时依赖的情况下，按需实现中英文切换/产品级文案定制。

示例（覆盖 DataTable + Paginator 文案）：

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
- 样式：`dist/index.css`，通过 `@hyacinth/matsci-ui/style.css` 暴露
