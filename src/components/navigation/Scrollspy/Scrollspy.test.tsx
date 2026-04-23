import { render, screen, waitFor } from '@testing-library/react';
import { Scrollspy } from './Scrollspy';

describe('Scrollspy', () => {
  const menuGroups = [
    {
      label: 'Menu Group 1',
      items: [
        { label: 'Menu Item 1', targetId: 'one' },
        {
          label: 'Menu Item 2',
          targetId: 'two',
          items: [
            { label: 'Sub Menu Item 2.1', targetId: 'two-one' },
            { label: 'Sub Menu Item 2.2', targetId: 'two-two' },
          ],
        },
      ],
    },
  ];

  it('renders nested menu groups and links', () => {
    render(<Scrollspy menuGroups={menuGroups} activeClassName="ms-is-active" />);

    expect(screen.getByText('Menu Group 1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Menu Item 1' })).toHaveAttribute('href', '#one');
    expect(screen.getByRole('link', { name: 'Sub Menu Item 2.1' })).toHaveAttribute('href', '#two-one');
  });

  it('marks the first visible item as active', async () => {
    const originalGetElementById = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const rects: Record<string, { bottom: number }> = {
        one: { bottom: 30 },
        two: { bottom: -50 },
        'two-one': { bottom: -100 },
        'two-two': { bottom: -120 },
      };

      if (rects[id]) {
        return {
          getBoundingClientRect: () => rects[id],
        } as HTMLElement;
      }

      return originalGetElementById(id);
    });

    render(<Scrollspy menuGroups={menuGroups} activeClassName="ms-is-active" />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Menu Item 1' })).toHaveClass('ms-is-active');
    });
  });

  it('marks the last crossed section as active near the end of the page', async () => {
    const originalGetElementById = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const rects: Record<string, { top: number; bottom: number }> = {
        one: { top: -900, bottom: -300 },
        two: { top: -250, bottom: 120 },
        'two-one': { top: 10, bottom: 420 },
        'two-two': { top: 480, bottom: 900 },
      };

      if (rects[id]) {
        return {
          getBoundingClientRect: () => rects[id],
        } as HTMLElement;
      }

      return originalGetElementById(id);
    });

    render(<Scrollspy menuGroups={menuGroups} activeClassName="ms-is-active" />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Sub Menu Item 2.1' })).toHaveClass('ms-is-active');
    });
  });
});
