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

- `ActiveFilterButtons`
- `ArrayChips`
- `ButtonBar`
- `DataBlock`
- `DataCard`
- `DownloadDropdown`
- `Enlargeable`
- `Formula`
- `JsonView`
- `Markdown`
- `Paginator`
- `SortDropdown`
- `SynthesisRecipeCard`
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
- `RangeSlider`
- `ThreeStateBooleanSelect`
- `GlobalSearchBar`
- `SearchUI` core surface
- `MaterialsInput`
- `MaterialsInputBox` as an internal structural helper
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
- final parity for `SelectableTable` state semantics and `MaterialsInput` edge behavior remains the top active migration stream
- explicit downgrade decisions should be documented where old internal store hooks existed without real consumers
- final scope decision and migration for remaining non-SearchUI legacy areas
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

### Status

- still the highest-priority active migration stream
- structural React 18 replacements are already in place:
  - `SelectableTable`
  - `PeriodicSelectionContext`
  - `useElements()`
  - `useDetailedElement()`
  - `TableFilter`
  - `PeriodicTableModeSwitcher`
  - `PeriodicTableFormulaButtons`
  - `MaterialsInput`
  - `GlobalSearchBar`
- remaining work is now concentrated in final state semantics, legacy edge behavior, and scope decisions for adjacent old-only inputs

### A1. SelectableTable

#### Current Position

- coordinate-based layout exists
- spacer/detail visuals exist
- lightweight `PeriodicSelectionContext` exists
- `useElements()` and `useDetailedElement()` exist
- child modules now consume new hooks
- `selection-state.ts` and `view-model.ts` already isolate part of the old store logic
- `onStateChange` now distinguishes action-driven updates from prop synchronization
- selection-limit disabling now matches legacy behavior for both `SELECT` and `MULTI_INPUTS_SELECT`
- `MULTI_INPUTS_SELECT` keeps the effective legacy user behavior of one active element at a time
- old slot bookkeeping hooks (`currentElementIndex`, `selectedElements.current`) are currently treated as an explicit internal downgrade because no real consumer was found

#### Remaining Tasks

- continue thinning `SelectableTableView` so rendering is mostly driven by `view-model.ts` and selection helpers
- move any remaining item-state derivation into `selection-state.ts` or helper modules
- keep aligning `lastAction` and any remaining state-transition edge cases with the legacy store contract
- decide whether current `PeriodicSelectionContext` is the final replacement for the old observable/RxJS model
- keep the `MULTI_INPUTS_SELECT` downgrade documented unless a real slot-based consumer appears
- verify `TableFilter` compatibility before reintroducing any more periodic-table-adjacent helpers

#### Acceptance Criteria

- `SelectableTable` remains API-stable for current consumers
- hover/detail state stays externally observable
- selection limits and disable rules match old behavior
- explicit downgrade decisions are documented for any legacy internal hooks that are not restored
- visual layout remains close to legacy stories

### A2. MaterialsInput

#### Current Position

- `MaterialsInput` is already restored with:
  - formula autocomplete
  - input help
  - periodic table integration
  - internal `MaterialsInputBox` structure restored
  - story coverage
  - focused tests
- `GlobalSearchBar` already consumes the React 18 `MaterialsInput`
- `RangeSlider` has now been restored as a public data-entry component
- current gaps are now mostly edge-behavior and final state-semantics issues rather than missing main-path functionality

#### Remaining Tasks

- re-check old `MaterialsInput` substructure:
  - formula autocomplete flow
  - input type switching edge cases
- verify old behavior for:
  - submit timing
  - wildcard insertion
  - periodic table visibility toggling
  - max selected element formatting
- decide whether `MaterialsInputBox` should remain:
  - an internal structural helper only
  - or later become a public component if a consuming app needs it
- verify whether any old stories or consumers require `RangeSlider` behavior beyond the restored public API

#### Acceptance Criteria

- input mode transitions match legacy behavior
- periodic table assisted input produces equivalent serialized values
- story states cover all supported modes

### A3. GlobalSearchBar

#### Current Position

- already migrated as a thin wrapper around `MaterialsInput`
- current risk is mostly inherited from periodic-table and `MaterialsInput` semantics, not from `GlobalSearchBar` itself

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

### Status

- completed for migration closeout
- core behavior parity is now treated as achieved
- remaining differences are documented as intentional simplifications or visual drift

### Current Surface In New Repo

- container
- context provider
- data header
- data table
- data view
- filters
- grid
- search bar
- matscholar container/provider compatibility layer
- synthesis cards view
- top-level composed stories

### Legacy Features To Compare Explicitly

- query synchronization
- external callback flow
- pagination/sorting/filter composition
- container behavior under empty/loading/error states
- any old matscholar-specific variants that may need explicit scope decisions

### Closeout Summary

- query/request protocol parity restored:
  - legacy `_sort_fields`, `_limit`, `_skip`, `_fields`
  - `apiEndpointParams`
  - `totalKey`
  - comma-style array serialization
- container/context compatibility restored:
  - legacy `state + query` shape
  - `useSearchUIContextActions()`
  - browser `popstate` synchronization
  - container-level `debounce`
- view and result behavior restored:
  - `table / synthesis` switching
  - local pagination and sorting parity
  - matscholar two-step search flow with cached `material_ids`
- composed stories now exist for:
  - primary SearchUI container flow
  - matscholar alpha flow
- focused regression tests now cover:
  - query serialization and URL hydration
  - filters
  - search bar value/type inference
  - matscholar flow
  - data view switching

### Intentional Simplifications

- header controls use lighter React 18 implementations instead of fully recreating every old subcomponent
- `cards` view remains out of scope because it was not an active primary path in the legacy mapping
- visual details may differ where Radix UI or new table primitives replaced old third-party widgets

### Acceptance Criteria

- same query -> same outgoing request params
- same user interaction -> same context transitions
- stories cover empty/loading/populated states
- SearchUI closeout is documented and no known migration-blocking gaps remain

## Workstream C: Data Display Components

### Status

- substantially complete for the public data-display surface
- SearchUI-adjacent display components have been restored and reconnected
- remaining gaps are now mostly intentional deferrals or lower-priority leaf areas

### Components Already Present

- `ActiveFilterButtons`
- `ArrayChips`
- `ButtonBar`
- `DataBlock`
- `DataCard`
- `DataTable`
- `DownloadButton`
- `DownloadDropdown`
- `Drawer`
- `Enlargeable`
- `Formula`
- `JsonView`
- `Markdown`
- `Modal`
- `Paginator`
- `SortDropdown`
- `SynthesisRecipeCard`
- `Tooltip`

### Components Reconnected To Current Flows

- `ActiveFilterButtons` now powers `SearchUIDataHeader`
- `DataBlock` is now used by `SynthesisRecipeCard`
- `SynthesisRecipeCard` now powers the recipe branch of `SearchUISynthesisRecipeCards`
- `Paginator` now powers synthesis paging
- `SortDropdown` now powers SearchUI header sorting
- `ArrayChips` now backs `ColumnFormat.ARRAY` rendering in the shared table formatter

### Remaining Gaps / Decisions

- `SearchUIDataCards` remains intentionally out of scope for now
- any future additions should justify consumer need before implementation
- visual parity may still differ slightly where Bulma-era widgets were replaced with lighter React 18 implementations

### Closeout Summary

- public old-only data-display component gaps have been closed
- each newly restored component now includes package export coverage
- most restored components also include stories and focused tests
- remaining work in this area is maintenance-level unless a consuming app identifies a missing edge case

### Acceptance Criteria

- public data-display surface is either migrated or intentionally deferred with rationale
- no known migration-blocking omissions remain in the data-display package surface

## Workstream D: Data Entry Components

### Present In New Repo

- `CheckboxList`
- `DualRangeSlider`
- `FilterField`
- `GlobalSearchBar`
- `MaterialsInput`
- `RangeSlider`
- `Select`
- `Switch`
- `TextInput`
- `ThreeStateBooleanSelect`

### Legacy Components Not Publicly Reintroduced

- `MaterialsInputBox`
- shared `utils.tsx` equivalents may need review

### Remaining Tasks

- review whether `MaterialsInputBox` should remain internal or eventually reappear as a public export
- compare old data-entry utility helpers against current logic duplication
- verify whether any remaining legacy consumers depend on pre-React-18 `RangeSlider` edge behavior not yet covered

### Note

- `MaterialsInputBox` and `RangeSlider` were treated as part of the periodic-table priority because they directly affected `MaterialsInput` parity

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
  - no known package-level public component gaps
  - `SearchUIDataCards` remains intentionally deferred outside the current public core path
- data-entry:
  - no known public gap other than the decision to keep `MaterialsInputBox` internal for now
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

- current top priority
- thin `SelectableTableView` further
- consolidate view models and item state around `view-model.ts` and `selection-state.ts`
- decide the final store abstraction for periodic selection semantics
- verify `MaterialsInput` edge behavior against old stories and tests
- make explicit scope decisions for:
  - whether `MaterialsInputBox` should stay internal or become public
  - any remaining table-filter compatibility helpers
  - whether the documented `MULTI_INPUTS_SELECT` downgrade needs reopening for a real consumer
  - any legacy `RangeSlider` edge behavior still required by consuming apps

### Phase 2: Lock SearchUI

- completed
- preserve as maintenance-only unless new consuming apps surface undocumented edge cases

### Phase 3: Resolve Missing Core Components

- data-display public surface: largely completed
- next focus should shift to explicit scope decisions for remaining data-entry and navigation components
- only reopen data-display when a consuming app needs currently deferred behavior

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

The next highest-value slice is now:

1. finish thinning `SelectableTableView` and move remaining derived state into helpers
2. compare `MaterialsInput` against legacy stories for:
   - submit timing
   - wildcard insertion
   - periodic table visibility toggling
   - input mode switching
3. keep documenting and validating `SelectableTable` store-semantic decisions:
   - action-driven callback forwarding
   - max-limit behavior
   - `MULTI_INPUTS_SELECT` downgrade boundary
4. only after that, return to navigation/publication/crystal-toolkit scope work

That gives the best payoff now that SearchUI and the main data-display restoration wave are largely closed out.
