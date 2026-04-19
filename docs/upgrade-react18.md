# mp-react18-components React 18 升级技术方案

## 1. 目标

- 基于 `mp-react-components` 的现状，产出一个面向 React 18 的新一代组件库 `mp-react18-components`。
- 不做“最低成本兼容”，而是同步清理过时依赖、测试栈和开发工具链。
- 保留原有业务组件能力：周期表、SearchUI、数据录入、数据展示、导航、文献卡片、three.js 晶体场景。
- 对宿主应用暴露稳定的 React 18 组件 API，并为后续兼容 React 19 留出空间。

## 2. 升级原则

- React 作为宿主依赖而不是库内部运行时依赖。
- 优先替换维护停滞、peer 依赖落后、对 Strict Mode 不友好的第三方包。
- UI 基础交互统一收敛到 Radix UI 原语，减少菜单、弹层、标签页、对话框体系的碎片化。
- 先打通运行时最小闭环，再升级测试、文档和构建发布链路。
- 所有副作用逻辑按 React 18 Strict Mode 双调用标准治理。

## 3. 当前阻塞点

结合旧库源码和 `upgrade.md`，React 18 升级的硬阻塞主要有以下几类：

- React 版本仍是 `react@16.14`、`react-dom@16.14`，并且放在 `dependencies`。
- 开发入口仍使用 `ReactDOM.render`，不符合 React 18 根节点挂载方式。
- 测试初始化仍依赖 `enzyme` 与 `enzyme-adapter-react-16`。
- 交互类依赖存在明显老化：
  - `react-aria-menubutton`
  - `react-tabs@3`
  - `react-json-view`
  - `react-tooltip@4`
  - `react-data-table-component@6`
- 部分组件直接依赖旧包的实现细节，不能只改 `package.json`。
- `three.js` 场景、tooltip、请求流和 ResizeObserver 相关逻辑需要补齐幂等清理。

## 4. 目标技术栈

### 4.1 React 与类型

- `react`: `^18.3.1`
- `react-dom`: `^18.3.1`
- `@types/react`: `^18`
- `@types/react-dom`: `^18`
- `typescript`: 升级到 `^5.5` 或以上

### 4.2 UI 原语与交互

- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-tabs`
- `@radix-ui/react-tooltip`
- `@radix-ui/react-dialog`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-slot`
- `@floating-ui/react` 或仅在必要时配合 Radix 使用

### 4.3 表格与数据视图

- 优先方案：`@tanstack/react-table`
- 可选辅助：自建分页、排序、列显示控制层
- 如果需要开箱即用虚拟滚动，再评估 `@tanstack/react-virtual`

### 4.4 测试与文档

- `vitest` + `@testing-library/react` + `@testing-library/user-event`
- `jsdom`
- `storybook@8`
- `@storybook/react-vite`

### 4.5 工程质量与提交流程

- `oxlint`
- `lefthook`
- `prettier`
- `typescript --noEmit`

### 4.6 构建与样式

- 组件库打包主方案：`Rollup`
- TS/JS 转译优先：`@rollup/plugin-swc`
- 备用简化方案：`tsup`
- demo / story 预览：`vite`
- 样式方案明确沿用 `mp-react-components` 现有体系：`Bulma` + 组件级 `CSS/Less` + 现有 class 命名
- React 18 升级阶段不做样式体系重构，不引入新的 CSS-in-JS 或原子化样式方案

## 5. 依赖替换矩阵

| 旧依赖 | 处理策略 | 新方案 | 影响范围 |
| --- | --- | --- | --- |
| `react-aria-menubutton` | 直接移除 | `@radix-ui/react-dropdown-menu` | `Dropdown`、`SortDropdown`、`ColumnsMenu`、`DownloadDropdown`、`BibFilter`、`SearchUIDataHeader`、`Paginator`、`PeriodicTableModeSwitcher`、`MaterialsInput` |
| `react-tabs@3` | 直接移除 | `@radix-ui/react-tabs` | `Tabs` |
| `react-tooltip@4` | 直接移除 | `@radix-ui/react-tooltip` | `Tooltip`、`Sidebar`、`CrystalToolkitScene`、`CrystalToolkitAnimationScene`、`PhononAnimationScene` |
| `react-json-view` | 替换 | `@microlink/react-json-view` 或自建 `JsonTree` | `JsonView` |
| `react-data-table-component@6` | 优先替换 | `@tanstack/react-table` + 自建表格外壳 | `DataTable`、`SearchUIDataTable` |
| `classnames` | 替换 | `clsx` | 全量 `className` 拼接逻辑 |
| `enzyme` + `enzyme-adapter-react-16` | 直接移除 | `Testing Library` + `Vitest` | 全量测试 |
| `parcel-bundler@1` | 直接移除 | `vite` | demo / playground |
| `storybook@6.5` | 升级 | `storybook@8` | 文档与交互演示 |
| `react-router-dom@5` | 暂可保留于 demo，建议升级 | `react-router-dom@6` | `src/app.tsx`、demo 路由页 |

## 6. 包声明方案

组件库需要改成标准的 React 18 库声明方式：

- `react`、`react-dom` 从 `dependencies` 移出。
- 在 `peerDependencies` 中声明：

```json
{
  "peerDependencies": {
    "react": "^18.2.0 || ^18.3.0",
    "react-dom": "^18.2.0 || ^18.3.0"
  }
}
```

- 在 `devDependencies` 中安装本地开发所需的 React 18。
- 打包配置继续将 `react`、`react-dom` 设为 external，避免宿主项目出现双 React 实例。
- 样式资源继续兼容旧库的引入方式，避免宿主应用因为升级 React 18 而被迫同步重写样式接入层。

## 7. 组件分域改造方案

### 7.1 导航与菜单体系

#### 目标

把所有菜单、下拉、二级菜单、通知弹层统一到 Radix 风格的可访问性原语上。

#### 改造对象

- `Dropdown`
- `NavbarDropdown`
- `NotificationDropdown`
- `SortDropdown`
- `ColumnsMenu`
- `DownloadDropdown`
- `BibFilter` 中的排序菜单
- `Paginator` 中的选择菜单
- `PeriodicTableModeSwitcher`
- `MaterialsInput` 中的输入类型菜单

#### 实施策略

- 新建共享底层封装：
  - `MenuRoot`
  - `MenuTrigger`
  - `MenuContent`
  - `MenuItem`
  - `MenuCheckboxItem`
  - `MenuRadioGroup`
- 由业务组件消费统一封装，而不是直接散落使用 Radix API。
- 保留 `mp-react-components` 现有 Bulma 视觉 class 和 CSS/Less 结构，但交互语义切换到 Radix。
- 对 Dash 风格的 `setProps` 输出保留兼容层，只调整内部实现。

#### 预期收益

- 移除 `react-aria-menubutton` 的兼容风险。
- 键盘导航、焦点管理、关闭时机和 aria 属性更可靠。
- 后续 Dropdown、Tooltip、Dialog 的弹层定位模型更统一。

### 7.2 Tabs 体系

#### 目标

以 `@radix-ui/react-tabs` 重写 `Tabs` 组件，同时保留“激活后缓存内容”的行为。

#### 实施策略

- 保留外部 props：
  - `labels`
  - `tabIndex`
  - `setProps`
- 内部从 `react-tabs` 改成 Radix Tabs。
- 针对当前 `CachedTab` 行为，继续保留“首次激活才挂载，激活后不卸载”的缓存层。
- 统一 `selectedIndex` / `value` 映射，避免外部 API 破坏性变化。

### 7.3 Tooltip、Modal、Drawer 体系

#### 目标

建立统一弹层体系，减少多套 tooltip / dialog 实现共存。

#### 实施策略

- `Tooltip` 迁移到 `@radix-ui/react-tooltip`。
- `Modal` / `ModalTrigger` / `ModalContextProvider` 迁移到 `@radix-ui/react-dialog`。
- `Drawer` 优先基于 `@radix-ui/react-dialog` 做右侧抽屉封装，而不是继续维护自定义实现。
- 对 three.js 场景内 tooltip，区分两类能力：
  - DOM 提示类：交给 Radix Tooltip
  - 3D 场景内 hover 标签：保留 scene 内部逻辑，但不再复用旧 `react-tooltip`

#### 额外要求

- 所有弹层必须支持 Strict Mode 下重复挂载和销毁。
- 所有 portal 节点、事件绑定、定时器都要在 effect cleanup 中完整释放。

### 7.4 DataTable 与 SearchUI 表格

#### 目标

用 `@tanstack/react-table` 接管数据表格核心逻辑，消除 `react-data-table-component@6` 的升级风险。

#### 改造对象

- `DataTable`
- `SearchUIDataTable`
- 与列显示相关的 `ColumnsMenu`
- 与分页相关的 `Paginator`

#### 实施策略

- 拆出表格核心能力：
  - 排序
  - 分页
  - 行选择
  - 条件样式
  - 列显隐
  - 自定义 footer
- 新的 `DataTable` 保持旧 props 风格，但内部映射到 TanStack Table。
- `SearchUIDataTable` 只保留 SearchUI 业务装配，不再直接绑定第三方表格库 API。
- 如果现有 `conditionalRowStyles` 逻辑复杂，先保留适配层，再在第二阶段逐步收敛成 className 回调。

#### 预期收益

- React 18 兼容性更可控。
- 表格核心能力不再受单一老库限制。
- 后续可以按需加虚拟滚动和服务端排序。

### 7.5 JsonView

#### 目标

替换停滞的 `react-json-view`，消除 React 18 下的潜在兼容问题和类型缺陷。

#### 实施策略

- 方案 A：替换为 `@microlink/react-json-view`。
- 方案 B：如果外部编辑能力并不需要，直接自建只读 `JsonTree` 组件。
- 当前源码里 `onEdit` / `onAdd` / `onDelete` 都是空实现，因此优先推荐只读化简方案。

#### 建议

- `JsonView` 新版 API 只保留实际用到的 props。
- 移除无意义的编辑回调透传，降低包体积和行为复杂度。

### 7.6 MaterialsInput 与周期表输入联动

#### 目标

把 `MaterialsInput` 从“旧菜单库绑定组件”重构为“React 18 兼容的受控输入组件 + 周期表状态容器”。

#### 实施策略

- 输入类型切换菜单改用 Radix Dropdown Menu。
- 自动补全网络请求增加取消控制：
  - `AbortController`
  - 请求序号比较
  - 组件卸载后不再提交 state
- 周期表选择上下文继续保留，但清理不必要的跨组件隐式耦合。
- 输入框逻辑和菜单逻辑分层：
  - `MaterialsInputBox`
  - `InputTypeMenu`
  - `PeriodicSelectionBridge`

#### 风险

- 这是 SearchUI 和 GlobalSearchBar 的底层依赖，必须优先回归测试。

### 7.7 SearchUI

#### 目标

让 SearchUI 在 React 18 下具备稳定的请求、URL 同步和视图切换行为。

#### 实施策略

- 请求流统一增加 stale request 防护。
- URL 状态同步与筛选状态分离，避免 effect 相互触发形成重复请求。
- 数据表格视图切换基于新 `DataTable` 实现。
- 过滤器中的选择器、三态布尔、下拉菜单统一迁移到 React 18 兼容实现。
- 若 `use-query-params` 当前版本与 React Router 6 升级冲突，先在 React 18 阶段冻结 SearchUI 路由 API，待 demo 路由升级后再切换。

#### 优先回归场景

- 初始加载
- URL 带筛选项直达
- 翻页与排序
- 切换视图
- 快速连续修改筛选项

#### 收尾结论

`SearchUI` 已完成迁移收尾，当前可按“主干行为兼容已达成”处理。

#### 已对齐

- legacy query key 与请求协议：
  - `_sort_fields`
  - `_limit`
  - `_skip`
  - `_fields`
  - `apiEndpointParams`
  - `totalKey`
- URL 行为：
  - 初始 URL hydrate
  - `replaceState` 回写
  - 浏览器 `popstate` 反同步
- context / hooks：
  - 扁平 React 18 context
  - legacy `state + query` 兼容形状
  - `useSearchUIContextActions()`
- 交互主链路：
  - filters
  - search bar 输入类型回推与 URL 回填
  - pagination / sorting / secondary sort
  - `table / synthesis` 视图切换
  - matscholar 两段式搜索
- 交付物：
  - 组件级 stories
  - 顶层 `SearchUIContainer` 组合 story
  - `MatscholarAlpha` story
  - SearchUI 主链路聚焦测试

#### 有意简化

- 旧 `ActiveFilterButtons`、`SortDropdown`、`Paginator` 等子组件未逐个 1:1 恢复，而是以内联或轻量实现承接原有交互语义。
- `cards` 视图未恢复为主路径，保留 `table / synthesis` 两条当前有效视图。
- 部分视觉细节因 Radix UI 和新表格壳层替代而与旧仓库存在轻微样式差异。

#### 当前验证基线

- `SearchUIQuery.test.tsx`
- `SearchUISearchBar.test.tsx`
- `MatscholarSearchUI.test.tsx`
- `SearchUIDataView.test.tsx`
- `SearchUIFilters.test.tsx`
- `npm run typecheck`

### 7.8 three.js 晶体场景

#### 目标

让三维场景组件通过 React 18 Strict Mode 验证，避免重复初始化和内存泄漏。

#### 改造对象

- `CrystalToolkitScene`
- `CrystalToolkitAnimationScene`
- `PhononAnimationScene`
- `Scene`
- `CameraContextProvider`

#### 实施策略

- 所有 imperative 初始化都加幂等保护：
  - renderer
  - controls
  - animation loop
  - resize observer
  - DOM listeners
- 把“创建实例”和“更新实例”分成两个 effect。
- 对动画类场景增加显式销毁和停止逻辑。
- 统一处理图片导出、模型导出、tooltip 销毁。

#### 验收标准

- Strict Mode 下无重复 canvas 挂载。
- 切换页面或组件卸载后无残留 RAF 循环。
- 多个场景共享相机状态时无订阅泄漏。

## 8. 测试体系升级

### 8.1 结论

Enzyme 不再保留，整体迁移到 Testing Library。

### 8.2 方案

- 删除：
  - `enzyme`
  - `enzyme-adapter-react-16`
  - `@types/enzyme`
  - `@types/enzyme-adapter-react-16`
- 重写 `jest-setup.ts` 或直接改为 `vitest.setup.ts`：
  - 保留 `@testing-library/jest-dom`
  - 保留 `msw`
  - 保留 `ResizeObserver` polyfill
- 全部测试从“实例/内部状态断言”迁移到“用户可见行为断言”

### 8.3 优先补测组件

- `MaterialsInput`
- `SearchUI`
- `DataTable`
- `Dropdown`
- `Tabs`
- `Tooltip`
- `CrystalToolkitScene`

## 9. 构建与文档链路升级

### 9.1 Demo / Playground

- 删除 `parcel-bundler@1`
- 改用 `vite` 搭建本地 playground
- 开发入口使用 `createRoot`

### 9.2 Storybook

- 升级到 `storybook@8`
- builder 改为 `@storybook/react-vite`
- 优先恢复主干 stories：
  - DataTable
  - MaterialsInput
  - SearchUI
  - Dropdown
  - Tabs
  - Tooltip
  - CrystalToolkitScene

### 9.3 打包

- 主方案采用 `Rollup`，因为组件库需要更细粒度控制 external、样式产物、包入口和多格式输出
- 在 `Rollup` 中使用 `SWC` 作为 TS/JS 转译器，兼顾构建速度与现代语法支持
- `tsup` 作为备用或子包快速构建方案，适合纯逻辑包、hooks 包或内部实验组件
- 输出格式建议：
  - `esm`
  - `cjs`
  - 类型声明 `d.ts`
- React、ReactDOM、Radix UI 原语按需 external 或 bundle 策略统一定义
- 样式产物需要继续兼容旧库的 `Bulma + CSS/Less` 组织方式，优先抽离为独立样式文件而不是运行时注入
- 现有组件样式文件尽量原样迁移，升级阶段只处理与 React 18 或新交互原语直接相关的最小改动

### 9.3.1 样式迁移约束

- 沿用 `mp-react-components` 的样式设计，不重写视觉体系
- 沿用现有组件目录下的 `.css` / `.less` 文件组织方式
- 沿用 Bulma 语义类和现有 `mpc-*` class 命名习惯
- 新增的 Radix 封装层只负责交互和可访问性，不主导视觉风格
- 如果 Radix 默认行为需要额外状态类，仅补充最小样式桥接，不推翻旧样式结构

### 9.4 推荐工程化基线

- Lint：使用 `oxlint` 作为首层快速静态检查，覆盖未使用变量、可疑逻辑、常见 React/TS 代码味道
- 类型检查：使用 `tsc --noEmit` 作为发布前强校验
- Git hooks：使用 `lefthook` 管理 `pre-commit` 和 `pre-push`
- 格式化：保留 `prettier`
- 单测：`vitest --run`

推荐 hooks 如下：

```yaml
pre-commit:
  parallel: true
  commands:
    oxlint:
      run: pnpm oxlint .
    prettier:
      run: pnpm prettier --check .

pre-push:
  commands:
    typecheck:
      run: pnpm typecheck
    test:
      run: pnpm test -- --run
```

### 9.5 推荐打包配置策略

- 默认使用 `Rollup + SWC` 构建主包：
  - 适合多入口组件库
  - 更容易精确控制 `exports`
  - 更容易处理 CSS/Less、图片资源和 peerDependencies external
- 在以下场景可引入 `tsup`：
  - 构建内部工具子包
  - 构建不含复杂样式的 hooks/utilities 子入口
  - 本地快速验证小型包输出
- 不建议一开始只使用 `vite library mode` 作为主打包方案，因为后续组件库多入口、样式抽离和发布策略往往仍需 Rollup 级别控制

建议依赖组合：

```json
{
  "devDependencies": {
    "oxlint": "^0.0.0",
    "lefthook": "^1.0.0",
    "rollup": "^4.0.0",
    "@rollup/plugin-swc": "^0.0.0",
    "rollup-plugin-dts": "^6.0.0",
    "tsup": "^8.0.0"
  }
}
```

## 10. 迁移顺序

### 阶段 1：仓库骨架

- 新建 `mp-react18-components`
- 初始化 React 18、TypeScript 5、Vite、Vitest、Storybook 8
- 初始化 `oxlint`、`lefthook`
- 初始化 `Rollup + SWC` 主打包链路，并预留 `tsup` 子包构建能力
- 迁移旧库的 Bulma、CSS、Less 样式组织方式，确保新仓库先具备样式兼容底座
- 配置 peerDependencies、构建脚本、lint/test/build 流程

### 阶段 2：基础原语层

- 先落地 Radix 基础封装：
  - Dropdown Menu
  - Tabs
  - Tooltip
  - Dialog / Drawer
- 输出统一 className 和受控/非受控接口规范

### 阶段 3：主干业务组件

- `MaterialsInput`
- `DataTable`
- `SearchUI`
- `Navbar` / `Dropdown`
- `Tabs`

### 阶段 4：高风险场景组件

- `CrystalToolkitScene`
- `CrystalToolkitAnimationScene`
- `PhononAnimationScene`
- `JsonView`

### 阶段 5：收尾与回归

- 恢复 storybook 文档
- 补齐测试
- 与宿主应用联调
- 评估 React 19 兼容项

## 11. 建议的目录结构

```text
mp-react18-components/
  src/
    primitives/
      dropdown-menu/
      tabs/
      tooltip/
      dialog/
      drawer/
    components/
      data-entry/
      data-display/
      navigation/
      periodic-table/
      crystal-toolkit/
      publications/
      search/
    hooks/
    utils/
    styles/
  stories/
  tests/
```

## 12. 交付标准

- 库以 React 18 peer 依赖方式发布。
- 主干组件在 React 18 Strict Mode 下无明显警告和重复副作用问题。
- 所有过时核心依赖被替换或升级，不再保留 `react-aria-menubutton`、`enzyme`、`react-tooltip@4`、`react-tabs@3`、`parcel-bundler@1`。
- `DataTable`、`MaterialsInput`、`SearchUI`、`Dropdown`、`Tabs`、`CrystalToolkitScene` 具备可运行 story 和核心测试。
- demo、storybook、构建发布链路可在现代 Node 环境下稳定运行。

## 13. 推荐结论

`mp-react18-components` 不建议在原仓库里做“小修小补式升级”，而应采用“React 18 重建基础原语层 + 主干业务组件迁移”的策略。

最关键的架构决策如下：

- React 改为 peerDependencies。
- UI 原语统一迁移到 Radix UI。
- 表格从 `react-data-table-component` 切换到 `@tanstack/react-table`。
- Tooltip / Modal / Drawer 不再继续维护旧式第三方封装。
- 测试完全放弃 Enzyme。
- three.js 场景组件按 Strict Mode 标准重构副作用。

这条路线的优点是迁移成本虽然高于“直接改版本号”，但能一次性解决旧依赖、可访问性、类型系统、测试可维护性和未来 React 19 兼容问题。
