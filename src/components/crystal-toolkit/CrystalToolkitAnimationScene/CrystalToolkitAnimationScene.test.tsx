import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CrystalToolkitAnimationScene } from './CrystalToolkitAnimationScene';
import { phonon_scene as sceneData } from '../scene/phonon-animation-scene';
import { MOUNT_NODE_CLASS, Renderer } from '../scene/constants';
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

vi.mock('../scene/Scene', () => ({
  default: vi.fn(function MockScene() {
    return {
      ...sceneApi,
      scene: {},
      renderer: { domElement: document.createElement('canvas') },
    };
  }),
}));

describe('CrystalToolkitAnimationScene', () => {
  beforeEach(() => {
    vi.mocked(Scene).mockClear();
    Object.values(sceneApi).forEach((spy) => spy.mockClear());
  });

  it('mounts and starts the animation runtime', async () => {
    const { container } = render(
      <CrystalToolkitAnimationScene
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

  it('emits legacy export callbacks through setProps', async () => {
    const user = userEvent.setup();
    const setProps = vi.fn();
    render(
      <CrystalToolkitAnimationScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
        setProps={setProps}
        fileOptions={['poscar']}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());

    await user.click(document.querySelector('[data-tooltip-id^="export-"] button') as HTMLButtonElement);
    await user.click(await screen.findByText('poscar'));

    expect(setProps).toHaveBeenCalledWith(
      expect.objectContaining({
        fileType: 'poscar',
        fileTimestamp: expect.any(Number),
      })
    );
  });

  it('uses custom toolbar tooltip texts when provided', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CrystalToolkitAnimationScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
        showImageButton={false}
        showExportButton={false}
        texts={{ enterFullScreen: 'Enter animation full screen' }}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());

    const expandButton = container.querySelector('.ms-button') as HTMLButtonElement | null;
    expect(expandButton).not.toBeNull();

    await user.hover(expandButton!);

    expect((await screen.findAllByText('Enter animation full screen')).length).toBeGreaterThan(0);
  });
});
