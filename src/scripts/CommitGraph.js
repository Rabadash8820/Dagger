/*
   Gistory, GraphGenerator.js

   Copyright October 25, 2018 Dan Vicarel

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

let _scene;
let _generated;

let _cube;

export default class CommitGraph {

    constructor(scene) {
        _scene = scene;

        _generated = false;
    }

    update() {
        if (!_generated) {
            this.generate();
            _generated = true;
        }

        _cube.rotation.x += 0.01;
        _cube.rotation.y += 0.01;
    }

    generate() {
        const cubeMesh = new THREE.BoxGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        _cube = new THREE.Mesh(cubeMesh, cubeMat);

        _scene.add(_cube);
    }

}