/// <binding BeforeBuild='build' Clean='clean' />
/*
   Gistory, gulpfile.js
  
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
const Gulp = require("gulp");
const NoOp = require("through2").obj;
const Env = require("minimist")(process.argv.slice(2));
const Print = require("gulp-print").default;
const Tasks = require("gulp-task-listing");
const Pump = require("pump");
const Merge = require("merge-stream");

const RmRF = require("gulp-rimraf");
const Rename = require("gulp-rename");
const SourceMaps = require("gulp-sourcemaps");
const Concat = require("gulp-concat");

const ESLint = require("gulp-eslint");
const Babel = require("gulp-babel");

const CSSLint = require("gulp-csslint");
const CSSMin = require("gulp-cssmin");

// PATHS
const src = ".";
const dest = "dist";
const maps = "maps/";

const serverRoot = "/server";
const serverSrc  = src  + serverRoot;

const clientSrc  = src  + "/client";
const clientDest = dest + "/wwwroot";

const scripts = "/scripts";
const pages = "/pages";
const styles = "/styles";

// MAIN TASKS
Gulp.task("default", Tasks.withFilters(null, "default"));
Gulp.task("build", ["server:transform", "client:transform"]);
Gulp.task("clean", () => clean([
    `${dest}/*`,
    `!${clientDest}`
]));
Gulp.task("server",  ["server:transform"]);
Gulp.task("client",  ["client:transform"        ]);
Gulp.task("scripts", ["scripts:client:transform"]);
Gulp.task("pages",   ["pages:transform"         ]);
Gulp.task("styles",  ["styles:transform"        ]);

// SERVER-SIDE SCRIPT TASKS
Gulp.task("server:pre", () => clean([
    `${dest}/*`,
    `!${clientDest}`
]));
Gulp.task("server:transform", ["server:pre"], cb => {
    const srcGlob = serverSrc + "**/*.js";
    let srcStream = Gulp.src(srcGlob, { base: serverSrc });
    let destStream = Gulp.dest(dest);
    transformScripts(srcStream, destStream, {
        lint: true,
        transpile: true,
        minify: false,
        concatName: null
    }, cb);
});

// CLIENT-SIDE TASKS
Gulp.task("client:pre", () => clean([
    `${clientDest}/*`
]));
Gulp.task("client:transform", ["scripts:client:transform", "pages:transform", "styles:transform"]);
Gulp.task("scripts:client:transform", ["client:pre"], cb => {
    const srcGlob = clientSrc + scripts + "/**/*.js";
    let srcStream = Gulp.src(srcGlob, { base: clientSrc });
    let destStream = Gulp.dest(clientDest);
    transformScripts(srcStream, destStream, {
        lint: true,
        transpile: true,
        minify: true,
        concatName: null
    }, cb);
});
Gulp.task("pages:transform", ["client:pre"], cb => {
    const srcGlob = [
        clientSrc + "/index.html",
        clientSrc + pages + "/**/*.html"
    ];
    Pump([
        Gulp.src(srcGlob, { base: clientSrc }),
        Gulp.dest(clientDest)
    ], cb);
});
Gulp.task("styles:transform", ["client:pre"], cb => {
    const srcGlob = clientSrc + styles + "/**/*.css";
    let srcStream = Gulp.src(srcGlob, { base: clientSrc });
    let destStream = Gulp.dest(clientDest);
    transformStyles(srcStream, destStream, {
        lint: true,
        minify: true,
        concatName: null
    }, cb);
});

// HELPERS
function isDev() {
    return (Env.configuration === "debug" || Env.configuration === undefined) ? true : false;
}

function clean(glob) {
    return Gulp.src(glob).pipe(RmRF());;
}

// Stream source scripts into the temp directory and transform them
// Pipe them to the distribution directory, concatenating (if requested) and renaming them in the process
// Create source maps if we are in the Development environment
function transformScripts(srcStream, destStream, options, cb) {
    options = options || {};
    return Pump([
        srcStream,
        isDev() ? SourceMaps.init() : NoOp(),
        options.lint ? ESLint({ fix: false }) : NoOp(),     // lint
        options.lint ? ESLint.format() : NoOp(),
        options.lint ? ESLint.failAfterError() : NoOp(),
        options.concatName ? Concat(concatName) : NoOp(),   // bundle
        options.transpile ? Babel() : NoOp(),               // transpile / minify
        options.minify ? Rename(path => path.extname = ".min.js") : NoOp(),
        isDev() ? SourceMaps.write(maps) : NoOp(),
        destStream
    ], cb);
}

// Stream source stylesheets into the temp directory and transform them
// Pipe them to the distribution directory, concatenating (if requested) and renaming them in the process
// Create source maps if we are in the Development environment
function transformStyles(srcStream, destStream, options, cb) {
    options = options || {};
    return Pump([
        srcStream,
        isDev() ? SourceMaps.init() : NoOp(),
        options.lint ? CSSLint() : NoOp(),                  // lint
        options.lint ? CSSLint.formatter() : NoOp(),
        options.concatName ? Concat(concatName) : NoOp(),   // bundle
        options.minify ? CSSMin() : NoOp(),                 // minify
        options.minify ? Rename(path => path.extname = ".min.css") : NoOp(),
        isDev() ? SourceMaps.write(maps) : NoOp(),
        destStream
    ], cb);
}
