/*
   Dagger, Mesh.js
  
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

export default class Mesh {

    constructor(gl, vertices) {

        // Create a buffer for the square's vertices
        const vertBuffer = gl.createBuffer();

        // Select the vertex buffer as the one to apply buffer operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);

        // Now pass the list of vertices into WebGL to build the shape.
        // We do this by creating a Float32Array from the JavaScript array, then use it to fill the current buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.vertices = vertBuffer;
    }

}