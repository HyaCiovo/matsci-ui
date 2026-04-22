# Multi-theme / Style Presets (Bulma ↔ Shadcn) / 多套样式 / 主题方案（Bulma ↔ Shadcn）

**EN**

This document is a planning note rather than a statement of shipped functionality. Today, the only stable styling entrypoint is still `@hyacinth/matsci-ui/style.css`, which is primarily Bulma + component-level CSS/Less. The token/preset ideas below are an evolution path, not a compatibility contract.

The goal is to make `matsci-ui` themable and style-system-replaceable without sacrificing maintainability:

- one default preset (currently Bulma-oriented)
- at least one alternate preset (e.g. a shadcn-like look)
- easier theme customization via CSS variables (colors, radius, shadows, typography)

**中文**

本文档是规划文档，不是当前已正式应用到 `matsci-ui` 发布面的功能说明。当前仓库真正稳定可用的样式入口仍然只有 `@hyacinth/matsci-ui/style.css`，其内部仍以 Bulma 和组件级 CSS/Less 为主。下面讨论的 token、preset、Bulma ↔ Shadcn 兼容层都应视为后续演进方向，而不是现阶段的兼容承诺。

本文档用于规划 `matsci-ui` 的“可主题化”和“可替换样式体系”能力。目标是让组件库在不牺牲可维护性的前提下，支持：

- 一份默认样式（当前以 Bulma 为基础）
- 至少一份替代样式（例如 shadcn 风格）
- 通过 CSS 变量更便捷地定制颜色/圆角/阴影/字体等主题 token

## Current State (Why “just swap a CSS file” is not enough) / 现状（为什么不能直接换一份 CSS）

**EN**

The current styling stack is composed of:

1) Bulma CSS (global import)
2) Component-local CSS/LESS (extracted into `dist/index.css`)
3) Global overrides/patches (e.g. `styles.less`) that further assume Bulma semantics

As a result, replacing Bulma with a different framework does not work automatically: the DOM/class contracts produced by components are still Bulma-shaped.

Notes:

- `src/theme/tokens.css` is exploratory rather than a stable public theming API.
- Alternate presets such as `dark.css`, `materials.css`, `shadcn.css` are not currently published.
- Any theme mention in README/migration docs should be treated as “planned”, not “supported today”.

**中文**

当前组件库的样式体系由三部分组成：

1) Bulma CSS（全局导入）
- 入口文件默认导入 Bulma。
- 组件 JSX 广泛输出 Bulma 语义类（例如 `box/panel/field/control/button/tag/navbar/modal/dropdown/pagination` 等）。

2) 组件内分散的 CSS/LESS（构建期会抽取合并）
- 各组件通常在组件文件中 side-effect import 对应样式文件。
- 构建时统一抽取到 `dist/index.css`。

3) 全局覆盖/补丁（styles.less）
- 存在针对 Bulma 类名的覆盖（例如 `.panel/.dropdown-item/.pagination-*` 等），强化了对 Bulma 结构类的依赖。

因此，“只替换 Bulma CSS”为另一个体系（例如 shadcn）并不能自动工作：组件代码输出的 className 与 DOM 结构假设仍然是 Bulma 的语义体系。

补充说明：

- `src/theme/tokens.css` 当前可以视为探索性整理文件，而不是稳定的公开主题 API。
- 当前没有正式发布 `dark.css`、`materials.css`、`shadcn.css` 等可切换预设文件。
- README、迁移文档和 Storybook 中若提到主题方案，都应以“规划中”理解，而不是“已正式支持”。

## Terms / 术语

**EN**

- Token: a CSS variable representing a design parameter (color, radius, shadow, typography, spacing).
- Preset: a standalone CSS bundle that defines the final appearance (Bulma preset, shadcn-like preset).
- Compat layer: CSS that re-implements or overrides Bulma semantic classes without changing JSX.
- De-Bulma: components stop emitting Bulma semantic classes and instead emit library-owned semantic classes (e.g. `mpc-*`).

**中文**

- Token：通过 CSS 变量表达的设计参数（颜色、圆角、阴影、字体等），例如 `--mpc-color-primary`。
- Preset（样式预设）：一份可被单独引入的 CSS 文件集合，决定最终外观（例如 Bulma preset、shadcn preset）。
- 兼容层（compat layer）：在不改组件 JSX 的情况下，用 CSS 重新实现或覆盖某些 Bulma 语义类，使其呈现另一套视觉风格。
- 去 Bulma 化：组件不再直接输出 Bulma 语义类，改输出库自有语义类（例如 `mpc-*`），由不同 preset 决定这些语义类如何被渲染。

## Goals / Non-goals / 目标与非目标

**EN**

Goals:

- allow theme customization via CSS variables (light/dark, primary color, radius, shadow, etc.)
- support at least two switchable presets (Bulma look and an alternative look)
- provide an incremental migration path away from Bulma coupling

Non-goals (short term):

- rewriting every component to be 100% de-Bulma in one step
- guaranteeing pixel-identical parity between alternate presets and Bulma

**中文**

目标：

- 支持通过 CSS 变量进行主题定制（浅色/深色、主色、圆角、阴影等）。
- 支持至少两套可切换的样式预设（Bulma 风格、shadcn 风格）。
- 为未来逐步减少对 Bulma 的绑定提供迁移路径。

非目标（短期）：

- 不追求“一夜之间全组件 100% 去 Bulma 化”。
- 不保证替代样式 preset 与原版 Bulma 的像素级一致性。

## Option A: Compat-layer Preset / 方案 A：兼容层预设（保留 Bulma 语义类，新增 shadcn-look CSS）

**EN**

Idea: keep JSX and DOM structure unchanged, and add an additional CSS preset that overrides Bulma semantic classes to approximate an alternate design language.

Suggested artifacts:

- `@hyacinth/matsci-ui/style.css` (default Bulma preset)
- `@hyacinth/matsci-ui/presets/shadcn.css` (shadcn-look compat preset)

Example:

```ts
import '@hyacinth/matsci-ui/style.css';
```

Switch to shadcn-look:

```ts
import '@hyacinth/matsci-ui/style.css';
import '@hyacinth/matsci-ui/presets/shadcn.css';
```

Pros:

- minimal code changes, faster iteration
- low risk for API and DOM stability

Cons:

- substantial CSS work to cover the semantic surface area
- difficult to match all edge behaviors
- ongoing maintenance as new Bulma classes appear in components

Suggested steps:

1) Define a minimal token set (color, radius, shadow, typography, spacing).
2) Inventory high-frequency Bulma classes used by the library (button/input/select/modal/dropdown/panel/pagination/tag, etc.).
3) Implement those semantics in `presets/shadcn.css` using tokens, avoiding hard-coded values.
4) Provide preset switching guidance in documentation.
5) Expand coverage incrementally and converge hard-coded values into tokens.

**中文**

思路：不改组件 JSX、不改 DOM 结构、不改现有 className。新增一套 CSS preset：

- 默认仍是 Bulma preset：继续产出 `style.css`（包含 Bulma + 组件样式 + token）。
- 新增 shadcn-look preset：一份 CSS 覆盖/实现 Bulma 语义类，让 UI 视觉更接近 shadcn。

你可以把它理解为：“继续使用 Bulma 的类名作为组件库的样式 API，但换掉它们的视觉实现”。

产物形式（建议）：

- `@hyacinth/matsci-ui/style.css`（默认 Bulma preset）
- `@hyacinth/matsci-ui/presets/shadcn.css`（shadcn-look preset）

使用方式（示意）：

```ts
import '@hyacinth/matsci-ui/style.css';
```

切换为 shadcn-look：

```ts
import '@hyacinth/matsci-ui/style.css';
import '@hyacinth/matsci-ui/presets/shadcn.css';
```

优点：

- 改动面最小：组件代码基本不需要改，能够更快落地。
- 低风险：不改变组件结构与导出 API，业务接入面影响较小。

缺点：

- 兼容层 CSS 工作量大：要覆盖的 Bulma 语义类较多（布局/表单/弹窗/导航/分页等）。
- 难做到完全一致：部分组件依赖 Bulma 的特定 DOM/状态类细节，覆盖可能需要“补丁式”的 CSS。
- 长期维护成本：组件新增 Bulma 类时，兼容层也要同步支持。

落地步骤（建议顺序）：

1) 定义 token 的最小闭环（颜色/圆角/阴影/字体/间距）。
2) 统计项目中使用频率最高的 Bulma 语义类集合（button/input/select/modal/dropdown/panel/pagination/tag 等）。
3) 在 `presets/shadcn.css` 中实现这些 Bulma 类的视觉（尽量只用 token，不写死颜色）。
4) 在文档中给出 preset 切换与注意事项。
5) 逐步扩充覆盖范围，并把仍然写死的值收敛到 token。

## Option B: De-Bulma / 方案 B：去 Bulma 化（组件使用 mpc 语义类，预设实现外观）

**EN**

Idea: make the library own its semantic class contract (`mpc-*`), and let presets implement those semantics.

Pros:

- truly pluggable style systems
- cleaner long-term theming and token strategy
- clearer public “styling API” owned by the library

Cons:

- larger migration effort across many components
- risk for consumers who depend on internal DOM/class selectors
- requires a staged strategy (mixed-mode period)

Suggested steps:

1) Define the token boundary (must-have vs preset-owned).
2) Define core semantics: button / input / select / tag / card(box) / panel / dropdown / modal / pagination / table.
3) Migrate from the most reused primitives:
   - add `mpc-*` while keeping Bulma classes (transition phase)
   - gradually remove Bulma classes
4) Migrate Bulma overrides in `styles.less` into `mpc-*` implementations.
5) Ship at least two presets (bulma look and an alternative look).

**中文**

思路：把 Bulma 类名从组件的样式 API 中抽离出来，组件只输出库自有语义类（例如 `mpc-button/mpc-input/mpc-panel`）。不同 preset 提供这些语义类的实现：

- `preset/bulma.css`：用 Bulma 或 Bulma-compat 来实现 `mpc-*` 语义类
- `preset/shadcn.css`：用 shadcn 风格实现 `mpc-*` 语义类

优点：

- 真正可插拔：UI 设计体系可以替换，不再被 Bulma 语义束缚。
- 更易主题化：所有关键参数都集中为 token，组件样式更易被控制。
- 长期维护更清晰：组件库对外提供的是自有语义类契约，而不是依赖第三方框架类名。

缺点：

- 工作量大：需要逐组件改 JSX className、补齐对应 CSS、迁移全局覆盖。
- 潜在破坏性：如果有业务侧依赖组件内部 DOM/Bulma 类名做选择器，迁移会有风险。
- 需要阶段性策略：无法一次性完成，必须支持“混合阶段”。

落地步骤（建议顺序）：

1) 先明确 token 体系边界：哪些是必需 token，哪些属于 preset 自己决定。
2) 选定“核心基础语义层”：button / input / select / tag / card(box) / panel / dropdown / modal / pagination / table。
3) 从最底层、复用最多的组件开始去 Bulma 化：
   - 先给组件加 `mpc-*` 类，同时保留 Bulma 类（过渡期）
   - 再逐步移除 Bulma 类
4) 将 `styles.less` 中对 Bulma 类的覆盖迁移为对 `mpc-*` 的实现。
5) 提供两套 preset：
   - bulma preset：保证兼容现有 UI
   - shadcn preset：作为替代视觉体系
6) 在文档中补充 preset 切换与迁移说明。

## Recommendation / 选择建议

**EN**

- If you need a second look quickly: start with Option A.
- For long-term replaceable design systems: converge toward Option B, potentially after Option A delivers early value.

**中文**

- 如果你希望尽快有“第二套外观”，优先方案 A（兼容层 preset）。
- 如果你希望长期真正可替换设计体系，最终应走向方案 B；但可以先 A 快速落地，再以 B 作为长期演进方向。

## Risks and Notes / 风险与注意事项

**EN**

- shadcn is not a drop-in CSS replacement for Bulma; a compat layer or de-Bulma is required.
- selector priority and override strategy must be controlled to avoid confusing conflicts.
- global CSS should gradually converge toward `mpc-*` semantics and a controllable scope (e.g. an `.mpc-theme` container).

**中文**

- Bulma 与 shadcn 的“范式差异”：shadcn 并不是一个“替换 Bulma 文件”的框架；需要兼容层或去 Bulma 化才能成立。
- CSS 优先级与覆盖：兼容层需要控制 selector 优先级，避免出现难以解释的覆盖冲突。
- 全局样式污染：当前体系以全局 CSS 为主，建议逐步收敛到 `mpc-*` 前缀与可控作用域（例如 `.mpc-theme` 容器）。
