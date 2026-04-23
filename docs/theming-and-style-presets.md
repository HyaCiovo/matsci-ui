# Multi-theme / Style Presets Status / 多主题与样式预设现状

Last updated: 2026-04-24

## EN

This document is no longer only a planning note. The **multi-theme architecture is now implemented in the repository**, including explicit theme entrypoints, unified source layout, library-owned `ms-*` selectors, and separate default / alternate stylesheet outputs.

The package is **still not published to npm yet**, so the public install contract is defined, but the primary way to verify theme behavior remains the repository build output and Storybook.

### What is shipped in the repository today

- Explicit stylesheet entrypoints:
  - `@hyacinth/matsci-ui/style.css`
  - `@hyacinth/matsci-ui/themes/default.css`
  - `@hyacinth/matsci-ui/themes/alt.css`
- Unified source theme tree under `src/themes`
- Theme layering:
  - `src/themes/foundation/*`
  - `src/themes/shared/*`
  - `src/themes/presets/*`
  - `src/themes/entries/*`
- A library-owned styling contract based on `ms-*` selectors instead of exposing raw Bulma selectors to host applications
- Build output that emits:
  - `dist/themes/default.css`
  - `dist/themes/alt.css`

### What has changed compared with the earlier plan

Earlier versions of this document described theme presets as “planned”. That is no longer accurate.

The following parts are already implemented:

- explicit theme CSS entrypoints in package exports
- a split between foundation styles, shared component skinning, preset-specific layers, and final build entries
- a migrated class strategy centered on `ms-*`
- a dedicated alternate preset hook using:
  - `src/themes/presets/alt-tokens.css`
  - `src/themes/presets/alt-overrides.css`

### What is still incomplete

The remaining gap is **not the architecture**. The remaining gap is the **visual coverage and completeness of the alternate theme**.

Today:

- `default.css` is the stable default consumer entry
- `alt.css` is a real exported build artifact
- the alternate preset already has dedicated token and override files
- but the alternate preset is not yet a fully differentiated second visual system across every component surface

In other words:

- multi-theme delivery is landed
- the second theme’s visual language is still being expanded

### Current mental model

Use these terms consistently:

- **Foundation**: tokens, resets, Bulma-compatible primitives, and utilities
- **Shared**: component styling shared across presets
- **Preset**: preset-owned visual choices, tokens, and overrides
- **Entry**: final theme bundle entrypoint consumed by Storybook and npm package builds

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
    default.ts
    alt.ts
    alt-tokens.css
    alt-overrides.css
  entries/
    default.ts
    alt.ts
```

### Current published-style contract

When the package is published, consumers should use one of these:

```ts
import '@hyacinth/matsci-ui/style.css';
// or:
import '@hyacinth/matsci-ui/themes/default.css';
// or:
import '@hyacinth/matsci-ui/themes/alt.css';
```

Current recommendation:

- use `style.css` or `themes/default.css` for production-style default usage
- treat `themes/alt.css` as the shipped alternate-theme entrypoint whose implementation surface is still growing

### Why the old “just swap Bulma” approach was not enough

Historically, this library inherited strong Bulma coupling:

- Bulma-shaped DOM/class conventions
- component-local style patches
- host-level leakage from global selectors

The current repository has already addressed the most important structural problem by moving styling ownership into library-controlled `ms-*` selectors and a dedicated theme tree.

That means the problem statement has changed:

- before: “how do we make theming possible at all?”
- now: “how do we complete and polish the alternate preset without regressing the default one?”

### Recommended next implementation direction

Short term:

- keep `default.css` as the stable visual baseline
- continue expanding `alt-tokens.css` and `alt-overrides.css`
- avoid breaking shared component structure while preset coverage improves

Medium term:

- continue moving visual choices into preset-owned files rather than `shared`
- keep structural rules in `shared`
- keep global foundation rules in `foundation`

Long term:

- ship a clearly differentiated second preset
- optionally add more preset entrypoints if they can be maintained safely

### Risks and constraints

- The package is not published yet, so public documentation must keep reminding readers that Storybook is currently the easiest preview surface.
- Host applications should not depend on internal DOM details or old Bulma selectors.
- `vis.less` remains intentionally separate because other npm packages still depend on it.
- The alternate theme should not claim complete parity until its visual coverage is actually finished.

## 中文

本文档不再只是“规划说明”。当前仓库里，**多主题架构本身已经落地**，包括显式主题入口、统一的主题源码目录、库自有 `ms-*` 选择器，以及默认主题 / 第二主题样式产物。

但 npm 包 **仍然还没有正式发布**，所以当前公开安装契约虽然已经确定，实际验证主题能力仍应以仓库构建产物和 Storybook 为主。

### 当前仓库已经具备的能力

- 显式样式入口：
  - `@hyacinth/matsci-ui/style.css`
  - `@hyacinth/matsci-ui/themes/default.css`
  - `@hyacinth/matsci-ui/themes/alt.css`
- 统一的 `src/themes` 主题源码树
- 主题分层结构：
  - `src/themes/foundation/*`
  - `src/themes/shared/*`
  - `src/themes/presets/*`
  - `src/themes/entries/*`
- 基于库自有 `ms-*` 选择器的样式契约，不再把原始 Bulma 全局类直接暴露给宿主项目
- 构建产物会输出：
  - `dist/themes/default.css`
  - `dist/themes/alt.css`

### 相比旧版规划，已经变化的地方

旧版文档把多主题能力描述为“规划中”。这已经不准确了。

以下部分已经在仓库里落地：

- 包导出中有明确的主题 CSS 入口
- 样式源码已经拆成基础层、共享层、预设层和最终入口层
- 组件样式契约已经迁移到 `ms-*`
- 第二主题已经拥有专属的：
  - `src/themes/presets/alt-tokens.css`
  - `src/themes/presets/alt-overrides.css`

### 目前还没完成的部分

当前没完成的不是“架构能力”，而是**第二套主题视觉覆盖面的完整度**。

目前的真实状态是：

- `default.css` 是稳定的默认主题入口
- `alt.css` 是真实存在、会随构建输出的第二主题产物
- 第二主题已经有自己的 token 和 override 文件
- 但第二主题还没有在所有组件表面上形成一套完全成熟、差异明确的第二视觉系统

换句话说：

- 多主题交付能力已经落地
- 第二主题的视觉语言仍在继续补齐

### 当前推荐的理解方式

统一使用以下术语：

- **Foundation**：token、基础重置、Bulma 兼容原子层与工具类
- **Shared**：不同 preset 共享的组件结构样式
- **Preset**：具体主题自己的视觉选择、token 与 override
- **Entry**：最终供 Storybook 和 npm 构建使用的主题打包入口

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
    default.ts
    alt.ts
    alt-tokens.css
    alt-overrides.css
  entries/
    default.ts
    alt.ts
```

### 当前对外样式契约

等 npm 包正式发布后，业务方应通过以下方式之一引入样式：

```ts
import '@hyacinth/matsci-ui/style.css';
// 或：
import '@hyacinth/matsci-ui/themes/default.css';
// 或：
import '@hyacinth/matsci-ui/themes/alt.css';
```

当前推荐：

- 默认生产使用优先走 `style.css` 或 `themes/default.css`
- 把 `themes/alt.css` 视为已经存在并可交付的第二主题入口，但它的视觉实现仍在继续扩充

### 为什么旧时代“直接替换 Bulma”已经不是重点问题

历史上这个库的样式和 Bulma 耦合很深：

- DOM/class 语义强依赖 Bulma
- 组件目录里散落大量样式补丁
- 全局选择器容易污染宿主应用

当前仓库已经通过库自有 `ms-*` 选择器和统一主题目录，解决了最关键的结构性问题。

因此，问题本身已经变化了：

- 过去的问题是：“怎么让主题切换至少成为可能？”
- 现在的问题是：“如何在不破坏默认主题的前提下，把第二主题继续做完整？”

### 当前推荐的后续实现方向

短期：

- 继续把 `default.css` 作为稳定视觉基线
- 持续补齐 `alt-tokens.css` 与 `alt-overrides.css`
- 在扩充第二主题覆盖时，避免破坏 shared 层的结构稳定性

中期：

- 继续把视觉差异尽量收敛到 preset 层，而不是 shared 层
- 结构性规则留在 `shared`
- 全局基础规则留在 `foundation`

长期：

- 交付一套差异更明确、覆盖更完整的第二主题
- 如果维护成本可控，再考虑扩展更多 preset 入口

### 风险与约束

- npm 包尚未正式发布，因此所有外部文档仍应提醒读者：当前 Storybook 仍然是最直接的预览入口。
- 宿主项目不应继续依赖内部 DOM 细节或旧 Bulma 选择器。
- `vis.less` 仍然需要保持独立，因为还有其他 npm 包依赖它。
- 在第二主题的视觉覆盖尚未完成之前，不应把它表述为“已完全达到默认主题同等级别的正式替代”。
