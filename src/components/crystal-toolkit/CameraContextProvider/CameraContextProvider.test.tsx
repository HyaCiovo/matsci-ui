import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { CameraContext, CameraContextProvider } from './CameraContextProvider';
import { CameraReducerAction } from './camera-reducer';

const TestConsumer = () => {
  const context = useContext(CameraContext);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          context?.dispatch?.({
            type: CameraReducerAction.NEW_POSITION,
            payload: {
              quaternion: new Quaternion(),
              position: new Vector3(1, 2, 3),
              zoom: 2,
              componentId: 'scene-1',
            },
          })
        }
      >
        Update camera
      </button>
      <span>{context?.state?.setByComponentId ?? 'unset'}</span>
    </>
  );
};

describe('CameraContextProvider', () => {
  it('provides camera state updates through context', () => {
    render(
      <CameraContextProvider>
        <TestConsumer />
      </CameraContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Update camera' }));
    return waitFor(() => {
      expect(screen.getByText('scene-1')).toBeInTheDocument();
    });
  });
});
