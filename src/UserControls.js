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

let _body;
let _head;
let _eventSource;
let _rotating = false;

const MoreMath = {
    Sin45: Math.SQRT2 / 2,
    Cos45: Math.SQRT2 / 2,
    Sqrt3: Math.sqrt(3),
    Deg2Rad: Math.PI / 180,
    Rad2Deg: 180 / Math.PI,
};

const Keys = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    C: 67,
    Space: 32
};
const InputState = {
    TranslateDirection: new THREE.Vector3(),
    RotateDirection: new THREE.Vector2()
};
const Config = {
    CanTranslate: true,
    PanSpeed: 7.0,      // Units/s

    LimitDiagonalSpeed: true,

    CanRotate: true,
    MaxRotateSpeed: 60.0,    // Degrees/s
};

export default class UserControls {

    constructor(body, head, eventSource) {
        _body = body;
        _head = head;
        _eventSource = (eventSource !== undefined) ? eventSource : document;

        _eventSource.addEventListener("contextmenu",  onContextMenu, false);
        _eventSource.addEventListener("mousedown",    onMouseDown,   false);
        _eventSource.addEventListener("mouseup",      onMouseUp,     false);
        _eventSource.addEventListener("mousemove",    onMouseMove,   false);
        _eventSource.addEventListener("touchstart",   onTouchStart,  false);
        _eventSource.addEventListener("touchend",     onTouchEnd,    false);
        _eventSource.addEventListener("touchmove",    onTouchMove,   false);
        _eventSource.addEventListener("keydown",      e => handleKey(e.keyCode, true),  false);
        _eventSource.addEventListener("keyup",        e => handleKey(e.keyCode, false), false);
    }

    Update(deltaTime) {
        if (Config.CanTranslate)
            translate(deltaTime);
        if (Config.CanRotate && _rotating)
            rotate(deltaTime);
    }
}

function onContextMenu(e) { }
function onMouseDown(e) { _rotating = true; }
function onMouseUp(e) { _rotating = false; }
function onMouseMove(e) {
    InputState.RotateDirection.x = e.movementX / window.screen.width;
    InputState.RotateDirection.y = e.movementY / window.screen.height;
}
function onTouchStart(e) { }
function onTouchEnd(e) { }
function onTouchMove(e) { }
function handleKey(keyCode, pressed) {
    const dir = InputState.TranslateDirection;
    switch (keyCode) {
        case Keys.S: dir.z += (pressed ? (dir.z <  1 ?  1 : 0) : -1); break;
        case Keys.W: dir.z += (pressed ? (dir.z > -1 ? -1 : 0) :  1); break;

        case Keys.D: dir.x += (pressed ? (dir.x <  1 ?  1 : 0) : -1); break;
        case Keys.A: dir.x += (pressed ? (dir.x > -1 ? -1 : 0) :  1); break;

        case Keys.Space: dir.y += (pressed ? (dir.y <  1 ?  1 : 0) : -1); break;
        case Keys.C:     dir.y += (pressed ? (dir.y > -1 ? -1 : 0) :  1); break;
    }
}
function translate(deltaTime) {
    const unitVelocity = new THREE.Vector3().copy(InputState.TranslateDirection);

    // Scale movement if moving in multiple directions at once, if requested
    if (Config.LimitDiagonalSpeed) {
        const moving = {
            x: unitVelocity.x !== 0,
            y: unitVelocity.y !== 0,
            z: unitVelocity.z !== 0
        };
        if (moving.x && moving.y && moving.z)
            unitVelocity.multiplyScalar(MoreMath.Sqrt3);
        else if (moving.x && moving.y) {
            unitVelocity.x /= MoreMath.Sin45;
            unitVelocity.y /= MoreMath.Sin45;
        }
        else if (moving.x && moving.z) {
            unitVelocity.x /= MoreMath.Sin45;
            unitVelocity.z /= MoreMath.Sin45;
        }
        else if (moving.y && moving.z) {
            unitVelocity.y /= MoreMath.Sin45;
            unitVelocity.z /= MoreMath.Sin45;
        }
    }

    // Apply movement directions * speed to the body position
    const speed = Config.PanSpeed * deltaTime;
    _body.translateOnAxis(unitVelocity, speed);
}
function rotate(deltaTime) {
    // Confusingly, x-movement of cursor should rotate around y-axis, and vice versa
    const speed = Config.MaxRotateSpeed * MoreMath.Deg2Rad;
    _body.rotateY(speed * InputState.RotateDirection.x);
    _head.rotateX(speed * InputState.RotateDirection.y);
}
