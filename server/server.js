/*
   Dagger, server.js

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
const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const url = require("url");
const router = require("router");
const finalHandler = require("finalhandler");
const StatusCodes = require("./StatusCodes");
const WWWROOT = __dirname + "/../client";

const ROUTER_OPTS = {
    strict: false,          // Trailing slash is ignored, e.g. /products and /products/ map to same route
    caseSensitive: false    // index.html and iNdEX.HtmL map to same route, e.g.
};
const Router = router(ROUTER_OPTS);

Router.use((request, response, next) => {
    console.log(`Handling ${request.method} ${request.url}`);
    next();
});

Router.get("/",           getIndex);
Router.get("/index",      getIndex);
Router.get("/index.htm",  getIndex);
Router.get("/index.html", getIndex);

Router.get("/site.js", (req, res) => getFile(req, res, req.url));

const Scripts = router(ROUTER_OPTS);
Router.use("/scripts", Scripts);
Scripts.use((req, res) => getFile(req, res, "/scripts" + req.url));

const Shaders = router(ROUTER_OPTS);
Router.use("/shaders", Shaders);
Shaders.use((req, res) => getFile(req, res, "/shaders" + req.url));

// Create the HTTP server with the specified routes
const server = http.createServer((req, res) => Router(req, res, finalHandler(req, res)));
server.on("error", err => {
    console.log(err);

    // If another server was already listening on the provided port, then retry after some time
    if (err.code === "EADDRINUSE") {
        console.log("Address in use, retrying in 1 second...");
        setTimeout(() => {
            server.close();
            server.listen(serverOpts);
        }, 1000);
    }
});

// Tell the HTTP server to start listening for connections!
const serverOpts = {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 1337,
    exclusive: false    // Allow cluster workers to share the same underlying socket handle
};
server.listen(serverOpts);

function getIndex(req, res) {
    getFile(req, res, "/index.html");
}

function getFile(request, response, fileUrl) {
    // Normalize the URL path (so people can't access parent directories of the root directory)
    const reqUrl = url.parse(fileUrl);
    const filePath = path.normalize(WWWROOT + reqUrl.pathname);

    console.log(`Fetching file ${filePath}`);

    response.statusCode = 200;
    response.setHeader("Content-Type", mime.contentType(path.extname(filePath)));

    const bodyStream = fs.createReadStream(filePath);
    bodyStream.on("open", () => bodyStream.pipe(response));
    bodyStream.on("end", () => {
        console.log("Fetch complete!");
        response.end();
    });
    bodyStream.on("error", err => {
        // Assume the file doesn't exist
        console.error(`Failed to fetch ${filePath}.  More info:`);
        console.error(err);
        response.statusCode = StatusCodes.NotFound404;
        response.end();
    });
}