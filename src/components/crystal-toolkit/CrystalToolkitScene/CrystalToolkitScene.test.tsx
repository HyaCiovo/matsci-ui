import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CrystalToolkitScene } from './CrystalToolkitScene';
import { s2 as sceneData } from '../scene/simple-scene';
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

describe('CrystalToolkitScene', () => {
  beforeEach(() => {
    vi.mocked(Scene).mockClear();
    Object.values(sceneApi).forEach((spy) => spy.mockClear());
  });

  it('mounts and wires the scene runtime', async () => {
    const { container } = render(
      <CrystalToolkitScene
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
    expect(sceneApi.addToScene).toHaveBeenCalledWith(sceneData, true);
    expect(sceneApi.toggleVisibility).toHaveBeenCalled();
  });

  it('destroys the scene runtime on unmount', async () => {
    const { unmount } = render(
      <CrystalToolkitScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());
    unmount();

    expect(sceneApi.onDestroy).toHaveBeenCalled();
  });

  it('toggles the settings panel when children are provided', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CrystalToolkitScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
      >
        <div>Settings Panel</div>
      </CrystalToolkitScene>
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());

    const settingsButton = container.querySelector('[data-tooltip-id^="settings-"]') as HTMLButtonElement | null;
    expect(settingsButton).not.toBeNull();

    await user.click(settingsButton!);
    expect(container.querySelector('.ms-scene-settings-panel.ms-is-hidden')).toBeNull();

    const closeButton = container.querySelector('.ms-delete') as HTMLButtonElement | null;
    expect(closeButton).not.toBeNull();
    await user.click(closeButton!);

    expect(container.querySelector('.ms-scene-settings-panel.ms-is-hidden')).not.toBeNull();
  });

  it('emits legacy export callbacks through setProps', async () => {
    const user = userEvent.setup();
    const setProps = vi.fn();
    render(
      <CrystalToolkitScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
        setProps={setProps}
        fileOptions={['cif']}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());

    await user.click(document.querySelector('[data-tooltip-id^="export-"] button') as HTMLButtonElement);
    await user.click(await waitFor(async () => await document.body.querySelector('.ms-dropdown-item')) as any);

    expect(setProps).toHaveBeenCalledWith(
      expect.objectContaining({
        fileType: 'cif',
        fileTimestamp: expect.any(Number),
      })
    );
  });

  it('uses custom toolbar tooltip texts when provided', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CrystalToolkitScene
        sceneSize={500}
        settings={{ renderer: Renderer.SVG }}
        data={sceneData}
        debug={false}
        toggleVisibility={{}}
        showImageButton={false}
        showExportButton={false}
        texts={{ enterFullScreen: 'Enter immersive mode' }}
      />
    );

    await waitFor(() => expect(Scene).toHaveBeenCalled());

    const expandButton = container.querySelector('.ms-button') as HTMLButtonElement | null;
    expect(expandButton).not.toBeNull();

    await user.hover(expandButton!);

    expect((await screen.findAllByText('Enter immersive mode')).length).toBeGreaterThan(0);
  });
});
