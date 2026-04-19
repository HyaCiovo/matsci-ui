import { fireEvent, render, screen } from '@testing-library/react';
import { DISPLAY_MODE, StandalonePeriodicComponent } from './StandalonePeriodicComponent';

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

    expect(document.querySelector('.mp-element-wrapper')).toBeTruthy();
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

  it('renders detailed mode panels for regular elements', () => {
    const { container } = render(
      <StandalonePeriodicComponent
        size={64}
        element="H"
        displayMode={DISPLAY_MODE.DETAILED}
        disabled={false}
        enabled={false}
        hidden={false}
      />
    );

    expect(container.querySelector('.main-panel')).toBeInTheDocument();
    expect(container.querySelector('.mat-side-panel')).toBeInTheDocument();
  });

  it('returns an empty placeholder when an unknown element symbol is provided', () => {
    const { container } = render(
      <StandalonePeriodicComponent
        size={32}
        element="not-an-element"
        disabled={false}
        enabled={false}
        hidden={false}
      />
    );

    expect(container.querySelector('.mat-element')).not.toBeInTheDocument();
  });
});
