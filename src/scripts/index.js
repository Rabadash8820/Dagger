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

import * as THREE from "three";
import CommitGraph from "./CommitGraph";

(function() {

    // Add objects to scene
    const scene = new THREE.Scene();
    const commitGraph = new CommitGraph(scene);

    // Add camera to scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Initialize controls
    const canvas = document;    // TODO: make this a specific canvas element

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Start the render loop
    function update() {
        commitGraph.update();

        renderer.render(scene, camera);

        requestAnimationFrame(update);
    }
    update();

})();