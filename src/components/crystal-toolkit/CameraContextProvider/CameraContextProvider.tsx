import * as React from 'react';
import { type Dispatch, useMemo, useReducer } from 'react';
import {
  type Action,
  type CameraActionPayload,
  CameraReducerAction,
  cameraReducer,
  type CameraState,
  initialState,
} from './camera-reducer';

export interface ICameraContext {
  state: CameraState | null;
  dispatch: Dispatch<Action<CameraReducerAction, CameraActionPayload>> | null;
}

export const CameraContext = React.createContext<ICameraContext | null>(null);

export function CameraContextProvider(props: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(cameraReducer, initialState);
  const store = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <CameraContext.Provider value={store}>{props.children}</CameraContext.Provider>;
}
