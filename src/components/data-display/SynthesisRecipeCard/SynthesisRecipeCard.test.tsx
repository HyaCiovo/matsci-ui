import { fireEvent, render, screen } from '@testing-library/react';
import { SynthesisRecipeCard } from './SynthesisRecipeCard';

const recipe = {
  doi: '10.1000/example-1',
  target: {
    material_formula: 'LiFePO4',
    composition: [{ elements: { Li: 1, Fe: 1, P: 1, O: 4 } }],
  },
  precursors_formula_s: ['Li2CO3', 'FeC2O4', 'NH4H2PO4'],
  precursors: [
    { material_formula: 'Li2CO3', composition: [{ elements: { Li: 2, C: 1, O: 3 } }] },
    { material_formula: 'FeC2O4', composition: [{ elements: { Fe: 1, C: 2, O: 4 } }] },
    { material_formula: 'NH4H2PO4', composition: [{ elements: { N: 1, H: 6, P: 1, O: 4 } }] },
  ],
  synthesis_type: 'Solid-state',
  paragraph_string: 'The precursors were mixed and heated to obtain LiFePO4.',
  reaction_string: 'Li2CO3 FeC2O4 NH4H2PO4 == LiFePO4 ; 700 C ; 12 h',
  operations: [
    {
      token: 'calcined',
      conditions: {
        heating_temperature: [{ min_value: 700, max_value: null, units: 'C' }],
        heating_time: [{ min_value: 12, max_value: null, units: 'h' }],
        heating_atmosphere: ['Ar'],
      },
    },
  ],
};

describe('SynthesisRecipeCard', () => {
  it('renders recipe-specific content and expandable details', () => {
    render(<SynthesisRecipeCard data={recipe} />);

    expect(screen.getByRole('link', { name: /Li Fe P O 4/i })).toBeInTheDocument();
    expect(screen.getByText('Precursor Materials')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '10.1000/example-1' })).toBeInTheDocument();

    fireEvent.click(screen.getByText('See more'));
    expect(screen.getByText('Paragraph Excerpt')).toBeInTheDocument();
    expect(screen.getByText(/The precursors were mixed and heated/)).toBeInTheDocument();
    expect(screen.getByText('Synthesis Type')).toBeInTheDocument();
    expect(screen.getByText('Solid-state')).toBeInTheDocument();
  });
});
