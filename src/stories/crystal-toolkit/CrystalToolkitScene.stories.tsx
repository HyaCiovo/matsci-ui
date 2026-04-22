import type { Meta, StoryObj } from '@storybook/react';
import {
  s2,
  s2 as sceneJson,
  shperes as sceneJson2
} from '../../components/crystal-toolkit/scene/simple-scene';
import { CrystalToolkitScene } from '../../components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene';
import { CameraContextProvider } from '../../components/crystal-toolkit/CameraContextProvider';
import { ScenePosition } from '../../components/crystal-toolkit/scene/inset-helper';
import { AnimationStyle, Renderer } from '../../components/crystal-toolkit/scene/constants';
import { bezierScene } from '../../components/crystal-toolkit/scene/bezier-scene';

const meta = {
  component: CrystalToolkitScene,
  title: 'Crystal Toolkit/CrystalToolkitScene',
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CrystalToolkitScene>;

export default meta;
type Story = StoryObj<typeof meta>;

const STORY_SCENE_SIZE = 720;

export const Basic: Story = {
  args: {
    debug: false,
    animation: AnimationStyle.NONE,
    // axisView: select('Axis position', ['SW', 'SE', 'NW', 'NE', 'HIDDEN'], 'SW'),
    inletPadding: 10,
    inletSize: 100,
    data: sceneJson,
    sceneSize: STORY_SCENE_SIZE,
    toggleVisibility: {},
    settings: {
      renderer: Renderer.WEBGL,
      extractAxis: false,
      // zoomToFit2D: true
    }
  }
};

export const AnimatedScene: Story = {
  args: {
    sceneSize: STORY_SCENE_SIZE,
    animation: AnimationStyle.PLAY,
    settings: {
      staticScene: false,
      renderer: Renderer.WEBGL,
      extractAxis: false,
      isMultiSelectionEnabled: false,
      secondaryObjectView: true,
      // zoomToFit2D: true,
    },
    data: s2,
    debug: false
  }
};

export const LinkedCameras: Story = {
  args: {
    data: sceneJson
  },
  render: () => (
    <CameraContextProvider>
      <>
        <CrystalToolkitScene
          axisView={ScenePosition.HIDDEN}
          sceneSize={400}
          data={sceneJson2}
        />
        <CrystalToolkitScene
          axisView={ScenePosition.HIDDEN}
          sceneSize={400}
          data={sceneJson}
        />
      </>
    </CameraContextProvider>
  )
};

export const TubeScene: Story = {
  args: {
    sceneSize: STORY_SCENE_SIZE,
    animation: AnimationStyle.NONE,
    settings: {
      staticScene: true,
      renderer: Renderer.WEBGL,
      extractAxis: false,
      isMultiSelectionEnabled: false,
      secondaryObjectView: true
    },
    data: bezierScene,
    debug: false
  },
  parameters: {
    docs: {
      description: {
        story: `
  Use the Bezier type to create a tube made of two extruded bezier curves. Each tube
  is divided in two bezier curves. Each curve has three control points, but as the last control
  point of the first is the same as the first control point of the last control, we only have five
  control points for a bezier tube. Similarly, each curve has its own start radius and end radius,
  but as the intermediate radius is shared, the radius only has three elements. Finally, each
  curve has its own color.
`
      }
    }
  }
};
