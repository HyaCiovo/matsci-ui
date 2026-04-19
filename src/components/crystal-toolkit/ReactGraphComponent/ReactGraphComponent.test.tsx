import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { ReactGraphComponent } from './ReactGraphComponent';

const fitSpy = vi.fn();

vi.mock('react-graph-vis', () => ({
  default: ({ getNetwork }: { getNetwork?: (network: unknown) => void }) => {
    useEffect(() => {
      getNetwork?.({ fit: fitSpy });
    }, [getNetwork]);
    return <div data-testid="graph-vis" />;
  },
}));

describe('ReactGraphComponent', () => {
  it('fits the network when graph nodes and edges are provided', () => {
    render(
      <ReactGraphComponent
        graph={{
          nodes: [{ id: 1, label: 'A' }],
          edges: [{ from: 1, to: 1 }],
        }}
      />
    );

    expect(fitSpy).toHaveBeenCalled();
  });
});
