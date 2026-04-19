# MP React18 Components

English documentation. For Chinese documentation, see [README.zh-CN.md](file:///Users/zhujiruo/Desktop/hobby/mp-react18-components/README.zh-CN.md). For legacy comparison notes, see [docs/new-vs-legacy.md](file:///Users/zhujiruo/Desktop/hobby/mp-react18-components/docs/new-vs-legacy.md).

`@materialsproject/mp-react18-components` provides reusable React 18 UI components for Materials Project applications.

## Component Groups

### Data Display
- `DataBlock`: key-value data sections with support for rich value formatting.
- `DataCard`: card-style layout for grouped records.
- `DataTable`: sortable and optionally selectable result table with rich headers and optional expanded pagination.
- `JsonView`: expandable JSON object viewer.
- `Formula`: formatted chemical formula rendering.
- `Markdown`: markdown-to-HTML renderer for help text and rich content.
- `Tooltip`: tooltip wrapper supporting hover, focus, and custom event triggers.
- `Modal`, `Drawer`: overlay patterns for dialogs and slide-over panels.
- `ButtonBar`, `Paginator`, `SortDropdown`, `ArrayChips`, `ActiveFilterButtons`: common UI helpers.
- Search UI family:
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

### Data Entry
- `MaterialsInput`: search input with type switching and optional periodic-table assistance.
- `GlobalSearchBar`: top-level search field for generic queries.
- `FilterField`: Search UI-compatible filter field renderer.
- `Select`, `TextInput`, `Switch`, `CheckboxList`, `ThreeStateBooleanSelect`: reusable form inputs.
- `RangeSlider`, `DualRangeSlider`: numeric range controls.

### Navigation
- `Dropdown`, `Link`, `Tabs`: basic navigation primitives.
- `Navbar`, `NavbarDropdown`: app-level top navigation and grouped menus.
- `Sidebar`: app switcher and sub-app navigation.
- `Scrollspy`: menu that highlights the first visible target section.
- `NotificationDropdown`, `Bell`: notification entry point and badge indicator.

### Periodic Table
- `SelectableTable`: shared-state periodic table for selection, hover detail, and filter integration.
- `TableFilter`: category, phase, group, and period filtering panel for periodic table workflows.
- `StandalonePeriodicComponent`: single-element tile rendering in simple or detailed mode.
- `PeriodicTableModeSwitcher`: switches periodic table input modes.
- `PeriodicTableFormulaButtons`: quick formula editing helpers.

### Publications
- `BibCard`: publication card with title, author list, and action buttons.
- `BibjsonCard`: adapter from bibjson-style records to `BibCard`.
- `CrossrefCard`: adapter from Crossref records or identifiers to `BibCard`.
- `BibFilter`: searchable and sortable list renderer for publication records.
- `PublicationButton`: DOI/publication link with optional fetched bibliography tooltip.
- `OpenAccessButton`: open-access link helper.
- `BibtexButton`: BibTeX export link helper.

### Crystal Toolkit
- `CameraContextProvider`: shared camera state provider for crystal scene workflows.
- `CrystalToolkitScene`: main crystal scene renderer with camera controls, exports, and optional settings panels.
- `CrystalToolkitAnimationScene`: animation-enabled wrapper over the crystal scene runtime.
- `Download`: browser download trigger for generated data.
- `PhononAnimationScene`: phonon-specific animation scene wrapper.
- `ReactGraphComponent`: thin wrapper around graph visualization.

## Usage

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
        <button type="button">Open</button>
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
      placeholder="Enter a formula or chemical system"
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

### Publications

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

## Notes
- Public exports are defined in `src/index.ts`.
- For API differences from the legacy package, use the dedicated comparison document in `docs`.
