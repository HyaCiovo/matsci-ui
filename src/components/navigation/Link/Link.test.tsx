import { fireEvent, render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pushes history for in-app navigation without refresh', () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent');

    render(<Link href="/materials">Materials</Link>);
    fireEvent.click(screen.getByRole('link', { name: 'Materials' }));

    expect(pushState).toHaveBeenCalledWith({}, '', '/materials');
    expect(dispatchEvent).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('preserves the current query string when requested', () => {
    window.history.pushState({}, '', '/current?foo=bar');
    render(
      <Link href="/next" preserveQuery>
        Next
      </Link>
    );

    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/next?foo=bar');
  });

  it('does not intercept links with modifier keys', () => {
    const pushState = vi.spyOn(window.history, 'pushState');

    render(<Link href="#materials">Materials</Link>);
    fireEvent.click(screen.getByRole('link', { name: 'Materials' }), { metaKey: true });

    expect(pushState).not.toHaveBeenCalled();
  });
});
