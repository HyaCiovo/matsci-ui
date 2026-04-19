import { render, screen } from '@testing-library/react';
import { DataCard } from './DataCard';

describe('DataCard', () => {
  it('renders hierarchical data fields', () => {
    render(
      <DataCard
        data={{
          title: 'LiFePO4',
          subtitle: 'Olive cathode',
          density: '3.6',
          crystal_system: 'Orthorhombic',
        }}
        levelOneKey="title"
        levelTwoKey="subtitle"
        levelThreeKeys={[
          { key: 'density', label: 'Density' },
          { key: 'crystal_system', label: 'Crystal System' },
        ]}
      />
    );

    expect(screen.getByText('LiFePO4')).toBeInTheDocument();
    expect(screen.getByText('Olive cathode')).toBeInTheDocument();
    expect(screen.getByText('Density')).toBeInTheDocument();
    expect(screen.getByText('Orthorhombic')).toBeInTheDocument();
  });
});
