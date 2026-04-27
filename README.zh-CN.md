# MatsciUI

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/HyaCiovo/matsci-ui)

> 当前状态：npm 包名、对外导出和构建产物已经整理完成，但 **还没有正式发布到 npm**。在正式发布前，线上 Storybook 仍然是预览组件行为和视觉效果的最佳入口。

中文文档 | 英文版见 [README.md](./README.md)
迁移与仓库对比说明：[repo-diff-report.md](./docs/repo-diff-report.md)

> 项目传承
> 本组件库基于 Materials Project 开源项目 `mp-react-components` 构建（https://github.com/materialsproject/mp-react-components），并在此基础上进行 **ESM 优先、强类型、现代打包与 Storybook-first 文档化** 重构，目标是形成可正式发布的材料科学 UI 组件库。

`@hyacinth/matsci-ui` 是面向 **材料科学产品与科研工作流** 的 React 组件库，覆盖可组合搜索、表格与卡片渲染、化学语义输入、文献辅助组件和三维晶体可视化等场景。当前仓库重点强调清晰的发布面、显式样式引入、类型安全、可维护的主题架构，以及以 Storybook 为核心的交互式文档体系。

---

## 致谢

衷心感谢 [Next-Gen Materials Project 团队](https://next-gen.materialsproject.org/) 在材料科学领域的卓越贡献与开源生态建设。正是这些积累，让本仓库的现代化重构成为可能。

---

## 技术特点

- **打包规范**：ESM-only 包，显式导出精选领域子路径，以及 `./style.css`、`./themes/bulma.css`、`./themes/gnosys.css`、`./themes/markdown.css`
- **产物优化**：主题 CSS 压缩输出，组件 JS 使用 preserve-modules ESM 产物，增强业务侧 tree-shaking
- **工程体系**：Rollup 4、严格 TypeScript、Storybook 10、Vitest 与 `lefthook`
- **UI 技术栈**：库自有 `ms-*` 样式契约、Bulma 兼容基础层、Radix UI primitives、TanStack Table
- **科研场景能力**：可组合 Search UI、周期表驱动的材料输入、文献辅助能力与 Crystal Toolkit 场景组件
- **主题架构**：可发布主题层统一放在 `src/themes`，Storybook 预览专用覆盖单独放在 `.storybook/themes`

---

## 安装状态

预期公开包名为：

```bash
npm install @hyacinth/matsci-ui
# pnpm add @hyacinth/matsci-ui
# yarn add @hyacinth/matsci-ui
# bun add @hyacinth/matsci-ui
```

但这个包 **目前还没有正式发布到 npm**，所以上面的命令代表未来的公开安装契约，而不是此刻可直接从 npm 获取的已发布版本。当前请以仓库源码与 Storybook 作为实际评估入口。

### 对等依赖

- `react`: `^17.0.0 || ^18.0.0 || ^19.0.0`
- `react-dom`: `^17.0.0 || ^18.0.0 || ^19.0.0`

### 推荐运行环境

- Node.js `^20.19.0 || ^22.12.0`
- 支持 ESM 的现代构建工具，如 Vite、Rollup、Webpack 5+
- 只要宿主能够消费现代 ESM 包与 CSS 入口，基于 Bun 管理的业务应用也在支持范围内

---

## 快速开始

在应用入口显式引入且只引入一份主题样式。现在仅导入组件本身不会再自动注入样式：

```ts
import '@hyacinth/matsci-ui/style.css';
// 或：
// import '@hyacinth/matsci-ui/themes/bulma.css';
// 或：
// import '@hyacinth/matsci-ui/themes/gnosys.css';
// 只有在渲染 Markdown 数学公式或代码高亮时才需要：
// import '@hyacinth/matsci-ui/themes/markdown.css';
```

当前入口含义如下：

- `@hyacinth/matsci-ui/style.css`：Bulma 主题别名
- `@hyacinth/matsci-ui/themes/bulma.css`：显式 Bulma 主题入口
- `@hyacinth/matsci-ui/themes/gnosys.css`：显式 Gnosys 主题入口
- `@hyacinth/matsci-ui/themes/markdown.css`：`Markdown` 组件的可选 KaTeX 与代码高亮样式入口

注意：

- 不要在同一个应用壳层里静态同时引入 `bulma.css` 和 `gnosys.css`
- 只有业务里会用到 `Markdown` 的数学公式或代码高亮时，才额外引入 `themes/markdown.css`
- Storybook 工具栏里的主题切换只是文档运行时能力，不是对外公开的 JS 主题 API
- 如果业务项目需要运行时换肤，应由宿主应用在壳层切换实际加载的 stylesheet，而不是把两套主题一起预加载

最小组件使用示例：

```tsx
import { DataTable } from '@hyacinth/matsci-ui';
import { SearchUIContainer } from '@hyacinth/matsci-ui/search-ui';
import { Markdown } from '@hyacinth/matsci-ui/markdown';
```

当前推荐用法：

- 稳定 Bulma 样式优先使用 `@hyacinth/matsci-ui/style.css` 或 `@hyacinth/matsci-ui/themes/bulma.css`
- `@hyacinth/matsci-ui/themes/gnosys.css` 提供第二套学术化、扁平化、深蓝强调的主题预设
- 希望导入边界更清晰时，优先使用 `@hyacinth/matsci-ui/search-ui`、`@hyacinth/matsci-ui/crystal-toolkit` 这类新子路径

---

## 开发与文档

- 启动本地 Storybook：`pnpm storybook`
- 构建静态文档站点：`pnpm build-storybook`
- 构建组件库：`pnpm build`
- 类型检查：`pnpm typecheck`
- 运行测试：`pnpm test`

由于 npm 包尚未正式发布，当前 Storybook 仍然是最主要的交互式文档入口。

当前仓库自身的开发工作流仍然以 pnpm 为准。这里补充的 Bun 支持，指的是发布后可在 Bun 管理的业务应用中消费本组件库，而不是仓库已经切换到 Bun 作为锁文件和脚本执行基线。

---

## 样式与主题现状

仓库当前的样式体系已经不再是历史上那种“隐式注入 Bulma 全局样式”的模式。

当前稳定可用的能力：

- 业务项目必须显式引入 `@hyacinth/matsci-ui/style.css` 或 `@hyacinth/matsci-ui/themes/bulma.css`
- 包同时对外暴露 `@hyacinth/matsci-ui/themes/gnosys.css`
- Markdown 数学公式与代码高亮资源已经拆分到可选的 `@hyacinth/matsci-ui/themes/markdown.css`
- 组件导入本身不会再自动注入样式
- 发布样式已统一收敛为库自有的 `ms-*` 选择器，避免把 Bulma 的全局类污染到宿主应用
- 源码中的主题体系已经统一收口到单一 `src/themes` 目录
- Storybook 预览专用 CSS 不会通过 npm 对外导出，也不会进入 `dist` 产物

仓库里已经落地的部分：

- `src/themes/foundation/*`：token、基础重置、Bulma 兼容原子层与工具类
- `src/themes/shared/*`：按领域聚合的共享组件皮肤
- `src/themes/presets/*`：主题预设的拼装与 override 钩子
- `src/themes/entries/*`：最终供 Storybook 与打包产物使用的主题入口
- `.storybook/themes/*`：仅供 Storybook 预览使用的主题 token 与覆盖
- `dist/themes/bulma.css`：Bulma 主题样式产物
- `dist/themes/gnosys.css`：第二套正式主题样式产物入口
- `dist/themes/markdown.css`：Markdown 的可选 KaTeX 与代码高亮附加样式

实际使用建议：

- Bulma 主题已经稳定，可作为主入口使用
- `gnosys.css` 是第二套正式主题，适合更扁平、学术化、深蓝强调的产品界面

---

## TypeScript 与公共 API

- 源码入口：[`src/index.ts`](./src/index.ts)
- 构建产物：`dist/index.js`
- 类型文件：`dist/index.d.ts`
- 样式文件：
  - `dist/themes/bulma.css`，对外暴露为 `@hyacinth/matsci-ui/style.css` 与 `@hyacinth/matsci-ui/themes/bulma.css`
  - `dist/themes/gnosys.css`，对外暴露为 `@hyacinth/matsci-ui/themes/gnosys.css`
  - `dist/themes/markdown.css`，对外暴露为 `@hyacinth/matsci-ui/themes/markdown.css`

像 `.storybook/themes/gnosys-preview-tokens.css`、`.storybook/themes/gnosys-preview-overrides.css` 这类文件只服务于 Storybook 预览，不属于 npm 包公开契约。

当前 JavaScript 构建已经改为 preserve-modules ESM 输出，因此业务侧 bundler 比起历史单文件 bundle 更容易做 tree-shaking。

除根入口外，包现在还提供了几个更清晰的公开子路径：

- `@hyacinth/matsci-ui/search-ui`
- `@hyacinth/matsci-ui/periodic-table`
- `@hyacinth/matsci-ui/crystal-toolkit`
- `@hyacinth/matsci-ui/publications`
- `@hyacinth/matsci-ui/markdown`

---

## 文案与国际化

组件库本身不依赖全局 i18n runtime，面向用户的文案主要通过 props 控制：

- 结构化文本覆盖，如 `texts?: Partial<...>`
- 显式 props，如 `placeholder`、`ariaLabel`、`buttonLabel`、`submitButtonText`
- 表格列与筛选定义中的自定义标签

Storybook 文档也支持中英文切换。

---

## 性能说明

该库针对真实科研产品工作流优化，而不是极端虚拟滚动场景。

- `SearchUI` 支持 `searchOnMount={false}`，避免高成本接口自动请求
- `DataTable` 已使用 TanStack Table 与库内辅助逻辑替代旧表格栈
- Storybook 示例默认避免无意义自动请求
- 搜索与文献请求链使用原生 `fetch` 工具，而不再依赖 `axios`
- 主题 CSS 会压缩输出，JS 产物也按更利于 tree-shaking 的方式组织

面对超大数据集时，建议优先采用服务端分页、更小的默认页大小，以及更收敛的字段返回。

---

## 浏览器支持

`MatsciUI` 面向现代常青浏览器：

- 最新版 Chrome / Edge
- 最新版 Safari
- 最新版 Firefox

由于包采用 ESM-first 并使用现代 DOM / CSS 特性，不支持 IE 等旧环境。

---

## 从 `mp-react-components` 迁移

本仓库不是逐行平移，而是在保留核心组件家族和整体产品方向的基础上，对发布方式、样式契约、文档体系、表格实现、浮层能力和网络层进行了现代化替换。

迁移时建议重点关注：

- 把包名从 `@materialsproject/mp-react-components` 改为 `@hyacinth/matsci-ui`
- 显式引入 `@hyacinth/matsci-ui/style.css`
- 如果旧页面依赖 Markdown 数学公式或围栏代码高亮，再额外引入 `@hyacinth/matsci-ui/themes/markdown.css`
- 业务项目可继续使用 npm / pnpm / Yarn，也可以迁移到 Bun；前提是宿主工具链支持现代 ESM 与 CSS 导入
- 重新回归 `SearchUI`、`DataTable`、`Tooltip`、`JsonView` 与 Crystal Toolkit 场景
- 如果旧项目依赖 `dark.css` 或 `materials.css`，需要迁移到新的显式主题入口模型
- 需要延续原有 Bulma 语义时优先 Bulma 主题；需要更扁平、深蓝强调的视觉时使用 `themes/gnosys.css`

迁移参考：

- [docs/repo-diff-report.md](./docs/repo-diff-report.md)
- [docs/theming-and-style-presets.md](./docs/theming-and-style-presets.md)

---

## 欢迎支持

如果这个项目对你的研究、教学或产品开发有帮助，欢迎点亮 Star。它能帮助我们更好地安排维护优先级，并吸引更多协作者共同完善科研 UI 工具生态。

---

## 贡献说明

我们欢迎各种形式的贡献，尤其包括：

- 主题与样式体系的继续演进
- 性能与渲染优化
- 更贴近科研场景的组件能力与准确性修正
- 更安全、更清晰的 AI 辅助开发实践

### 标准工作流

1. 安装依赖：`pnpm install`
2. 执行类型检查与测试：`pnpm typecheck` 然后 `pnpm test`
3. 预览文档与示例：`pnpm storybook`
4. 校验构建产物：`pnpm build`
5. 若修改了公共 props、导出、样式契约或行为，请同步更新文档

---

## 相关资源

- 上游项目：[materialsproject/mp-react-components](https://github.com/materialsproject/mp-react-components)
- 仓库差异报告：[repo-diff-report.md](./docs/repo-diff-report.md)
- 主题与样式预设现状文档：[theming-and-style-presets.md](./docs/theming-and-style-presets.md)
