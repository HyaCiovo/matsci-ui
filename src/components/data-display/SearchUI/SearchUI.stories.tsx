import type { Meta, StoryObj } from '@storybook/react';
import { PeriodicTableMode } from '../../data-entry/MaterialsInput/MaterialsInput';
import { MatscholarSearchUIContainer, SearchUIContainer } from './SearchUIContainer';
import { SearchUIGrid } from './SearchUIGrid';
import { SearchUISearchBar } from './SearchUISearchBar';
import { ColumnFormat, FilterType, type Column, type FilterGroup } from './types';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: { baseUrl: '/materials' },
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
  },
  {
    title: 'Crystal System',
    selector: 'symmetry.crystal_system',
  },
];

const filterGroups: FilterGroup[] = [
  {
    name: 'Composition',
    expanded: true,
    filters: [
      {
        name: 'Material ID',
        type: FilterType.MATERIALS_INPUT,
        params: ['material_ids'],
        props: {
          type: 'mpid',
          errorMessage: 'Please enter a valid material ID.',
        },
      },
      {
        name: 'Formula',
        type: FilterType.MATERIALS_INPUT,
        params: ['formula'],
        props: {
          type: 'formula',
          errorMessage: 'Please enter a valid formula.',
        },
      },
    ],
  },
  {
    name: 'Symmetry',
    expanded: false,
    filters: [
      {
        name: 'Crystal System',
        type: FilterType.SELECT_CRYSTAL_SYSTEM,
        params: ['crystal_system'],
      },
    ],
  },
];

const matscholarFilterGroups: FilterGroup[] = [
  ...filterGroups,
  {
    name: 'Text Query',
    expanded: false,
    filters: [
      {
        name: 'Free Text',
        type: FilterType.TEXT_INPUT,
        params: ['q'],
        isSearchBarField: true,
        props: {
          placeholder: 'Search text',
          debounce: 0,
        },
      },
    ],
  },
];

const demoResults = [
  {
    material_id: 'mp-149',
    formula_pretty: 'Si',
    symmetry: { crystal_system: 'Cubic' },
  },
  {
    material_id: 'mp-13',
    formula_pretty: 'Fe2O3',
    symmetry: { crystal_system: 'Trigonal' },
  },
];

const searchBarHelpItems = [
  { label: 'Search Examples' },
  { label: 'Include at least elements', examples: ['Li,Fe', 'Si,O,K'] },
  { label: 'Has exact formula', examples: ['Li3Fe', 'Eu2SiCl2O3'] },
  { label: 'Has Material ID', examples: ['mp-149', 'mp-19326'] },
];

const meta = {
  title: 'Search UI/SearchUIContainer',
  component: SearchUIContainer,
} satisfies Meta<typeof SearchUIContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullyFeatured: Story = {
  render: () => (
    <SearchUIContainer
      resultLabel="material"
      columns={columns}
      filterGroups={filterGroups}
      initialResults={demoResults}
      initialTotalResults={2}
      searchOnMount={false}
      autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
    >
      <SearchUISearchBar
        periodicTableMode={PeriodicTableMode.TOGGLE}
        placeholder="Search by elements, formula, or ID"
        errorMessage="Invalid search value"
        allowedInputTypesMap={{
          elements: { field: 'elements' },
          formula: { field: 'formula' },
          mpid: { field: 'material_ids' },
        }}
        helpItems={searchBarHelpItems}
      />
      <SearchUIGrid />
    </SearchUIContainer>
  ),
};

export const MatscholarAlpha: Story = {
  render: () => (
    <MatscholarSearchUIContainer
      resultLabel="material"
      columns={columns}
      filterGroups={matscholarFilterGroups}
      initialResults={demoResults}
      initialTotalResults={2}
      searchOnMount={false}
      apiEndpoint="https://api.materialsproject.org/summary/"
      matscholarEndpoint="https://www.matscholar.com/api/search/materials/"
      autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
    >
      <p className="has-text-centered mb-4">Alpha version of Matscholar search integration with Materials Explorer</p>
      <SearchUISearchBar
        periodicTableMode={PeriodicTableMode.TOGGLE}
        placeholder="Search by elements, formula, material ID, or free text"
        errorMessage="Invalid search value"
        allowedInputTypesMap={{
          elements: { field: 'elements' },
          formula: { field: 'formula' },
          mpid: { field: 'material_ids' },
          text: { field: 'q' },
        }}
        helpItems={searchBarHelpItems}
      />
      <SearchUIGrid />
    </MatscholarSearchUIContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Proof-of-concept story for the Matscholar two-step search flow. Free-text queries are routed through the matscholar endpoint before resolving materials results.',
      },
    },
  },
};
