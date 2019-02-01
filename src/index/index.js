/*
   Gistory

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
import CommitGraph from "../CommitGraph.js";
import "./index.css";
import UserControls from "../UserControls.js";

(function() {

    // Add objects to scene
    const scene = new THREE.Scene();
    const commitGraph = new CommitGraph(scene);
    commitGraph.AddToScene(scene);

    // Add camera to scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Initialize controls
    const body = new THREE.Object3D();
    body.position.z = 5;
    const head = new THREE.Object3D();
    scene.add(body);
    body.add(head);
    head.add(camera);
    const userControls = new UserControls(body, head);  // eslint-disable-line

    // Initialize renderer
    const canvas = document.getElementById("main-canvas");
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Start the render loop
    let deltaT = 0;
    let time = performance.now();
    function update(timestamp) {
        deltaT = (timestamp - time) / 1000;
        time = timestamp;
        userControls.Update(deltaT);

        renderer.render(scene, camera);

        requestAnimationFrame(update);
    }
    update(performance.now());

})();