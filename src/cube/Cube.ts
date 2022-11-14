import { vec3 } from "gl-matrix";

export class Cube {
    constructor(
        public position: vec3,
        public rotationAxis: vec3,
        public rotationAngle: number
    ) { }

    public update(deltaTime: number) {
        this.rotationAngle += deltaTime;
    }

    public draw(gl: WebGL2RenderingContext) {

    }
}