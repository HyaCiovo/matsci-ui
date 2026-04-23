import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PhononAnimationScene } from './PhononAnimationScene';
import { phonon_scene as sceneData } from '../scene/phonon-animation-scene';
import { AnimationStyle, MOUNT_NODE_CLASS, Renderer } from '../scene/constants';
import Scene from '../scene/Scene';

const sceneApi = vi.hoisted(() => ({
  resizeRendererToDisplaySize: vi.fn(),
  enableDebug: vi.fn(),
  addToScene: vi.fn(),
  toggleVisibility: vi.fn(),
  updateInsetSettings: vi.fn(),
  updateCamera: vi.fn(),
  updateAnimationStyle: vi.fn(),
  updateTime: vi.fn(),
  removeListener: vi.fn(),
  animate: vi.fn(),
  onDestroy: vi.fn(),
}));

vi.mock('use-resize-observer', () => ({
  default: () => ({ width: 500, height: 500 }),
}));

vi.mock('../scene/download-event', () => ({
  subscribe: () => ({ unsubscribe: vi.fn() }),
}));

vi.mock('../../data-entry/RangeSlider', () => ({
  RangeSlider: ({ onChange }: { onChange?: (values: number[]) => void }) => (
    <button type="button" data-testid="mock-range-slider" onClick={() => onChange?.([25])}>
      Mock slider
    </button>
  ),
}));

vi.mock('../scene/Scene', () => ({
  default: vi.fn(function MockScene() {
    return {
      ...sceneApi,
      scene: {},
      renderer: { domElement: document.createElement('canvas') },
    };
  }),
}));

describe('PhononAnimationScene', () => {
  beforeEach(() => {
    vi.mocked(Scene).mockClear();
    Object.values(sceneApi).forEach((spy) => spy.mockClear());
  });

  it('mounts and wires the phonon scene runtime', async () => {
    const { container } = render(
      <PhononAnimationScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());

    expect(container.querySelector(`.${MOUNT_NODE_CLASS}`)).not.toBeNull();
    expect(container.querySelector('.ms-scene-square')).not.toBeNull();
    expect(sceneApi.removeListener).toHaveBeenCalled();
    expect(sceneApi.animate).toHaveBeenCalled();
    expect(sceneApi.addToScene).toHaveBeenCalledWith(sceneData, false);
  });

  it('forwards slider interactions to the scene animation time', async () => {
    const user = userEvent.setup();
    render(
      <PhononAnimationScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
        animation={AnimationStyle.SLIDER}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());
    await user.click(document.querySelector('[data-testid="mock-range-slider"]') as HTMLButtonElement);

    expect(sceneApi.updateTime).toHaveBeenCalledWith(0.25);
  });
});
