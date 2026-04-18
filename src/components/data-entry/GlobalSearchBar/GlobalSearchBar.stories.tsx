import type { Meta, StoryObj } from '@storybook/react';
import { GlobalSearchBar } from './GlobalSearchBar';

const meta = {
  title: 'Data Entry/GlobalSearchBar',
  component: GlobalSearchBar,
  args: {
    redirectRoute: '/materials',
    placeholder: 'Search by formula, elements, or material ID',
  },
} satisfies Meta<typeof GlobalSearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithoutPeriodicTable: Story = {
  args: {
    hidePeriodicTable: true,
  },
};

export const WithAutocomplete: Story = {
  args: {
    autocompleteFormulaUrl: 'https://api.materialsproject.org/materials/formula_autocomplete/',
  },
};
