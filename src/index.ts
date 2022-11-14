import { mat4 } from "gl-matrix";

import vertexShader from "./vertex_shader.glsl";
import fragmentShader from "./fragment_shader.glsl";
import { ProgramInfo } from "./ProgramInfo";
import { Camera, initCamera } from "./camera";
import { initShaderProgram } from "./shader";
import { CubeBuffers, drawCube, initBuffers } from "./cube";

var cubeRotation = 0.0;

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#glcanvas");
  const gl = canvas.getContext("webgl2");

  // If we don't have a GL context, give up now

  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo: ProgramInfo = {
    program: shaderProgram,
    attributeLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
      viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);
  const camera = initCamera();

  var then = 0;

  // Draw the scene repeatedly
  function render(now: number) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, camera);
    update(deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(
  gl: WebGL2RenderingContext,
  programInfo: ProgramInfo,
  buffers: CubeBuffers,
  camera: Camera
) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, camera.position, camera.lookAt, camera.up);

  const modelMatrix = mat4.create();

  mat4.rotate(
    modelMatrix, // destination matrix
    modelMatrix, // matrix to rotate
    cubeRotation * 2, // amount to rotate in radians
    [1, 1, 0] // axis to rotate around
  );

  drawCube(gl, buffers, programInfo, projectionMatrix, viewMatrix, modelMatrix);
}

function update(deltaTime: number) {
  // Update the rotation for the next draw
  cubeRotation += deltaTime;
}
