import { render, screen } from '@testing-library/react';
import { Formula } from './Formula';

describe('Formula', () => {
  it('renders element tokens as spans and numeric tokens as subscripts', () => {
    render(<Formula>Li4Ti5O12</Formula>);

    expect(screen.getByText('Li').tagName).toBe('SPAN');
    expect(screen.getByText('Ti').tagName).toBe('SPAN');
    expect(screen.getByText('O').tagName).toBe('SPAN');
    expect(screen.getByText('4').tagName).toBe('SUB');
    expect(screen.getByText('5').tagName).toBe('SUB');
    expect(screen.getByText('1').tagName).toBe('SUB');
    expect(screen.getByText('2').tagName).toBe('SUB');
  });

  it('supports decimal and ranged subscripts', () => {
    render(<Formula>LiFexMn2-xO4</Formula>);

    expect(screen.getAllByText('x')).toHaveLength(2);
    expect(screen.getAllByText('x')[0].tagName).toBe('SUB');
    expect(screen.getByText('-').tagName).toBe('SUB');
  });

  it('passes through id and className', () => {
    render(
      <Formula id="formula-id" className="extra-class">
        Y0.95VO4
      </Formula>
    );

    const formula = screen.getByTestId('formula');
    expect(formula).toHaveAttribute('id', 'formula-id');
    expect(formula).toHaveClass('ms-formula', 'extra-class');
  });
});
