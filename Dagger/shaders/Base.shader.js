/*
   Dagger, Base.shader.js
  
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

export default class BaseShader {

    constructor(gl, vertexSource, fragmentSource) {

        // Create the shader program
        const prog = gl.createProgram();

        // Attach shaders
        const vertShad = loadShader(gl, gl.VERTEX_SHADER,   vertexSource);
        const fragShad = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        gl.attachShader(prog, vertShad);
        gl.attachShader(prog, fragShad);

        // Link this shader program to the WebGL context
        // If this fails, then show an alert
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(prog));
            return null;
        }

        this.program = prog;
    }

}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}