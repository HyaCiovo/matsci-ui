import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MaterialsInput, type MaterialsInputProps, MaterialsInputType, PeriodicTableMode } from './MaterialsInput';

const meta = {
  component: MaterialsInput,
  title: 'Data Entry/MaterialsInput',
} satisfies Meta<typeof MaterialsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const baseArgs: MaterialsInputProps = {
  periodicTableMode: PeriodicTableMode.TOGGLE,
  showTypeDropdown: true,
  showSubmitButton: true,
  onSubmit: fn(),
};

export const MultiType: Story = {
  args: {
    ...baseArgs,
    allowedInputTypes: [
      MaterialsInputType.CHEMICAL_SYSTEM,
      MaterialsInputType.ELEMENTS,
      MaterialsInputType.FORMULA,
      MaterialsInputType.MPID,
    ],
    type: MaterialsInputType.CHEMICAL_SYSTEM,
    chemicalSystemSelectHelpText:
      'Select elements to search for materials with only these elements',
    elementsSelectHelpText:
      'Select elements to search for materials with at least these elements',
    errorMessage: 'Please enter a valid list of element symbols, chemical formula, or Material ID.',
  },
};

export const Elements: Story = {
  args: {
    ...baseArgs,
    allowedInputTypes: [MaterialsInputType.CHEMICAL_SYSTEM, MaterialsInputType.ELEMENTS],
    errorMessage: 'Please enter a valid list of element symbols separated by a comma or a dash.',
    type: MaterialsInputType.CHEMICAL_SYSTEM,
  },
};

export const ElementsWithHelp: Story = {
  args: {
    ...Elements.args,
    helpItems: [
      {
        label: 'Elements Examples',
      },
      {
        label: null,
        examples: ['Li,Fe', 'Li-Fe', 'Li-Fe-*-*'],
      },
    ],
  },
};

export const ChemicalSystem: Story = {
  args: {
    ...baseArgs,
    allowedInputTypes: [MaterialsInputType.CHEMICAL_SYSTEM],
    errorMessage: 'Please enter a valid chemical system (e.g. Li-Fe-Co).',
    type: MaterialsInputType.CHEMICAL_SYSTEM,
  },
};

export const Formula: Story = {
  args: {
    ...baseArgs,
    allowedInputTypes: [MaterialsInputType.FORMULA],
    errorMessage: 'Please enter a valid chemical formula.',
    type: MaterialsInputType.FORMULA,
  },
};

export const FormulaWithoutPeriodicTable: Story = {
  args: {
    ...Formula.args,
    periodicTableMode: PeriodicTableMode.NONE,
  },
};

export const FormulaWithLabel: Story = {
  args: {
    ...FormulaWithoutPeriodicTable.args,
    label: 'Formula',
  },
};

export const FormulaWithoutSubmit: Story = {
  args: {
    ...FormulaWithLabel.args,
    showSubmitButton: false,
    type: MaterialsInputType.FORMULA,
  },
};

export const FormulaWithAutocomplete: Story = {
  args: {
    ...FormulaWithLabel.args,
    autocompleteFormulaUrl: 'https://api.materialsproject.org/materials/formula_autocomplete/',
  },
};
