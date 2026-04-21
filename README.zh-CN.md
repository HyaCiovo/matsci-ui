# matsci-ui

中文文档。英文版见 [README.md](./README.md)。迁移与仓库对比说明见 [repo-diff-report.md](./docs/repo-diff-report.md)。

`@hyacinth/matsci-ui` 是一个面向材料科学产品与研究场景的 React 组件库。它基于历史仓库 `mp-react-components` 演进而来，但定位已经从“混合了 demo、页面和历史兼容逻辑的源码仓库”，收敛为“面向 npm 发布、ESM 优先、类型完善、文档可维护”的现代组件库。

## 项目背景

旧仓库 `mp-react-components` 同时承载了可复用组件、页面级 demo、Dash 集成习惯以及历史发布流程。当前仓库则将重点放在真正可发布、可消费的组件库表面：

- 面向材料科学产品的可复用 UI 组件
- 面向 REST API 数据集的搜索式组合能力
- 周期表驱动的数据录入与化学式解析能力
- 文献与出版物辅助组件
- Crystal Toolkit 可视化组件
- 以 Storybook 为核心的文档与交互演示体系

如果你的目标是“安装一个可直接消费的组件库包”，本仓库是推荐基线。

## 功能概览

### 组件家族

- **Search UI**
  - 提供容器、搜索栏、筛选面板、数据头部、数据表格、网格、卡片和合成配方视图
  - 支持查询参数序列化、排序 / 分页联动、列配置、条件行样式
- **Data Entry**
  - `MaterialsInput`、周期表选择器、滑块、选择器、开关、复选框、文本输入
- **Data Display**
  - `DataTable`、`DataBlock`、`DataCard`、`Markdown`、`JsonView`、`Tooltip`、`Modal`、`Drawer`、`Paginator`
- **Navigation**
  - `Dropdown`、`Navbar`、`NavbarDropdown`、`NotificationDropdown`、`Scrollspy`、`Tabs`、`Sidebar`、`Link`、`Accordion`
- **Publications**
  - `BibCard`、`BibFilter`、`BibjsonCard`、`BibtexButton`、`CrossrefCard`、`OpenAccessButton`、`PublicationButton`
- **Crystal Toolkit**
  - `CrystalToolkitScene`、`CrystalToolkitAnimationScene`、`PhononAnimationScene`、`ReactGraphComponent`、`Download`

### 技术栈选择

- **样式系统**：Bulma + 本地 CSS/Less
- **无头基础组件**：Radix UI
- **表格能力**：`@tanstack/react-table`
- **Markdown / 数学公式**：`react-markdown`、`remark-math`、`rehype-katex`
- **三维可视化**：`three`
- **文档体系**：Storybook 10 + docs blocks
- **测试体系**：Vitest + Testing Library + jsdom

## 架构说明

### 仓库结构

```text
src/
  components/          组件库主体
  constants/           点群、空间群等领域常量
  stories/             Storybook stories 与 MDX 文档
  text/                文案模板与文案合并工具
  theme/               主题规划与 Token 实验
  utils/               跨组件公共工具
.storybook/            Storybook 运行时与代理配置
docs/                  迁移说明与仓库对比报告
scripts/               构建辅助脚本
```

### 设计原则

- 优先提供“容器 + 子组件”的组合式 API，而不是页面级封装
- 在能提升二次封装体验时，显式导出 TypeScript 类型与工具函数
- 默认提供完整打包样式，主题抽象仍处于规划阶段
- 消费端文案通过 `texts` 或显式 label props 控制，避免强制绑定全局 i18n 运行时
- 以 Storybook 作为使用方式与行为示例的权威入口

## 安装

```bash
npm install @hyacinth/matsci-ui
```

peerDependencies：

- `react`：`^17.0.0 || ^18.0.0 || ^19.0.0`
- `react-dom`：`^17.0.0 || ^18.0.0 || ^19.0.0`

推荐运行环境：

- Node.js `^20.19.0 || ^22.12.0`
- 支持 ESM 的现代构建工具

## 快速开始

建议在应用入口只引入一次样式：

```ts
import '@hyacinth/matsci-ui/style.css';
```

### 示例：Modal

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

### 示例：Search UI

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

### 示例：MaterialsInput

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

## 按需使用与 Tree Shaking

本包以 ESM 形式发布，推荐的消费方式是：

- 只从 `@hyacinth/matsci-ui` 按需导入实际使用到的符号
- 在应用入口统一引入一次 `@hyacinth/matsci-ui/style.css`
- 依赖宿主构建工具对未使用的 JavaScript 导出做 tree shaking

示例：

```tsx
import { DataTable, Paginator, MaterialsInput } from '@hyacinth/matsci-ui';
```

## 样式与主题现状

当前库真正稳定可用的样式方案只有一条：打包后的 Bulma 基础样式加组件级 CSS/Less。仓库里虽然已经存在 [`src/theme/tokens.css`](./src/theme/tokens.css) 与 [theming-and-style-presets.md](./docs/theming-and-style-presets.md) 这类主题规划文件，但它们目前应视为“规划与探索”，而不是已经正式落地、可对外承诺兼容性的主题 API。

目前可以确认的事实是：

- 消费端应以 `@hyacinth/matsci-ui/style.css` 作为正式样式入口
- 组件输出的 DOM 结构与 className 仍然建立在 Bulma 体系和现有组件样式之上
- 当前没有正式发布 `dark.css`、`materials.css`、`shadcn.css` 之类可切换预设
- Token 命名与 preset 策略仍在讨论中，不应提前当成稳定契约使用

如果业务现在就需要品牌化定制，建议在消费端做有边界的样式覆盖，并逐组件验证视觉与交互表现。

## TypeScript 与公共导出

- 源码入口：[`src/index.ts`](./src/index.ts)
- 发布 JS：`dist/index.js`
- 发布类型：`dist/index.d.ts`
- 发布样式：`dist/index.css`，通过 `@hyacinth/matsci-ui/style.css` 暴露

除组件本身外，包还会导出一部分 Search UI、周期表和文案相关的类型与工具函数，方便消费端做二次组合，而无需直接 fork 内部实现。

## 文案与本地化策略

本库不强制引入全局 i18n 运行时，而是通过显式 props 暴露文案控制权。常见方式有：

- `texts?: Partial<...>`：按组件结构组织的文案对象
- `placeholder`、`ariaLabel`、`buttonLabel`、`submitButtonText` 等显式 props
- 列配置、筛选器配置中的业务字段文案由消费端自行定义

示例：

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

## 无障碍说明

无障碍能力以组件粒度落地，而不是依赖单一全局抽象。当前实现中的重点包括：

- 对话框、提示、下拉、Tabs、Checkbox 等基础能力采用 Radix
- 表格分页、行选择、输入框等处提供明确的 `aria-*` 文案
- Modal / Drawer / Dropdown 等交互具备键盘友好的焦点管理
- 可通过 `texts` props 覆盖屏幕阅读器相关文案

如果消费端做了样式覆盖或深度定制，建议再进行一次完整的键盘流与对比度验证。

## 性能说明

本仓库优化目标是“面向真实产品规模的数据与文档场景”，而不是极致虚拟滚动能力。

- `SearchUI` 支持 `searchOnMount={false}`，适合昂贵接口
- `DataTable` 基于 TanStack Table，并对列与行辅助计算做了 memo 化
- Storybook 中高成本故事默认会避免自动请求
- 文献与搜索组件已改用 `fetch`，降低运行时依赖重量

如果面对超大数据量，仍建议优先使用服务端分页、限制查询字段并降低默认页大小。

## 测试与质量保障

常用开发命令：

```bash
npm install
npm test
npm run typecheck
npm run build
npm run storybook
```

当前仓库的质量信号包括：

- Vitest + Testing Library 单元测试
- Storybook 10 文档与交互示例
- 严格模式 TypeScript 配置
- `oxlint` 快速静态检查
- `lefthook` 本地提交辅助

本 README 更新时的自动化测试规模：

- 60 个测试文件
- 157 条通过用例

这里反映的是测试覆盖广度，而不是行覆盖率百分比徽章。

## 浏览器支持

`matsci-ui` 面向现代 Evergreen 浏览器：

- 当前版本 Chrome / Edge
- 当前版本 Safari
- 当前版本 Firefox

由于本包是 ESM-first，且使用了现代 DOM / CSS 能力，因此不支持 Internet Explorer 等旧浏览器。

## Storybook 与文档

Storybook 是本仓库的主要交互式文档入口。

- 本地启动：`npm run storybook`
- 静态构建：`npm run build-storybook`
- Storybook 文档页支持中英文切换
- Search 相关 stories 可能需要 `VITE_MP_API_KEY` 才能访问受保护接口

## 从 `mp-react-components` 迁移

这不是一次简单的包名替换，关键差异包括：

- 发布方式改为 ESM-first
- 文档栈升级为 Storybook 10 + Vite
- 测试从 Jest 切到 Vitest
- 表格从 `react-data-table-component` 切到 `@tanstack/react-table`
- 多个基础交互组件切到 Radix 生态
- 导出面扩展，类型与工具函数更适合二次封装

推荐先阅读：

- [docs/repo-diff-report.md](./docs/repo-diff-report.md)
- [docs/theming-and-style-presets.md](./docs/theming-and-style-presets.md)

## 贡献流程

1. 使用 `npm install` 或 `pnpm install` 安装依赖
2. 运行 `npm test` 与 `npm run typecheck`
3. 通过 `npm run storybook` 检查文档与交互示例
4. 使用 `npm run build` 验证发布产物
5. 如有公共 props、导出或行为变化，同步更新文档

贡献建议：

- 行为发生实质变化时，补充或更新测试
- 公共导出保持克制且可文档化
- 避免把页面级 demo 重新引回组件库发布面
- 修改组件 API 时，尽量优先提供可迁移的增量路径

## 版本策略

当前采用务实的 semver 口径：

- patch：Bug 修复、文档修复、对外行为不变的内部重构
- minor：新增组件、props、导出或非破坏性行为增强
- major：移除导出、切换关键依赖并对消费端造成明确影响的行为变化

## 路线图

- 继续对齐 Search UI 与旧产品体验之间的关键行为差异
- 扩充中英文文档覆盖与示例
- 持续加强 React 17 / 18 / 19 消费环境下的包验证
- 继续清理历史兼容层，优先保留类型安全、组合友好的基础能力

## 相关资源

- 历史上游仓库： [materialsproject/mp-react-components](https://github.com/materialsproject/mp-react-components)
- 仓库对比报告： [repo-diff-report.md](./docs/repo-diff-report.md)
- 主题规划说明： [theming-and-style-presets.md](./docs/theming-and-style-presets.md)
