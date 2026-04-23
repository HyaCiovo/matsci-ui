import { fireEvent, render, screen } from '@testing-library/react';
import { StandalonePeriodicComponent } from './StandalonePeriodicComponent';

describe('StandalonePeriodicComponent', () => {
  it('renders a periodic element with the wrapper', () => {
    render(
      <StandalonePeriodicComponent
        size={32}
        element="H"
        disabled={false}
        enabled={false}
        hidden={false}
      />
    );

    expect(document.querySelector('.ms-element-wrapper')).toBeTruthy();
    expect(screen.getByText('H')).toBeInTheDocument();
  });

  it('fires click and hover callbacks', () => {
    const handleClick = vi.fn();
    const handleHover = vi.fn();
    const handleLeave = vi.fn();

    render(
      <StandalonePeriodicComponent
        size={32}
        element="He"
        disabled={false}
        enabled={false}
        hidden={false}
        onElementClicked={handleClick}
        onElementMouseOver={handleHover}
        onElementMouseLeave={handleLeave}
      />
    );

    fireEvent.mouseOver(screen.getByRole('button'));
    expect(handleHover).toHaveBeenCalledWith(expect.objectContaining({ symbol: 'He' }));

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ symbol: 'He' }));

    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(handleLeave).toHaveBeenCalledWith(expect.objectContaining({ symbol: 'He' }));
  });
});

