import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { MaterialsInput, MaterialsInputProps } from '../../components/data-entry/MaterialsInput';
import {
  MaterialsInputType,
  PeriodicTableMode
} from '../../components/data-entry/MaterialsInput/MaterialsInput';

const meta = {
  component: MaterialsInput,
  title: 'Data-Entry/MaterialsInput'
} satisfies Meta<typeof MaterialsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiType: Story = {
  args: {
    periodicTableMode: 'toggle' as PeriodicTableMode,
    allowedInputTypes: [
      'chemical_system' as MaterialsInputType,
      'elements' as MaterialsInputType,
      'formula' as MaterialsInputType,
      'mpid' as MaterialsInputType
    ],
    type: 'chemical_system' as MaterialsInputType,
    chemicalSystemSelectHelpText:
      'Select elements to search for materials with only these elements',
    elementsSelectHelpText:
      'Select elements to search for materials with at least these elements',
    errorMessage: 'Please enter a valid list of element symbols, chemical formula, or Material ID.',
    onChange: fn(),
    onInputTypeChange: fn(),
    onPropsChange: fn(),
    showSubmitButton: true,
    onSubmit: fn()
  }
};

export const Elements: Story = {
  args: {
    ...MultiType.args,
    allowedInputTypes: ['chemical_system' as MaterialsInputType, 'elements' as MaterialsInputType],
    errorMessage: 'Please enter a valid list of element symbols separated by a comma or a dash.',
    type: 'chemical_system' as MaterialsInputType
  }
};

export const ElementsWithHelp: Story = {
  args: {
    ...Elements.args,
    helpItems: [
      {
        label: 'Elements Examples'
      },
      {
        label: null,
        examples: ['Li,Fe', 'Li-Fe', 'Li-Fe-*-*']
      }
    ]
  }
};

export const ChemicalSystem: Story = {
  args: {
    ...MultiType.args,
    allowedInputTypes: ['chemical_system' as MaterialsInputType],
    errorMessage: 'Please enter a valid chemical system (e.g. Li-Fe-Co).',
    type: 'chemical_system' as MaterialsInputType
  }
};

export const Formula: Story = {
  args: {
    ...MultiType.args,
    allowedInputTypes: ['formula' as MaterialsInputType],
    errorMessage: 'Please enter a valid chemical formula.',
    type: 'formula' as MaterialsInputType
  }
};

export const FormulaWithoutPeriodicTable: Story = {
  args: {
    ...Formula.args,
    periodicTableMode: 'none' as PeriodicTableMode
  }
};

export const FormulaWithLabel: Story = {
  args: {
    ...FormulaWithoutPeriodicTable.args,
    label: 'Formula'
  }
};

export const FormulaWithoutSubmit: Story = {
  args: {
    ...FormulaWithLabel.args,
    showSubmitButton: false,
    onSubmit: undefined,
    type: 'formula' as MaterialsInputType
  }
};

export const FormulaWithAutocomplete: Story = {
  args: {
    ...FormulaWithLabel.args,
    autocompleteFormulaUrl: 'https://api.materialsproject.org/materials/formula_autocomplete/'
  }
};
