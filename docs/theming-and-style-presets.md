# Multi-theme / Style Presets Status / 多主题与样式预设现状

Last updated: 2026-04-26

## EN

This document reflects the current repository reality rather than an old theming plan. The library now has **two supported published base theme entrypoints**, an **optional Markdown addon stylesheet**, and a **separate Storybook-only preview layer**.

### Public package contract

The npm package is designed to expose exactly these stylesheet entrypoints:

- `@hyacinth/matsci-ui/style.css`
- `@hyacinth/matsci-ui/themes/bulma.css`
- `@hyacinth/matsci-ui/themes/gnosys.css`
- `@hyacinth/matsci-ui/themes/markdown.css`

Current meaning:

- `style.css`: alias of the published Bulma theme
- `themes/bulma.css`: explicit Bulma preset entry
- `themes/gnosys.css`: explicit Gnosys preset entry
- `themes/markdown.css`: optional KaTeX and code-highlighting addon for `Markdown`

Applications should load **exactly one** of these theme bundles at the application shell entry.

### Recommended consumer usage

```ts
// Bulma theme
import '@hyacinth/matsci-ui/style.css';

// or:
import '@hyacinth/matsci-ui/themes/bulma.css';

// Gnosys theme
import '@hyacinth/matsci-ui/themes/gnosys.css';

// Optional Markdown math / code-highlighting addon
import '@hyacinth/matsci-ui/themes/markdown.css';
```

Guidance:

- Do not statically import both `bulma.css` and `gnosys.css` into the same app shell.
- Import `themes/markdown.css` only when the application renders Markdown math or highlighted code.
- Components do not auto-inject CSS.
- Storybook toolbar switching is a docs/runtime convenience, not a public JS theming API.
- If a product needs runtime theme switching, swap the active stylesheet at the host-app shell level rather than eagerly importing both preset bundles.

### What ships in the package

Published build output currently emits:

- `dist/themes/bulma.css`
- `dist/themes/gnosys.css`
- `dist/themes/markdown.css`

The package exports map only points to those published theme files. Storybook-only CSS is not exported from `package.json` and is not emitted into `dist`.

### What is Storybook-only

These files exist only for Storybook preview/runtime behavior:

- `.storybook/themes/gnosys-preview-tokens.css`
- `.storybook/themes/gnosys-preview-overrides.css`

They are intentionally outside `src/themes` now so the boundary is obvious:

- `src/themes/*`: publishable library theme source
- `.storybook/themes/*`: preview-only docs/runtime adjustments

This simplification removes the earlier confusion where Storybook-specific Gnosys preview files lived beside publishable preset files under `src/themes/presets`.

### Current theme model

Use these terms consistently:

- **Foundation**: tokens, resets, Bulma-compatible primitives, and utility rules
- **Shared**: component rules shared by all published presets
- **Preset**: preset-owned visual tokens and overrides
- **Entry**: final published bundle entrypoint
- **Preview-only**: Storybook runtime styling that should not ship in the npm package

### Current source structure

```text
src/themes/
  foundation/
    tokens.css
    matsci-bulma.css
  shared/
    components.ts
    components-*.css
    components-*.less
  presets/
    bulma.ts
    gnosys.ts
    gnosys-tokens.css
    gnosys-overrides.css
  entries/
    bulma.ts
    gnosys.ts

.storybook/
  themes/
    gnosys-preview-tokens.css
    gnosys-preview-overrides.css
```

### Current supported presets

- `bulma.css`: stable Bulma preset, closest to Bulma continuity
- `gnosys.css`: stable secondary preset, now tuned toward a flatter academic style with stronger deep-blue emphasis and tighter radii

The repository intentionally keeps the public preset surface narrow. That is a maintenance choice, not a temporary accident.

### Practical maintenance direction

Short term:

- keep `bulma.css` as the baseline consumer entry
- keep visual deltas for the Gnosys theme in `gnosys-tokens.css` and `gnosys-overrides.css`
- keep Storybook preview CSS outside the publishable theme tree

Medium term:

- continue pushing structural rules into `shared`
- keep preset-specific visuals in `presets`
- avoid letting Storybook preview fixes leak back into package theme sources unless they are genuinely consumer-facing rules

Constraints:

- Host applications should not depend on internal DOM details or old Bulma global selectors.
- `vis.less` remains intentionally separate because other packages still depend on it.
- Additional presets should not be added unless they have a real maintenance owner.

## 中文

本文档反映的是当前仓库真实状态，而不是早期的主题规划说明。现在组件库已经形成了 **两套正式发布基础主题入口**、**一套可选 Markdown 附加样式入口**，同时又把 **Storybook 预览专用样式层** 和 npm 包样式层明确分开。

### 对外包契约

npm 包当前设计为暴露以下样式入口：

- `@hyacinth/matsci-ui/style.css`
- `@hyacinth/matsci-ui/themes/bulma.css`
- `@hyacinth/matsci-ui/themes/gnosys.css`
- `@hyacinth/matsci-ui/themes/markdown.css`

当前含义分别是：

- `style.css`：Bulma 主题别名
- `themes/bulma.css`：显式 Bulma 主题入口
- `themes/gnosys.css`：显式 Gnosys 主题入口
- `themes/markdown.css`：`Markdown` 的可选 KaTeX 与代码高亮附加样式

业务应用应当在应用壳层入口 **只加载其中一套**。

### 推荐引入方式

```ts
// Bulma 主题
import '@hyacinth/matsci-ui/style.css';

// 或：
import '@hyacinth/matsci-ui/themes/bulma.css';

// Gnosys 主题
import '@hyacinth/matsci-ui/themes/gnosys.css';

// 可选的 Markdown 数学公式 / 代码高亮附加样式
import '@hyacinth/matsci-ui/themes/markdown.css';
```

使用建议：

- 不要在同一个应用壳层里静态同时引入 `bulma.css` 和 `gnosys.css`
- 只有业务里会渲染 Markdown 数学公式或代码高亮时，才引入 `themes/markdown.css`
- 组件本身不会自动注入 CSS
- Storybook 工具栏里的主题切换只是文档运行时能力，不是公开的 JS 主题 API
- 如果业务项目需要运行时换肤，应当在宿主应用壳层切换实际加载的 stylesheet，而不是把两套 preset 一起预加载

### 哪些文件会随包发布

当前正式构建只会产出：

- `dist/themes/bulma.css`
- `dist/themes/gnosys.css`
- `dist/themes/markdown.css`

`package.json` 的 `exports` 也只指向这两套正式主题文件。Storybook 专用 CSS 不会在 `package.json` 中导出，也不会进入 `dist`。

### 哪些文件只是 Storybook 预览用

以下文件只服务于 Storybook 预览/runtime：

- `.storybook/themes/gnosys-preview-tokens.css`
- `.storybook/themes/gnosys-preview-overrides.css`

它们现在被有意放在 `src/themes` 之外，边界更清楚：

- `src/themes/*`：可发布的库主题源码
- `.storybook/themes/*`：只服务于文档预览的运行时修正

这次简化解决了之前一个明显的问题：Storybook 专用的 Gnosys 预览文件以前和正式发布 preset 文件混放在 `src/themes/presets` 里，容易让人误以为它们也属于 npm 包契约。

### 当前主题模型

建议统一使用以下术语：

- **Foundation**：token、基础重置、Bulma 兼容原子层和工具规则
- **Shared**：所有正式 preset 共享的组件样式
- **Preset**：某个 preset 自己的视觉 token 与 override
- **Entry**：最终对外打包的主题入口
- **Preview-only**：只服务于 Storybook 文档运行时、不应进入 npm 包的样式文件

### 当前源码结构

```text
src/themes/
  foundation/
    tokens.css
    matsci-bulma.css
  shared/
    components.ts
    components-*.css
    components-*.less
  presets/
    bulma.ts
    gnosys.ts
    gnosys-tokens.css
    gnosys-overrides.css
  entries/
    bulma.ts
    gnosys.ts

.storybook/
  themes/
    gnosys-preview-tokens.css
    gnosys-preview-overrides.css
```

### 当前两套正式主题

- `bulma.css`：稳定 Bulma 主题，最接近 Bulma 延续风格
- `gnosys.css`：稳定的第二主题，当前已经调整为更扁平、更学术、更偏深蓝强调、圆角更小的方向

仓库当前有意把正式 preset 面收敛在这两套里，这不是临时状态，而是维护策略的一部分。

### 当前维护建议

短期：

- 继续把 `bulma.css` 作为主基线
- 继续把 Gnosys 主题的视觉差异集中在 `gnosys-tokens.css` 和 `gnosys-overrides.css`
- 持续把 Storybook 预览 CSS 保留在发布主题树之外

中期：

- 结构性规则继续留在 `shared`
- preset 视觉差异继续留在 `presets`
- Storybook 预览修正只有在真正影响消费者时，才回流到可发布主题源码

约束：

- 宿主应用不应依赖内部 DOM 细节或旧 Bulma 全局选择器
- `vis.less` 仍然需要保持独立，因为还有其他包依赖它
- 不应继续轻易增加更多公开 preset，除非有明确维护人和长期维护预算
