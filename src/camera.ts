import { vec3 } from "gl-matrix";

export interface Camera {
  up: vec3;
  position: vec3;
  lookAt: vec3;
}

export const initCamera = (): Camera => {
  return {
    lookAt: [0, 0, 0],
    position: [0, 0, -6],
    up: [0, 1, 0],
  };
};
