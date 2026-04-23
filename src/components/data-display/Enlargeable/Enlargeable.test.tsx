import { fireEvent, render, screen } from '@testing-library/react';
import { Enlargeable } from './Enlargeable';

describe('Enlargeable', () => {
  it('toggles expanded state from the button', () => {
    render(
      <Enlargeable>
        <div>Body</div>
      </Enlargeable>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(document.querySelector('.ms-modal.ms-is-active')).toBeTruthy();

    fireEvent.click(screen.getByRole('button'));
    expect(document.querySelector('.ms-modal.ms-is-active')).toBeFalsy();
  });
});
