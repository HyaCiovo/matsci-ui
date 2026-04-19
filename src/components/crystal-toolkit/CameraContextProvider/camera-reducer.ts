import { Quaternion, Vector3 } from 'three';

export interface Action<T, P> {
  type: T;
  payload: P;
}

export interface CameraState {
  quaternion?: Quaternion;
  position?: Vector3;
  zoom?: number;
  setByComponentId?: string;
  following?: boolean;
}

export interface CameraActionPayload {
  quaternion?: Quaternion;
  position?: Vector3;
  zoom?: number;
  componentId?: string;
  following?: boolean;
}

export enum CameraReducerAction {
  NEW_POSITION = 'follow_camera',
  STOP_FOLLOWING = 'stop_following',
  START_FOLLOWING = 'start_following',
}

export const initialState: CameraState = {
  following: true,
};

export function cameraReducer(
  state: CameraState,
  { type, payload }: Action<CameraReducerAction, CameraActionPayload>
): CameraState {
  switch (type) {
    case CameraReducerAction.NEW_POSITION:
      return {
        quaternion: payload.quaternion?.clone(),
        position: payload.position?.clone(),
        zoom: payload.zoom,
        setByComponentId: payload.componentId,
        following: state.following,
      };
    case CameraReducerAction.STOP_FOLLOWING:
      return { ...state, following: false };
    case CameraReducerAction.START_FOLLOWING:
      return { ...state, following: true };
    default:
      return state;
  }
}
