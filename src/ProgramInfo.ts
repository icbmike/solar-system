export interface ProgramInfo {
  program: WebGLProgram;
  attributeLocations: { vertexPosition: number; vertexColor: number };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelMatrix: WebGLUniformLocation;
    viewMatrix: WebGLUniformLocation;
  };
}
