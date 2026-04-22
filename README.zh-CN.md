# MatsciUI
中文文档 | 英文版见 [README.md](./README.md)
迁移与仓库对比说明：[repo-diff-report.md](./docs/repo-diff-report.md)

> 项目传承
> 本组件库基于 Materials Project 开源项目 `mp-react-components` 构建（https://github.com/materialsproject/mp-react-components），并在此基础上进行**ESM 优先、强类型规范、工程化重构**，打造可直接通过 npm 安装使用的专业材料科学 UI 组件库。

`@hyacinth/matsci-ui` 是面向**材料科学产品与科研场景**的 React 组件库，专为数据密集型科研工作流设计，支持材料检索、表格数据探索、化学组成输入及交互式三维晶体展示。项目以生产可用为目标，提供规范的 ESM 产物、清晰的导出定义、完整的 TypeScript 类型、Storybook 文档体系，以及基于 Vitest 的自动化测试保障。

---

## 致谢
衷心感谢 Next-Gen Materials Project 团队（https://next-gen.materialsproject.org/）在材料科学领域的卓越贡献与开源生态建设。正是其开放共享的理念，为下游工具开发、科研界面研究与持续迭代奠定了坚实基础。

---

## 技术特点
- **打包规范**：ESM 优先，显式定义 `exports` 字段，包含独立样式入口 `./style.css`
- **工程体系**：Rollup 构建、严格 TypeScript 校验、Storybook 10 文档、Vitest 单元测试
- **UI 技术栈**：Bulma 样式体系 + Radix UI 无样式组件 + TanStack Table 高性能表格
- **科研场景能力**：Search UI 组合式搜索、周期表驱动化学式输入、文献辅助组件、Crystal Toolkit 三维场景

---

## 安装
```bash
npm install @hyacinth/matsci-ui
```

### 对等依赖
- `react`: `^17.0.0 || ^18.0.0 || ^19.0.0`
- `react-dom`: `^17.0.0 || ^18.0.0 || ^19.0.0`

### 推荐运行环境
- Node.js `^20.19.0 || ^22.12.0`
- 支持 ESM 的现代构建工具（Vite、Rollup、Webpack 5+ 等）

---

## 快速开始
在应用入口处全局引入样式：
```ts
import '@hyacinth/matsci-ui/style.css';
```

组件最简使用示例：
```tsx
import { DataTable } from '@hyacinth/matsci-ui';
```

---

## 开发与文档
- 启动本地 Storybook 文档：`pnpm storybook`
- 构建静态文档站点：`pnpm build-storybook`

---

## 样式与主题现状
目前组件库**唯一稳定的样式方案**为：内置 Bulma 基础样式 + 组件级 CSS/Less。

仓库中虽已包含 [`src/theme/tokens.css`](./src/theme/tokens.css)、[theming-and-style-presets.md](./docs/theming-and-style-presets.md) 等主题探索文件，但这些内容**仅为规划阶段产物**，并非稳定可用、承诺兼容的对外主题 API。

当前稳定使用规则：
- 业务项目必须以 `@hyacinth/matsci-ui/style.css` 作为唯一样式入口
- 组件 DOM 结构与 className 基于 Bulma 体系设计
- 暂未发布 `dark.css`、`materials.css`、`shadcn.css` 等主题预设
- 设计 Token 命名与主题切换策略仍在讨论中，不建议业务强依赖

---

## TypeScript 与公共 API
- 源码入口：[`src/index.ts`](./src/index.ts)
- 构建产物：`dist/index.js`
- 类型文件：`dist/index.d.ts`
- 样式文件：`dist/index.css`，对外暴露为 `@hyacinth/matsci-ui/style.css`

除组件外，库还导出 Search UI、周期表、工具函数及相关类型定义，支持业务层直接二次封装，无需 Fork 内部实现。

---

## 文案与国际化
组件库**不依赖全局 i18n 运行时**，所有展示文本均通过 Props 完全可控：
- 结构化文案覆盖：`texts?: Partial<...>`
- 常用显式配置：`placeholder`、`ariaLabel`、`buttonLabel`、`submitButtonText`
- 表格列、筛选器等业务文案由调用方自主定义

---

## 性能说明
组件库针对**真实产品级数据量与科研场景**做了针对性优化，而非追求极端虚拟滚动：
- `SearchUI` 支持 `searchOnMount={false}`，避免高耗时接口自动请求
- `DataTable` 基于 TanStack Table 实现，并对行列逻辑做记忆化优化
- Storybook 示例默认避免自动发起请求，防止请求风暴
- 文献与搜索组件使用原生 `fetch`，减少运行时依赖体积

面对超大规模数据集时，建议搭配服务端分页、精简返回字段、缩小默认页大小使用。

---

## 浏览器支持
`MatsciUI` 仅支持现代常青浏览器：
- 最新版 Chrome / Edge
- 最新版 Safari
- 最新版 Firefox

由于采用 ESM 优先架构并使用现代 DOM / CSS 特性，**不支持 IE 等旧版浏览器**。

---

## 从 `mp-react-components` 迁移
本项目并非逐行复刻，而是在保留组件核心行为与视觉一致性的前提下，对工程化、打包规范、依赖体系进行现代化升级。

迁移重点关注：
- 显式 ESM 导出，必须手动引入 `style.css`
- 表格、弹层等组件底层改为 Radix + TanStack Table
- 多主题、非 Bulma 主题能力仍在规划中

迁移参考文档：
- [docs/repo-diff-report.md](./docs/repo-diff-report.md)
- [docs/theming-and-style-presets.md](./docs/theming-and-style-presets.md)

---

## 欢迎 Star ⭐️
如果本组件库对你的研究、教学或产品开发有所帮助，欢迎点亮 Star ⭐️。
这不仅是鼓励，也能帮助我们更好地排定维护优先级、吸引更多协作者，持续提升科研 UI 工具的长期可持续性。

---

## 欢迎贡献 🤝
我们热烈欢迎各类贡献，并会郑重致谢！尤其期待以下方向：
- 主题模块化与样式可配置能力，摆脱对 Bulma 的单一依赖 🎨
- 渲染性能与交互流畅度优化 ⚡️
- 更贴合科研场景的组件实现与科学性修正（欢迎科研人员与学生参与）🧪
- 可复用规范与规则，提升 AI 辅助开发的安全性与规范性 🧩

项目整体风格保持学术严谨，但贡献氛围轻松友好——
如果你也曾吐槽某个卡顿的筛选组件“违背热力学第二定律”，那你一定能快速融入我们。

### 标准贡献流程
1. 安装依赖：`pnpm install`
2. 类型检查与测试：`pnpm typecheck` → `pnpm test`
3. 预览示例与文档：`pnpm storybook`
4. 构建产物校验：`pnpm build`
5. 若修改公共 Props、导出或行为，请同步更新文档

---

## 相关资源
- 上游原项目：[materialsproject/mp-react-components](https://github.com/materialsproject/mp-react-components)
- 仓库差异对比：[repo-diff-report.md](./docs/repo-diff-report.md)
- 主题规划文档：[theming-and-style-presets.md](./docs/theming-and-style-presets.md)