import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThreeStateBooleanSelect } from './ThreeStateBooleanSelect';

describe('ThreeStateBooleanSelect', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      configurable: true,
      value: () => false,
    });
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      configurable: true,
      value: () => undefined,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: () => undefined,
    });
  });

  it('returns null when selecting Any', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ThreeStateBooleanSelect
        value={true}
        onChange={onChange}
        options={[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ]}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('Any'));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
