import type { Meta, StoryObj } from '@storybook/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIFilters } from './SearchUIFilters';
import { FilterType, type FilterGroup } from '../types';

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
    name: 'Thermodynamics',
    expanded: false,
    filters: [
      {
        name: 'Is Stable',
        type: FilterType.THREE_STATE_BOOLEAN_SELECT,
        params: ['is_stable'],
        props: {
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
      },
      {
        name: 'Energy Above Hull',
        type: FilterType.SLIDER,
        params: ['energy_above_hull_min', 'energy_above_hull_max'],
        units: 'eV/atom',
        props: {
          domain: [0, 1],
          step: 0.01,
        },
      },
    ],
  },
  {
    name: 'Calculated Properties',
    expanded: false,
    filters: [
      {
        name: 'Available Properties',
        type: FilterType.CHECKBOX_LIST,
        params: ['has_props'],
        props: {
          options: [
            { label: 'Density of States', value: 'dos' },
            { label: 'Band Structure', value: 'bandstructure' },
          ],
        },
      },
    ],
  },
];

const meta = {
  title: 'Search UI/SearchUIFilters',
  component: SearchUIFilters,
} satisfies Meta<typeof SearchUIFilters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ _sort_fields: ['material_id'] }}>
      <SearchUIFilters />
    </SearchUIContainer>
  ),
};
