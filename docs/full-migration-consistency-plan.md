# MP React18 Components Full Migration Consistency Plan

## Goal

This plan defines how to finish the migration from `mp-react-components` to `mp-react18-components` while keeping behavior, API shape, visual output, Storybook behavior, and integration semantics as close as reasonably possible to the legacy library.

The target is not only "feature parity", but also:

- component API compatibility where practical
- user-visible behavior consistency
- Storybook parity for important states
- stable type/build/test validation
- clear migration checkpoints and rollback boundaries

## Current Status

### Already Migrated Or Reworked

- `Formula`
- `Markdown`
- `Tooltip`
- `DownloadButton`
- `Drawer`
- `Modal`
- `DataTable`
- `Link`
- `Dropdown`
- `Tabs`
- `Switch`
- `Select`
- `DualRangeSlider`
- `ThreeStateBooleanSelect`
- `GlobalSearchBar`
- `SearchUI` core surface
- `MaterialsInput`
- `PeriodicTableModeSwitcher`
- `PeriodicTableFormulaButtons`
- `SelectableTable`

### Major Legacy Features Already Reintroduced In The New Project

- wildcard tooltip behavior
- markdown help text in periodic table controls
- coordinate-driven periodic table layout
- detailed hover preview
- old-style spacer layout concepts
- lightweight selection context
- old-style hooks surface:
  - `useElements()`
  - `useDetailedElement()`
  - `actions.*`

### Still Not Fully Matched

- true observable/store behavior from the old periodic table stack
- full parity for all SearchUI edge behaviors
- full parity for all old-only components that do not yet exist in the new repo
- exhaustive story/state coverage parity
- full interaction parity for some composite components under heavy integration paths

## Migration Principles

### 1. Consistency Order

Always migrate in this order:

1. API shape
2. behavior and state transitions
3. visual output
4. stories and examples
5. focused tests

### 2. Keep Main Paths Stable

For each migrated feature, the following must remain green:

- `npm run typecheck`
- `npm run build`
- `npm run build-storybook`

Avoid broad full-suite test expansion if targeted validation is sufficient.

### 3. Prefer Structural Compatibility Over Superficial Similarity

When two implementations look similar but are architecturally different, prioritize:

- reusable state model
- composable hooks
- predictable props/events

This is especially important for:

- `MaterialsInput`
- `SelectableTable`
- `SearchUI`
- modal/drawer/context-driven UI

### 4. Keep Heavy Tests Narrow

Do not force heavy DOM integration tests where:

- the same behavior is better covered in a subcomponent
- the old repo did not rely on that test granularity
- the test becomes unstable because it pulls large composite state trees

## Workstreams

## Workstream A: Periodic Table And Materials Input

This is the highest-risk migration area because it combines:

- complex UI
- selection state
- derived text formats
- autocomplete
- visual layout
- downstream consumers like global search and SearchUI

### A1. SelectableTable

#### Current Position

- coordinate-based layout exists
- spacer/detail visuals exist
- lightweight `PeriodicSelectionContext` exists
- `useElements()` and `useDetailedElement()` exist
- child modules now consume new hooks

#### Remaining Tasks

- extract element view-model creation out of `SelectableTableView`
- move more item-state derivation into state/helpers
- align remaining action semantics with the old store
- decide whether RxJS parity is truly needed or if the current React context/store abstraction is enough
- review old `table-filter` compatibility requirements before adding more periodic-table modules

#### Acceptance Criteria

- `SelectableTable` remains API-stable for current consumers
- hover/detail state stays externally observable
- selection limits and disable rules match old behavior
- visual layout remains close to legacy stories

### A2. MaterialsInput

#### Remaining Tasks

- re-check old `MaterialsInput` substructure:
  - `MaterialsInputBox`
  - formula autocomplete flow
  - input type switching edge cases
- verify old behavior for:
  - submit timing
  - wildcard insertion
  - periodic table visibility toggling
  - max selected element formatting
- decide whether `MaterialsInputBox` should be reintroduced as an internal component for structural parity

#### Acceptance Criteria

- input mode transitions match legacy behavior
- periodic table assisted input produces equivalent serialized values
- story states cover all supported modes

### A3. GlobalSearchBar

#### Remaining Tasks

- keep it as a thin wrapper around `MaterialsInput`
- ensure query routing rules stay aligned with old search type detection
- keep tests mocked/light to avoid pulling in the full periodic-table stack

#### Acceptance Criteria

- route/query output matches old behavior for:
  - formula
  - chemical system
  - mpid
  - elements

## Workstream B: SearchUI Parity

`SearchUI` is the second largest migration surface.

### Current Surface In New Repo

- container
- context provider
- data header
- data table
- data view
- filters
- grid
- search bar

### Legacy Features To Compare Explicitly

- query synchronization
- external callback flow
- pagination/sorting/filter composition
- container behavior under empty/loading/error states
- any old matscholar-specific variants that may need explicit scope decisions

### Remaining Tasks

- do a one-to-one comparison between old and new `SearchUI` context shape
- verify utility functions and query serialization rules
- re-evaluate missing tests after periodic-table stabilization
- identify any old-only subcomponents intentionally left out

### Acceptance Criteria

- same query -> same outgoing request params
- same user interaction -> same context transitions
- stories cover empty/loading/populated states

## Workstream C: Data Display Components

### Components Already Present

- `DataTable`
- `DownloadButton`
- `Drawer`
- `Formula`
- `Markdown`
- `Modal`
- `Tooltip`

### Legacy Components Missing In New Repo

- `ActiveFilterButtons`
- `ArrayChips`
- `ButtonBar`
- `DataBlock`
- `DataCard`
- `DownloadDropdown`
- `Enlargeable`
- `JsonView`
- `Paginator`
- `SortDropdown`
- `SynthesisRecipeCard`

### Decision Needed For Each Missing Component

For every old-only component, choose one of:

1. migrate fully
2. intentionally defer
3. intentionally drop with documented rationale
4. replace with an existing React 18 component already covering the same need

### Acceptance Criteria

- a written scope decision exists for every old-only component
- no silent omissions remain

## Workstream D: Data Entry Components

### Present In New Repo

- `CheckboxList`
- `DualRangeSlider`
- `FilterField`
- `GlobalSearchBar`
- `MaterialsInput`
- `Select`
- `Switch`
- `TextInput`
- `ThreeStateBooleanSelect`

### Legacy Components Missing In New Repo

- `RangeSlider`
- `MaterialsInputBox`
- shared `utils.tsx` equivalents may need review

### Remaining Tasks

- decide whether `RangeSlider` is still needed
- review whether `MaterialsInputBox` should reappear internally
- compare old data-entry utility helpers against current logic duplication

## Workstream E: Navigation Components

### Present In New Repo

- `Dropdown`
- `Link`
- `Tabs`

### Legacy Components Missing In New Repo

- `Navbar`
- `NavbarDropdown`
- `NotificationDropdown`
- `Scrollspy`
- `Sidebar`

### Remaining Tasks

- determine whether these are in scope for the React 18 package
- if yes, migrate in order of shared utility value:
  1. `Scrollspy`
  2. `Navbar`
  3. `NavbarDropdown`
  4. `Sidebar`
  5. `NotificationDropdown`

## Workstream F: Publications

### Missing Entire Legacy Area

- `BibCard`
- `BibFilter`
- `BibjsonCard`
- `BibtexButton`
- `CrossrefCard`
- `OpenAccessButton`
- `PublicationButton`

### Recommendation

Treat publications as a dedicated migration stream after periodic table + SearchUI stabilize.

### Acceptance Criteria

- scope is explicitly approved before implementation
- asset handling is verified
- story coverage exists for each migrated publication component

## Workstream G: Crystal Toolkit

### Legacy Area Missing Entirely

- `CameraContextProvider`
- `CrystalToolkitScene`
- `CrystalToolkitAnimationScene`
- `DynamicCrystalToolkitScene`
- `PhononAnimationScene`
- scene helpers and rendering utilities

### Recommendation

Do not start this stream until:

- periodic-table migration is structurally complete
- SearchUI parity decisions are documented
- 3D/rendering dependency strategy for React 18 is approved

This stream has the highest integration and dependency risk.

## Component Inventory Decision Table

### Already In New Repo

- data-display core set
- navigation core set
- SearchUI main set
- MaterialsInput + periodic-table stack

### Legacy Components Not Yet In New Repo

- data-display:
  - `ActiveFilterButtons`
  - `ArrayChips`
  - `ButtonBar`
  - `DataBlock`
  - `DataCard`
  - `DownloadDropdown`
  - `Enlargeable`
  - `JsonView`
  - `Paginator`
  - `SortDropdown`
  - `SynthesisRecipeCard`
- data-entry:
  - `RangeSlider`
  - `MaterialsInputBox`
- navigation:
  - `Navbar`
  - `NavbarDropdown`
  - `NotificationDropdown`
  - `Scrollspy`
  - `Sidebar`
- publications:
  - all
- crystal-toolkit:
  - all

## Recommended Execution Order

### Phase 1: Finish Periodic Table Stack

- thin `SelectableTableView` further
- consolidate view models and item state
- decide final store abstraction
- verify `MaterialsInput` edge behavior against old stories

### Phase 2: Lock SearchUI

- compare container/context/query behavior one-by-one
- restore any missing edge handling
- verify story parity for primary result states

### Phase 3: Resolve Missing Core Components

- explicit scope decisions for missing data-display/data-entry/navigation components
- migrate highest leverage missing components

### Phase 4: Publications

- migrate only if still required by consuming apps

### Phase 5: Crystal Toolkit

- separate approval and dependency review required

## Validation Matrix

For every component or feature migrated, validate at these levels:

### Type Level

- `npm run typecheck`

### Package Level

- `npm run build`

### Visual Level

- `npm run build-storybook`
- compare stories against legacy behavior

### Test Level

Use focused tests only when they provide real confidence:

- state transitions
- query serialization
- URL updates
- edge-case interaction rules

Avoid broad heavy DOM chains unless absolutely necessary.

## Storybook Requirements

Each migrated complex component should have stories for:

- base/default state
- disabled state
- loading state if applicable
- empty state if applicable
- error state if applicable
- one interaction-heavy state for manual review

Priority components:

- `MaterialsInput`
- `GlobalSearchBar`
- `SearchUISearchBar`
- `SearchUIFilters`
- `SelectableTable`

## Consistency Checklist Per Component

Before declaring any component "fully migrated", verify:

- props match legacy intent
- emitted callbacks match legacy semantics
- visible text/help/tooltip behavior matches
- keyboard and focus behavior is not regressed
- Storybook examples cover main supported states
- typecheck/build/storybook build all pass

## Risks

### High Risk

- periodic-table state/store divergence
- SearchUI query logic drift
- large composite tests becoming unstable
- hidden legacy behavior embedded in old stories rather than tests

### Medium Risk

- missing old-only helper components causing subtle UI inconsistencies
- story drift between legacy and React 18 versions

### Low Risk

- simple leaf component parity once props are matched

## Decision Log Recommendations

For each future migration slice, document:

- component/feature name
- parity target
- intentionally dropped legacy behavior
- validation performed
- unresolved gaps

Keep this as a lightweight append-only section in future updates or in a separate migration log.

## Immediate Next Recommended Slice

The next highest-value slice is:

1. further thin `SelectableTableView`
2. centralize element view-model derivation
3. re-check `MaterialsInput` behavior against old stories using the new selection hooks

That gives the best payoff before moving into broader SearchUI parity and missing component streams.
