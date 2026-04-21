# matsci-ui vs mp-react-components 全量差异报告

更新时间：2026-04-22

## 1. 报告范围

本报告聚焦两个仓库当前磁盘状态中与“可发布组件库”直接相关的部分，覆盖：

- 包元数据与发布产物
- 目录结构与源码组织
- 公共 API 与组件命名
- 依赖、样式变量与网络层实现
- 构建、测试、Storybook 与本地质量门禁
- README、迁移说明与发布/CI 口径

对比对象：

- 旧仓库：`/Users/zhujiruo/Desktop/hobby/mp-react-components`
- 新仓库：`/Users/zhujiruo/Desktop/hobby/matsci-ui`

说明：

- 当前两个仓库都没有可直接审阅的 `.github/workflows` 文件，因此 CI/CD 差异以现有脚本、`lefthook` 和 README 中保留的发布说明为准。
- 本报告沿用“聚焦发布面”的约束，不对所有业务实验文件做逐行穷举，而是对发布契约、核心实现替换和迁移风险做逐文件说明。

## 2. 执行摘要

`matsci-ui` 已从历史性的“组件源码仓库”收敛为“npm-first 的现代 React 组件库”，主要变化如下：

- 定位收敛：从“组件 + 本地 demo/page + 历史发布脚本”切换为“可发布库 + Storybook 文档 + 类型导出”。
- 打包现代化：从 Parcel 1 + Rollup 2 + Babel/Jest 生态切换为 Vite + Rollup 4 + SWC + Vitest。
- 依赖升级：核心 UI 基座由多套历史 React 生态组件迁移到 Radix UI、TanStack Table 和原生 `fetch`。
- 发布面扩展：根入口导出由约 57 个符号扩展到约 151 个，新增大量类型、工具函数和组合能力。
- 样式策略变化：保留统一 CSS 交付，但取消预置 `dark.css` / `materials.css` 主题入口，改为 CSS Token 覆盖。
- 兼容面调整：新包显式支持 React 17/18/19，但部分底层实现已替换，行为兼容不等于 DOM/样式完全兼容。

综合判断：

- 迁移优先级：高
- 迁移复杂度：中到高
- 推荐策略：优先迁移包名、样式入口和公开 API；随后逐页校验 `DataTable`、`Tooltip`、`JsonView`、`SearchUI` 和 Crystal Toolkit 场景。

## 3. 总览矩阵

| 维度 | 旧仓库 `mp-react-components` | 新仓库 `matsci-ui` | 影响等级 |
| --- | --- | --- | --- |
| 包名 | `@gnosys/mp-react-components` | `@hyacinth/matsci-ui` | 高 |
| React peer | `^18 || ^19` | `^17 || ^18 || ^19` | 中 |
| 产物导出 | `.`、`./package.json` | `.`、`./style.css` | 高 |
| 样式接入 | 隐式/历史约定 | 显式 `@hyacinth/matsci-ui/style.css` | 高 |
| 文档栈 | Storybook 6 + webpack5 | Storybook 10 + Vite | 高 |
| 测试栈 | Jest 26 + ts-jest | Vitest 4 + jsdom | 中 |
| 网络层 | `axios` | 原生 `fetch` 封装 | 中 |
| 表格底层 | `react-data-table-component` | `@tanstack/react-table` | 高 |
| Tooltip | `react-tooltip` | Radix Tooltip | 高 |
| JsonView | `react-json-view` | `@microlink/react-json-view` | 中 |
| 目录定位 | library + app sandbox | library-first | 中 |
| 本地门禁 | husky + pretty-quick | `lefthook` + lint/typecheck/test | 中 |

## 4. 逐文件差异台账

### 4.1 包元数据与发布契约

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| 包名与 exports | `mp-react-components/package.json:L2-L26` | `matsci-ui/package.json:L2-L27` | 变更 | 包名从 `@gnosys/mp-react-components` 更名为 `@hyacinth/matsci-ui`；新包删除 `./package.json` 子路径，新增 `./style.css` 子路径，消费方必须显式引入样式。 |
| scripts | `mp-react-components/package.json:L29-L42` | `matsci-ui/package.json:L28-L38` | 变更 | 旧仓库保留 `start`、`build-prod`、`build-publish`、`deploy-storybook` 等混合脚本；新仓库收敛为 `build`、`storybook`、`build-storybook`、`test`、`typecheck`。 |
| peerDependencies | `mp-react-components/package.json:L43-L46` | `matsci-ui/package.json:L39-L42` | 升级 | 新仓库将 React 兼容范围放宽到 17/18/19，适合更广的宿主项目，但仍需逐组件做真实宿主验证。 |
| 依赖栈 | `mp-react-components/package.json:L47-L170` | `matsci-ui/package.json:L43-L105` | 大幅变更 | 多个底层库被替换，属于迁移风险最大区域之一。 |

### 4.2 根入口与公共 API

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| 根入口导出 | `mp-react-components/src/index.ts:L1-L115` | `matsci-ui/src/index.ts:L1-L78` | 扩展 | 新仓库改用 `export *` 聚合，除组件外还导出类型、常量和 utils，方便二次封装。 |
| `Scene` 导出 | `mp-react-components/src/index.ts:L10-L10,L57-L60` | `matsci-ui/src/index.ts:L57-L63` | 根级重构 | 新仓库仍导出 `Scene` 默认实现，但 Crystal Toolkit 主路径已经由 `CrystalToolkitScene` / `CrystalToolkitAnimationScene` / `PhononAnimationScene` 主导，迁移时不建议继续依赖历史 runtime 入口。 |
| 样式入口 | 旧包无单独 `style.css` export | `matsci-ui/src/index.ts:L1-L3` + `matsci-ui/package.json:L14-L20` | 新增 | 新仓库明确把样式交付纳入发布契约，避免消费端依赖隐式全局 CSS。 |

### 4.3 构建与 TypeScript

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| Rollup 配置 | `mp-react-components/rollup.config.mjs:L1-L80` | `matsci-ui/rollup.config.mjs:L1-L57` | 升级 | 旧仓库使用 `rollup-plugin-typescript2`、`rollup-plugin-styles`；新仓库切换到 `@rollup/plugin-swc`、`rollup-plugin-postcss`、`rollup-plugin-dts`，构建链更现代，也更贴近发布产物。 |
| TS 编译目标 | `mp-react-components/tsconfig.json:L2-L24` | `matsci-ui/tsconfig.json:L2-L21` | 升级 | 新仓库把目标提升到 `ES2022`，使用 `moduleResolution: bundler` 和 `react-jsx`，对现代 bundler 更友好，但不再面向旧式构建工具。 |
| demo/app 构建 | `mp-react-components/package.json:L33-L35` | 无对应脚本 | 删除 | 旧仓库保留 Parcel 本地 app sandbox；新仓库去页面化，开发入口迁移到 Storybook/Vite。 |

### 4.4 文档与 Storybook

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| Storybook main | `mp-react-components/.storybook/main.js:L1-L35` | `matsci-ui/.storybook/main.ts:L1-L66` | 升级 | webpack5 Storybook 6 升级为 Vite Storybook 10，并加入代理、`react-docgen-typescript` 与 `@storybook/addon-vitest`。 |
| Storybook preview | `mp-react-components/.storybook/preview.js:L1-L48` | `matsci-ui/.storybook/preview.tsx:L1-L119` | 大幅变更 | 新仓库支持中英文 toolbar 切换，并通过 `DocsContainer` 包裹让 MDX/Docs 页面实时切换语言。 |
| README 口径 | `mp-react-components/README.md:L1-L276` | `matsci-ui/README.md:L1-L389`、`README.zh-CN.md:L1-L389` | 重写 | 新仓库 README 不再以“本地 app 开发”和历史 Dash 互链为主，而是围绕功能、架构、安装、主题、测试、浏览器支持、迁移与版本策略组织。 |

### 4.5 测试、质量门禁与发布验证

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| 单测配置 | `mp-react-components/jest.config.js:L1-L30` | `matsci-ui/vitest.config.mts:L1-L11` | 替换 | 测试执行器从 Jest 切换为 Vitest，运行速度和 Vite 集成更好，但现有测试工具链和 mock 方式不同。 |
| 本地门禁 | `mp-react-components/package.json:L166-L170` | `matsci-ui/lefthook.yml:L1-L12` | 变更 | 旧仓库仅 pre-commit 执行 `pretty-quick`；新仓库在 pre-push 额外执行 `typecheck` 与 `test`。 |
| React 18 smoke | `mp-react-components/react18-smoke/package.json:L1-L22` | 无对应目录 | 删除 | 旧仓库保留独立消费验证应用；新仓库当前没有独立 smoke app，兼容性验证更依赖 Storybook、测试和真实宿主集成。 |

### 4.6 网络层与实现替换

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| HTTP 公共层 | 旧仓库无统一 `fetch` 封装，`axios` 散落在组件中 | `matsci-ui/src/utils/http.ts:L1-L76` | 新增 | 新仓库把 URL 拼接、query 序列化和 JSON/text 请求集中封装，减少依赖面，也让测试 mock 更统一。 |
| SearchUI 请求链 | 旧仓库依赖 `axios` + 查询工具 | `matsci-ui/src/components/data-display/SearchUI/SearchUIContextProvider/SearchUIContextProvider.tsx`（请求逻辑见约 `L193-L259`、`L471-L519`） | 变更 | 请求生命周期已围绕 `fetchJson` 重写，取消 `axios` 专有行为后，错误对象形态和取消请求方式需要重新审视。 |

### 4.7 样式变量与主题

| 文件 | 旧文件与行号 | 新文件与行号 | 变化类型 | 影响说明 |
| --- | --- | --- | --- | --- |
| 主题 Token | 旧仓库无统一 token 入口 | `matsci-ui/src/theme/tokens.css:L1-L24` | 新增 | 新仓库集中暴露颜色、圆角、阴影、字体等变量，适合消费端做轻量品牌化覆盖。 |
| 主题预设文档 | 历史上保留多套样式预设规划 | `matsci-ui/docs/theming-and-style-presets.md:L1-L138` | 文档口径调整 | 当前真实发布面已取消 `dark.css` / `materials.css` 预设；如果旧项目直接依赖预置主题文件，需要改为 Token 覆盖。 |
| 主题文件 | 旧方案/过渡方案中存在预置主题文件 | `matsci-ui/src/theme/themes/dark.css`、`materials.css` 已删除 | 删除 | 这是明确的破坏性变更。 |

## 5. 新增、删除、变更、重命名清单

### 5.1 新增

- 新增 `@hyacinth/matsci-ui/style.css` 发布子路径。
- 新增统一请求工具 `src/utils/http.ts`。
- 新增 Storybook Docs 级别的中英文切换能力。
- 新增 `@storybook/addon-vitest`，并让 Storybook 与测试栈对齐。
- 新增更多显式导出的类型、常量、Search UI 工具和周期表上下文能力。

### 5.2 删除

- 删除本地 app sandbox 主路径：`parcel demo/index.html` / `build-prod`。
- 删除 `react18-smoke` 等独立发布后验证链路。
- 删除主题预设文件 `dark.css` / `materials.css`。
- 删除 `axios`、`rxjs`、`react-data-table-component`、`react-tooltip`、`react-json-view` 等历史依赖的核心地位。

### 5.3 变更

- 变更包名、样式接入方式和 Storybook 版本。
- 变更 SearchUI、DataTable、Tooltip、JsonView 的底层实现。
- 变更 TypeScript 编译目标与 bundler 假设。
- 变更测试执行器、mock 方式与本地质量门禁。

### 5.4 重命名

- npm 包从 `@gnosys/mp-react-components` 更名为 `@hyacinth/matsci-ui`。
- 文档/Storybook 品牌名从 `MP React Components` 系列名称迁移为 `matsci-ui`。
- 主题能力从“预置主题文件”迁移为“CSS Token 覆盖”。

## 6. 依赖升级与生态替换

| 旧依赖/能力 | 新依赖/能力 | 类型 | 影响 |
| --- | --- | --- | --- |
| `axios` | 原生 `fetch` + `src/utils/http.ts` | 替换 | 请求错误对象、拦截器能力和取消请求用法不同。 |
| `react-data-table-component` | `@tanstack/react-table` | 替换 | DOM 结构、排序分页实现、列选择和测试选择器可能失配。 |
| `react-tooltip` | `@radix-ui/react-tooltip` | 替换 | 属性兼容层可能无法覆盖所有历史用法，浮层定位与触发方式需回归测试。 |
| `react-json-view` | `@microlink/react-json-view` | 替换 | 展示和交互细节不同，编辑能力不应假设完全等价。 |
| `react-tabs` / `react-select` / `react-range` 等 | Radix UI + 自研组合组件 | 替换 | 外观与 keyboard 行为更统一，但 className/DOM 兼容性下降。 |
| Parcel 1 + Babel | Vite + SWC | 升级 | 构建速度更快，但不再围绕旧时代 Babel/webpack 兼容层设计。 |
| Jest 26 + ts-jest | Vitest 4 | 升级 | 现有测试断言和 mock 工具大体可迁移，但需要调整运行时 API。 |
| Storybook 6 | Storybook 10 | 升级 | stories / docs blocks / addon 版本必须统一。 |

## 7. API 接口与组件命名差异

### 7.1 根导出面

根据现有审计文档 `docs/component-diff-audit.md`：

- 旧仓库根导出：约 57 个符号
- 新仓库根导出：约 151 个符号
- 交集：56 个
- 旧库独有历史项：`Scene`

迁移解读：

- 对于“只通过包根导入组件”的业务，绝大多数现有导入可以平移。
- 对于“依赖某个组件内部 DOM、特定依赖行为或历史样式钩子”的业务，仍然需要逐组件验证。
- SearchUI 相关的类型和工具在新仓库中更适合做二次封装，不必再通过复制内部源码扩展。

### 7.2 组件命名与语义变化

- `SearchUIContainer`、`SearchUISearchBar`、`SearchUIFilters`、`SearchUIDataHeader`、`SearchUIDataTable` 等主命名保持延续，便于迁移。
- 新仓库新增 `DataCard`、`Paginator`、`SortDropdown`、`ActiveFilterButtons`、`ArrayChips`、`ButtonBar`、`ThreeStateBooleanSelect` 等更细粒度导出。
- Crystal Toolkit 路径更强调显式场景组件，而不是通用 `Scene` runtime。

## 8. 破坏性变更

以下项应视为明确的 breaking changes 或高风险兼容点：

1. 包名变化
   - 旧：`@gnosys/mp-react-components`
   - 新：`@hyacinth/matsci-ui`
2. 样式入口变化
   - 新包要求显式引入 `@hyacinth/matsci-ui/style.css`。
3. 主题预设删除
   - `dark.css` / `materials.css` 不再发布。
4. `DataTable` 底层替换
   - 自定义测试选择器、分页交互和列格式化行为存在回归风险。
5. `Tooltip` / `JsonView` 实现替换
   - 浮层触发和 JSON 展示细节需重新校验。
6. 构建假设变化
   - 新包 ESM-first，不适合无 ESM 支持的旧式消费环境。

## 9. 兼容性问题

### 9.1 React 兼容性

- 新仓库的 peerDependencies 已声明 React 17/18/19。
- 这意味着“安装约束”更宽，但不等于“所有宿主在行为上无差异”。
- 高风险区域：Portal、Tooltip、Dialog、`useId` 替代逻辑、第三方动画/测量库、老旧测试环境。

### 9.2 浏览器与构建工具

- 新仓库面向现代 evergreen 浏览器与现代 ESM bundler。
- 如果旧项目仍依赖 webpack 4、旧 Babel preset 或历史 polyfill 组合，需要先做宿主基线评估。

### 9.3 样式兼容

- 旧项目如果写了针对 `react-data-table-component`、`react-tooltip` 或旧 Bulma 结构的深层选择器，迁移后容易失效。
- 旧项目如果通过引入预置主题文件实现换肤，需要迁移到 Token 覆盖。

## 10. 潜在风险点

| 风险点 | 描述 | 建议 |
| --- | --- | --- |
| DOM 结构变化 | `DataTable`、Tooltip、Radix 组件渲染出的 DOM 与旧库不同 | 迁移时优先修复 UI 测试和端到端选择器 |
| 请求错误处理 | `axios` 错误对象与 `fetch` 的失败模型不同 | 检查调用方是否依赖 `error.response` 之类字段 |
| 样式回归 | 删除主题预设 + 替换底层依赖后，局部 class 兼容性下降 | 建议逐页截图比对和视觉回归 |
| Storybook addon 漂移 | Storybook 10 对 addon 版本一致性要求更高 | 固定 `@storybook/*` 版本组 |
| 缺少 smoke app | 新仓库当前没有独立消费验证项目 | 迁移项目中尽快补真实宿主验证 |
| 文档口径更新中 | 当前文档已升级，但实际消费样例仍需结合业务验证 | 以 README + Storybook + 本报告联合作为迁移依据 |

## 11. 迁移优先级

| 优先级 | 事项 | 原因 |
| --- | --- | --- |
| P0 | 替换包名与样式入口 | 所有消费方都必须先完成，否则无法编译或样式缺失 |
| P0 | 排查主题预设依赖 | 预置主题文件已删除，属于明确 breaking change |
| P1 | 验证 `DataTable` / SearchUI 页面 | 这是旧新实现差异最大的交互面 |
| P1 | 验证 Tooltip / Modal / Drawer / Tabs | 依赖 Radix 后，浮层与焦点管理行为会变化 |
| P1 | 验证 Crystal Toolkit 场景组件 | 历史 `Scene` 依赖需要重新确认 |
| P2 | 对齐测试与截图回归 | 新旧 DOM 和 class 可能不同，但通常可渐进调整 |
| P2 | 迁移局部自定义样式到 Token | 不是阻塞项，但长期维护收益高 |

## 12. 迁移工作量评估

| 场景 | 估算 | 说明 |
| --- | --- | --- |
| 仅替换基础展示组件 | 1-2 人日 | 主要是包名、样式引入和少量回归验证 |
| 包含 SearchUI 的业务页面 | 3-6 人日 | 需要同时验证查询、筛选、排序、空状态、列渲染与样式 |
| 包含自定义 Tooltip / JsonView / Crystal Toolkit | 4-8 人日 | 高度依赖旧实现时需要更多人工比对 |
| 深度依赖旧主题预设或旧 DOM 选择器 | 5-10 人日 | 主要成本在样式回归与测试修复 |

## 13. 迁移前后示例

### 13.1 包名与样式入口

迁移前：

```tsx
import { DataTable, SearchUIContainer } from '@gnosys/mp-react-components';
```

迁移后：

```tsx
import '@hyacinth/matsci-ui/style.css';
import { DataTable, SearchUIContainer } from '@hyacinth/matsci-ui';
```

影响说明：新包把样式导入纳入了正式发布契约，不能再依赖历史全局样式被动生效。

### 13.2 主题方式

迁移前：

```tsx
import '@gnosys/mp-react-components/themes/dark.css';
```

迁移后：

```css
:root {
  --mpc-color-bg: #10131a;
  --mpc-color-surface: #171b24;
  --mpc-color-text: #f3f5f8;
  --mpc-color-primary: #6da8ff;
}
```

影响说明：主题能力改为 Token 覆盖，视觉可迁移，但不能再直接依赖预制 CSS 文件名。

### 13.3 Crystal Toolkit 场景入口

迁移前：

```tsx
import { Scene } from '@gnosys/mp-react-components';
```

迁移后：

```tsx
import { CrystalToolkitScene } from '@hyacinth/matsci-ui';
```

影响说明：优先迁移到显式场景组件；若必须保留底层 runtime，请先确认当前根导出与运行期行为是否满足现有用法。

## 14. 结论

如果你的目标是“继续在旧页面里少量替换组件”，迁移工作量主要集中在包名、样式入口和局部回归验证。

如果你的目标是“把旧仓库整套交互层迁移到新仓库”，则应把以下四项视为主战场：

- SearchUI 相关页面
- `DataTable` 与列格式化
- `Tooltip` / `Modal` / `Drawer` 等浮层交互
- 主题与自定义样式

从长期维护角度看，`matsci-ui` 的收益是明确的：发布契约更清晰、类型导出更完整、依赖栈更现代、文档体系更统一。但迁移必须按页面分批推进，不能假设“只改 import 就能完全无缝”。
