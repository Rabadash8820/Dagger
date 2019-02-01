/*
   Gistory

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

import * as THREE from "three";
// import * as Git from "nodegit";

export default class CommitGraph {

    constructor() { }

    AddToScene(scene) {
        const cubeMesh = new THREE.BoxGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        [
            0,
            2,
            4,
            6,
            8
        ].forEach(coord => {
            const mesh = new THREE.Mesh(cubeMesh, cubeMat);
            scene.add(mesh);
            mesh.position.x = coord;
            mesh.position.z = -5;
        });
    }

}