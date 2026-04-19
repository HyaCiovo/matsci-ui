# MP React18 组件库

中文文档。英文文档见 [README.md](file:///Users/zhujiruo/Desktop/hobby/mp-react18-components/README.md)。新旧库差异说明见 [docs/new-vs-legacy.md](file:///Users/zhujiruo/Desktop/hobby/mp-react18-components/docs/new-vs-legacy.md)。

`@materialsproject/mp-react18-components` 提供面向 Materials Project 应用的 React 18 可复用组件。

## 组件分组

### 数据展示
- `DataBlock`：键值型数据展示区域，支持富格式值渲染。
- `DataCard`：卡片式记录展示布局。
- `DataTable`：支持排序、分页、富表头和可选扩展分页的结果表格。
- `JsonView`：可展开的 JSON 查看器。
- `Formula`：化学式格式化渲染。
- `Markdown`：Markdown 内容渲染器。
- `Tooltip`：支持 hover / focus 以及自定义事件触发的提示层。
- `Modal`、`Drawer`：弹窗与抽屉式覆盖层。
- `ButtonBar`、`Paginator`、`SortDropdown`、`ArrayChips`、`ActiveFilterButtons`：常用界面辅助组件。
- Search UI 组件族：
  - `SearchUIContainer`
  - `SearchUIContextProvider`
  - `SearchUIDataCards`
  - `SearchUIDataHeader`
  - `SearchUIDataTable`
  - `SearchUIDataView`
  - `SearchUIGrid`
  - `SearchUIFilters`
  - `SearchUISearchBar`
  - `SearchUISynthesisRecipeCards`

### 数据录入
- `MaterialsInput`：支持输入类型切换和周期表辅助的主搜索输入组件。
- `GlobalSearchBar`：通用顶层搜索框。
- `FilterField`：面向 Search UI 的过滤字段渲染器。
- `Select`、`TextInput`、`Switch`、`CheckboxList`、`ThreeStateBooleanSelect`：通用表单输入。
- `RangeSlider`、`DualRangeSlider`：数值区间控件。

### 导航
- `Dropdown`、`Link`、`Tabs`：基础导航原语。
- `Navbar`、`NavbarDropdown`：应用顶栏和分组菜单。
- `Sidebar`：应用与子应用切换侧栏。
- `Scrollspy`：根据页面滚动高亮当前章节的菜单。
- `NotificationDropdown`、`Bell`：通知入口和提示徽标。

### 周期表
- `SelectableTable`：支持共享状态、选择、hover 详情和过滤联动的周期表。
- `TableFilter`：用于周期表工作流的分类、相态、族、周期过滤面板。
- `StandalonePeriodicComponent`：单个元素块渲染，支持 simple / detailed 模式。
- `PeriodicTableModeSwitcher`：切换周期表输入模式。
- `PeriodicTableFormulaButtons`：化学式快捷编辑按钮。

### 文献组件
- `BibCard`：文献卡片，包含标题、作者和操作按钮。
- `BibjsonCard`：将 bibjson 结构适配为 `BibCard`。
- `CrossrefCard`：将 Crossref 记录或 identifier 适配为 `BibCard`。
- `BibFilter`：文献记录的搜索与排序列表组件。
- `PublicationButton`：DOI / publication 外链按钮，可选抓取 bibliography tooltip。
- `OpenAccessButton`：开放获取链接按钮。
- `BibtexButton`：BibTeX 导出链接。

### Crystal Toolkit
- `CameraContextProvider`：面向晶体场景工作流的相机共享状态提供器。
- `CrystalToolkitScene`：主晶体场景组件，支持相机控制、导出和可选设置面板。
- `CrystalToolkitAnimationScene`：基于同一 scene runtime 的动画场景封装。
- `Download`：浏览器下载触发组件。
- `PhononAnimationScene`：面向声子动画的场景封装。
- `ReactGraphComponent`：图谱展示组件的轻封装。

## 使用方式

### Modal

```tsx
import {
  Modal,
  ModalContextProvider,
  ModalTrigger,
} from '@materialsproject/mp-react18-components';

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

### MaterialsInput

```tsx
import {
  MaterialsInput,
  MaterialsInputType,
} from '@materialsproject/mp-react18-components';

export function DemoMaterialsInput() {
  return (
    <MaterialsInput
      type={MaterialsInputType.CHEMICAL_SYSTEM}
      value="Li-Fe-O"
      placeholder="输入化学式或化学体系"
    />
  );
}
```

### SelectableTable

```tsx
import { SelectableTable } from '@materialsproject/mp-react18-components';

export function DemoSelectableTable() {
  return (
    <SelectableTable
      maxElementSelectable={3}
      enabledElements={['Li', 'Fe']}
    />
  );
}
```

### Search UI

```tsx
import {
  SearchUIContainer,
  SearchUISearchBar,
  SearchUIDataTable,
} from '@materialsproject/mp-react18-components';

const columns = [
  { title: 'Material ID', selector: 'material_id' },
  { title: 'Formula', selector: 'formula_pretty' },
];

export function DemoSearchUI() {
  return (
    <SearchUIContainer columns={columns} resultLabel="material">
      <SearchUISearchBar
        allowedInputTypesMap={{
          formula: { field: 'formula' },
          elements: { field: 'elements' },
          mpid: { field: 'material_ids' },
        }}
      />
      <SearchUIDataTable />
    </SearchUIContainer>
  );
}
```

### 文献组件

```tsx
import { BibCard } from '@materialsproject/mp-react18-components';

export function DemoBibCard() {
  return (
    <BibCard
      title="<i>Materials discovery</i> with machine learning"
      author={[{ given: 'Ada', family: 'Lovelace' }]}
      journal="Test Journal"
      year={2024}
      doi="10.1234/example"
    />
  );
}
```

## 说明
- 包级公开导出定义在 `src/index.ts`。
- 如果需要查看新旧库差异和剩余兼容性说明，请阅读 `docs` 中的对比文档。
