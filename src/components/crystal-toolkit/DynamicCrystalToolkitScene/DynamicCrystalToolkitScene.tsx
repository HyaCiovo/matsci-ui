import React, { useRef, useState } from 'react';
import { CrystalToolkitScene } from '../CrystalToolkitScene';
import { AnimationStyle } from '../scene/constants';

export interface DynamicCrystalToolkitSceneProps {
  showButtonText?: string;
  removeButtonText?: string;
}

export const DynamicCrystalToolkitScene: React.FC<DynamicCrystalToolkitSceneProps> = ({
  showButtonText = 'show',
  removeButtonText = 'remove',
}) => {
  const [sceneData, setSceneData] = useState<object | null>(null);
  const [showScene, setShowScene] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emptyObject = {};

  function show() {
    if (inputRef.current) {
      const cleanJsonString = inputRef.current.value.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
      const cleanerJsonString = cleanJsonString.replace("'", '"');
      setSceneData(JSON.parse(cleanerJsonString));
    } else {
      setSceneData(null);
    }
    setShowScene(true);
  }

  function remove() {
    setSceneData(null);
    setShowScene(false);
  }

  return (
    <div>
      <textarea ref={inputRef}></textarea>
      <button onClick={show}>{showButtonText}</button>
      <button onClick={remove}>{removeButtonText}</button>
      {showScene && sceneData ? (
        <CrystalToolkitScene
          debug={false}
          animation={AnimationStyle.NONE}
          inletPadding={10}
          inletSize={100}
          data={sceneData}
          sceneSize={400}
          toggleVisibility={emptyObject}
        />
      ) : null}
    </div>
  );
};
