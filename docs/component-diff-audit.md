# mp-react-components vs mp-react-components-next

本文件用于快速回答“旧库 mp-react-components 与新库 mp-react-components-next 差在哪”。定位是“迁移/集成决策文档”，不是逐行代码 diff。

更新时间：2026-04-21

## 对比口径

- 旧库（mp-react-components）：以 `src/index.ts` 的 `export { ... }` 作为公开 API。
- 新库（mp-react-components-next）：以 `npm run build` 后的 `dist/index.d.ts` 的 `export { ... }` 作为公开 API。

> 说明：新库源码入口在 `src/index.ts`，但它使用了 `export * from ...` 的 barrel 方式；用 `dist/index.d.ts` 更贴近“实际发布到 npm 的导出面”。

## 结论摘要

- 公开导出数量：
  - 旧库：57
  - 新库：151
  - 交集：56
  - 仅旧库存在：`Scene`
- 迁移结论：
  - 新库在“包根导出符号层面”基本是旧库的超集，唯一缺口是 `Scene`。
  - 但多个组件的底层实现发生了替换（不一定是破坏性 API 变更，但行为/样式/边界条件可能不同），典型集中在：`DataTable`、`Tooltip`、`JsonView`、`SelectableTable`、`SearchUI`。

## 公开导出差异（重点）

### 旧库有、新库没有

- `Scene`（Crystal Toolkit runtime）
  - 旧库：`export { Scene }`（`src/index.ts`）
  - 新库：不再从包根导出
  - 迁移建议：优先使用 `CrystalToolkitScene` / `CrystalToolkitAnimationScene` / `PhononAnimationScene`；若确实需要 runtime，建议不要依赖包根导出（避免未来再次破坏），改为内部路径引入并自行承担兼容成本。

### 新库新增（相对旧库）

新库新增导出主要来自两类：

- **组件新增或从“目录存在但未导出”升级为公开导出**
  - `DataCard`、`Paginator`、`SortDropdown`、`ActiveFilterButtons`、`ArrayChips`、`ButtonBar`
  - 表单组件：`Input`、`Checkbox`、`CheckboxList`、`TextInput`、`ThreeStateBooleanSelect`
- **类型/工具/Context 显式导出（便于组合开发）**
  - Search UI：`FilterType`、`ColumnFormat`、`parseSearchQuery`、`serializeSearchQuery`、`preprocessQueryParams`、`searchUIViewsMap` 等
  - Periodic table：`PeriodicSelectionContext` / Provider / hooks 等
  - 常量：`pointGroups`、`spaceGroups`、`ELEMENTS_REGEX` 等

## 工程与发布差异

### 模块格式

- 旧库：历史上以 CJS 为主，现仓库已设置为 `type: "module"`，但依赖链仍包含大量旧时代库（Jest、Storybook 6、Parcel 等）。
- 新库：ESM-only 发布（`exports.import` → `dist/index.js`），同时发布 `dist/index.d.ts` 与 `dist/index.css`（通过 `./style.css` 子路径导出）。

### 样式交付

- 新库推荐使用：
-  - `import '@hyacinth/mp-react-components-next/style.css'`
  - 该 CSS 由 Bulma + 本库 CSS/Less 统一打包输出。

## 组件实现替换（常见迁移坑）

- `DataTable`
  - 旧库：`react-data-table-component`
  - 新库：`@tanstack/react-table`
  - 影响：排序/分页/选择列实现与 DOM 结构会不同；若你依赖旧库 DOM 细节（例如测试选择器），需要重新对齐。
- `Tooltip`
  - 旧库：`react-tooltip`
  - 新库：Radix Tooltip + 兼容层
  - 影响：触发/定位与 `data-tooltip-*` 属性的兼容细节可能不同。
- `JsonView`
  - 旧库：`react-json-view`
  - 新库：`@microlink/react-json-view`
  - 影响：渲染与交互细节不同；编辑能力在两者里都不是主路径。
- `RxJS`
  - 旧库：在多个区域使用 `rxjs`
  - 新库：已移除 `rxjs`（例如下载事件总线用原生订阅实现替代）

## Storybook / 文档差异

- 旧库文档更偏“对外开源 + Dash 端口说明”。
- 新库文档更偏“作为可发布组件库 + 对齐旧版 UI 行为 + 生产可用的测试基线”。

## 附：如何生成导出清单

- 新库：
  - `npm run build`
  - 查看 `dist/index.d.ts` 的 `export { ... }` 行
- 旧库：
  - 查看 `src/index.ts` 的 `export { ... }` 块
