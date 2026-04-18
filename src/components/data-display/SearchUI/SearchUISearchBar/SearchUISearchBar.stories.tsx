import type { Meta, StoryObj } from '@storybook/react';
import { PeriodicTableMode } from '../../../data-entry/MaterialsInput/MaterialsInput';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUISearchBar } from './SearchUISearchBar';

const SearchUISummary = () => {
  const { query, totalResults, loading, error } = useSearchUIContext();

  return (
    <div className="box mt-4">
      <div>
        <strong>Loading:</strong> {String(loading)}
      </div>
      <div>
        <strong>Total Results:</strong> {totalResults}
      </div>
      <div>
        <strong>Error:</strong> {error ?? 'None'}
      </div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(query, null, 2)}</pre>
    </div>
  );
};

const meta = {
  title: 'Search UI/SearchUISearchBar',
  component: SearchUISearchBar,
} satisfies Meta<typeof SearchUISearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    allowedInputTypesMap: {
      elements: { field: 'elements' },
      formula: { field: 'formula' },
      mpid: { field: 'material_ids' },
    },
  },
  render: () => (
    <SearchUIContainer
      apiEndpoint="https://api.materialsproject.org/materials/search"
      autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
    >
      <SearchUISearchBar
        periodicTableMode={PeriodicTableMode.TOGGLE}
        placeholder="Search by elements, formula, or ID"
        errorMessage="Invalid search value"
        allowedInputTypesMap={Basic.args?.allowedInputTypesMap ?? {}}
        helpItems={[
          { label: 'Search Examples' },
          { label: 'Include at least elements', examples: ['Li,Fe', 'Si,O,K'] },
          { label: 'Has exact formula', examples: ['Li3Fe', 'Eu2SiCl2O3'] },
          { label: 'Has Material ID', examples: ['mp-149', 'mp-19326'] },
        ]}
      />
      <SearchUISummary />
    </SearchUIContainer>
  ),
};
