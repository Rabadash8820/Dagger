/*
   Gistory, index.js

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

import SquareShader from "./shaders/square.shader.min.js";
import SquareMesh from "./meshes/SquareMesh.min.js";
import MeshRenderer from "./MeshRenderer.min.js";

(function() {

    main();

    function main() {
        // Initialize the WebGL context
        // Only continue if it is available and working
        const canvas = document.getElementById("glCanvas");
        const gl = canvas.getContext("webgl");
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        const squareShader = new SquareShader(gl);
        const squareMesh = new SquareMesh(gl);
        MeshRenderer.draw(gl, squareShader.program, squareMesh);
    }

})();

