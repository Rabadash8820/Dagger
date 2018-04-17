/*
   Gistory, MeshRenderer.js
  
   Copyright April 2, 2018 Dan Vicarel

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

const GLMatrix = require("gl-matrix");
const mat4 = GLMatrix.mat4;

export default class MeshRenderer {

    static draw(gl, mesh, shaderProgram) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is used to simulate the distortion of a perspective camera.
        // FOV is 45 degrees, with a width/height ratio that matches the display size of the canvas
        // Near-clipping and far-clipping planes are at 0.1 and 100 units from the camera, respectively.
        const FIELD_OF_VIEW = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const NEAR_CLIP = 0.1;
        const FAR_CLIP = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, FIELD_OF_VIEW, aspect, NEAR_CLIP, FAR_CLIP);

        // Put the view camera a few units behind the origin (on the Z-axis)
        const viewMatrix = mat4.create();
        mat4.translate(viewMatrix, viewMatrix, [-0.0, 0.0, -6.0]);

        // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next (0 = use type and numComponents above)
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertices);
            gl.vertexAttribPointer(
                shaderProgram.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(shaderProgram.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing
        gl.useProgram(shaderProgram.program);

        // Set the shader uniforms
        gl.uniformMatrix4fv(shaderProgram.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.uniformLocations.viewMatrix, false, viewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

}