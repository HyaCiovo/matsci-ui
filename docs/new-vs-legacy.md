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
- 当前未完全迁移的重点已经不再是公开场景组件本身，而是部分旧内部路径和低价值辅助能力。

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
- `SearchUIDataCards` / `cards` 视图已回归，并接入现有 Search UI 状态流。

### Publications

- `BibCard` 已恢复按 HTML 渲染标题的兼容行为。
- `PublicationButton` 已恢复 bibliography tooltip 的 HTML 渲染。

### DataTable

- `DataTable.setProps` 已恢复旧回传结构中的 `data + selectedRows`。
- `paginationIsExpanded` 已重新接回 `Paginator` 扩展分页行为。
- `disableRichColumnHeaders` 对应的旧核心表现已恢复：
  - 富表头支持 `units`
  - 富表头支持 `tooltip`
  - 关闭后回退为纯文本表头

### Tooltip

- 已补回旧公开触发语义的主要兼容项：
  - `event`
  - `eventOff`
  - `globalEventOff`
  - `clickable`

### Periodic Table

- `SelectableTable` 已恢复旧选择语义中的一条关键兼容行为：
  - `SELECT` 模式下 `maxElementSelectable=1` 时，点击新元素会替换旧选择
- `SelectableTable.onStateChange` 已恢复旧合同：
  - 回调重新返回 `{ enabledElements, disabledElements }`
  - 新增强接口仍通过 `onTableStateChange` 保留
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
- `PeriodicTablePluginWrapper` 已补回，作为旧插件槽位结构的轻兼容封装。

## Remaining Differences

### Data Display

- `DataTable`
  - 旧库里与 `react-data-table-component` 深度绑定的一些实现细节没有逐行复刻
  - 新库当前保持公开 API 和主交互兼容，但内部实现已切换为 `@tanstack/react-table`
- `Tooltip`
  - 已补回旧触发参数的主要兼容语义
  - 但并不是旧 `react-tooltip` 的逐项等价实现

### Search UI

- 部分旧 `ColumnFormat` 仍未恢复，例如：
  - 目前高频且独立的格式化类型已补齐
  - 剩余差异主要是旧 `react-data-table-component` 时代的一些实现细节，而不是公开格式类型缺失

### Periodic Table

- `SelectableTable.showSwitcher` 暂未恢复
  - 原因：旧 prop 对应的是内建布局切换 UI
  - 新库已经把相关职责拆分为独立组件和更清晰的外部组合方式
  - 在没有完整恢复旧布局系统前，直接补一个同名 prop 会制造“有入口但行为不完整”的假兼容

### Crystal Toolkit

- 已补回旧库主要公开入口：
  - `CrystalToolkitScene`
  - `CrystalToolkitAnimationScene`
  - `PhononAnimationScene`
  - 以及运行这些组件所需的 `scene` runtime
- 已补一轮当前测试栈下的最小 smoke 验证：
  - `CrystalToolkitScene`
  - `CrystalToolkitAnimationScene`
  - `PhononAnimationScene`
  - 重点验证“可挂载、可接线、可清理”，而不是 Three 运行时的逐像素渲染结果
- 已额外补一层轻交互验证：
  - `CrystalToolkitScene` 的 settings panel 开关
  - `CrystalToolkitScene` 的导出菜单 `setProps` 回调合同
  - `CrystalToolkitAnimationScene` 的导出菜单 `setProps` 回调合同
  - `PhononAnimationScene` 的 slider -> `updateTime` 链路
- 已开始收紧 scene runtime 的类型过渡态：
  - `scene/Scene.ts`
  - `scene/animation-helper.ts`
  - `scene/constants.ts`
  - `scene/simple-scene.ts`
  - `scene/download-event.ts`
  - `scene/inset-helper.ts`
  - `scene/phonon-animation-helper.ts`
  - `scene/tooltip-helper.ts`
  - `scene/debug-helper.ts`
  - `scene/three_builder.ts`
  - `scene/RadiusTubeBufferGeometry.ts`
  - `CameraContextProvider/camera-reducer.ts`
  - `crystal-toolkit/utils.ts`
  - 上述文件已移除 `@ts-nocheck`
  - 当前 `src/` 下已无 `@ts-nocheck`
- 当前明确选择不补或暂不承诺兼容的内容：
  - `DynamicCrystalToolkitScene`
  - 旧 deep import 路径下的内部工具模块
  - 旧 runtime 的严格 TypeScript 类型精修
  - 旧的 DAE (`Collada`) 导出
- 放弃理由：
  - 前两项不是稳定包级公开 API，迁移收益明显低于维护成本
  - `DAE` 导出依赖的 `ColladaExporter` 已不再随当前 `three` 版本提供，且现代导出格式已有 `GLTF / GLB / USDZ / PNG`
  - 严格类型精修属于实现细节整理，不影响当前公开组件可用性

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
