# New Library vs Legacy Library

本文档用于说明 `mp-react18-components` 与旧库 `mp-react-components` 的差异、已补齐的兼容项，以及仍未完成的迁移点。

## Summary

- 新库已经覆盖旧库大部分常用公开组件，尤其是：
  - `data-entry`
  - `navigation`
  - `publications`
  - `data-display` 主路径
- 当前仍属于部分迁移的模块：
  - `periodic-table`
  - `crystal-toolkit`
- 未迁移的旧公开组件主要集中在 Scene 系列：
  - `Scene`
  - `CrystalToolkitScene`
  - `CrystalToolkitAnimationScene`
  - `PhononAnimationScene`

## Compatibility Work Already Added

### Search UI

- `SearchUISearchBar` 已补回旧兼容 API：
  - `className`
  - 可选的 `allowedInputTypesMap`
- `SearchUISearchBar` 已恢复旧行为：
  - 当存在 `activeFilters` 时自动隐藏周期表
  - 默认 label 回退为 `resultLabel`
- Search UI 类型层已补回旧命名兼容：
  - `SearchParam`
  - `SearchParams`
  - `FilterValues`
  - `SearchState`
  - `SearchContextValue`

### Publications

- `BibCard` 已恢复按 HTML 渲染标题的兼容行为。
- `PublicationButton` 已恢复 bibliography tooltip 的 HTML 渲染。

### DataTable

- `DataTable.setProps` 已恢复旧回传结构中的 `data + selectedRows`。

### Periodic Table

- `SelectableTable` 已恢复旧选择语义中的一条关键兼容行为：
  - `SELECT` 模式下 `maxElementSelectable=1` 时，点击新元素会替换旧选择
- `TableFilter` 已补齐旧过滤合同中的关键行为：
  - subfilter 单选
  - `Groups` 路径不过 mapper 仍可正常过滤
- `StandalonePeriodicComponent` 已补齐旧 `PeriodicElement` 的基础兼容行为：
  - `DETAILED` 模式渲染
  - 非法元素符号返回空占位
- `TableLayout` 已补回旧公开值域：
  - `SPACED`
  - `COMPACT`
  - `MAP`

## Remaining Differences

### Data Display

- `DataTable.paginationIsExpanded`
  - 旧库有扩展分页行为
  - 新库仍保留 prop，但尚未恢复旧实现
- `DataTable.disableRichColumnHeaders`
  - 旧库会影响列头渲染
  - 新库当前仍未恢复对应行为
- `Tooltip`
  - 旧库支持更多自定义触发参数，如：
    - `event`
    - `eventOff`
    - `globalEventOff`
    - `clickable`
  - 新库当前主打 hover / focus 触发，尚未完整补齐这些旧交互语义

### Search UI

- `SearchUIDataCards` / `cards` 视图仍未回归
- 部分旧 `ColumnFormat` 仍未恢复，例如：
  - `BOOLEAN_CLASS`
  - `SPACEGROUP_SYMBOL`
  - `POINTGROUP`
  - `EMAIL`
  - `TAG`
  - `DICT`
  - `CONTRIBS_FILES_DOWNLOAD`
  - `PUBLICATION`

### Periodic Table

- `SelectableTable` 还没有恢复旧版内建布局切换 UI `showSwitcher`
- `PeriodicTablePluginWrapper` 仍未作为新库公开组件回归

### Crystal Toolkit

- 仍缺少旧库的 Scene 系列入口：
  - `Scene`
  - `CrystalToolkitScene`
  - `CrystalToolkitAnimationScene`
  - `PhononAnimationScene`

## Export Status

### Fully or Mostly Migrated

- `data-display`
- `data-entry`
- `navigation`
- `publications`

### Partially Migrated

- `periodic-table`
- `crystal-toolkit`

## Documentation Structure

- `README.md`
  - 英文
  - 只介绍组件功能和使用方式
- `README.zh-CN.md`
  - 中文
  - 只介绍组件功能和使用方式
- `docs/new-vs-legacy.md`
  - 新旧库差异、兼容补齐状态、剩余缺口
