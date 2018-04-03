/*
   Dagger, StatusCodes.js

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

"use strict";

// MODULES
require("source-map-support").install();

// 2xx
exports.Success200 = 200;
exports.NoContent204 = 204;

// 4xx
exports.NotAuthenticated401 = 401;
exports.Forbidden403 = 403;
exports.NotFound404 = 404;

// 5xx
exports.InternalServerError500 = 500;
exports.NotImplemented501 = 501;