/*
   Dagger, gulpfile.js
  
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

/// <binding BeforeBuild='build' Clean='clean' />
"use strict";

// MODULES
const Gulp = require("gulp");
const Stream = require('stream');
const NoOp = require("through2").obj;
const Env = require("minimist")(process.argv.slice(2));
//const Print = require("gulp-print").default;
const Tasks = require("gulp-task-listing");
const Pump = require("pump");
const Merge = require("merge-stream");

const RmRF = require("gulp-rimraf");
const Rename = require("gulp-rename");
const SourceMaps = require("gulp-sourcemaps");
const Concat = require("gulp-concat");

const ESLint = require("gulp-eslint");
const Babel = require("gulp-babel");

const CSSMin = require("gulp-cssmin");

// PATHS
const wwwroot = "./";
const src = wwwroot;
const tmp = wwwroot + "tmp/";
const dest = wwwroot + "dist/";
const maps = "maps/";

const js = "./";
const srcJS = src + js;
const tmpJS = tmp + js;
const destJS = dest + js;

const css = "css/";
const srcCSS = src + css;
const tmpCSS = tmp + css;
const destCSS = dest + css;

// DEFAULT TASK
Gulp.task("default", Tasks.withFilters(null, "default"));

// MAIN TASKS
Gulp.task("build", ["post:scripts", "post:css"], () =>
    Gulp.src(tmp).pipe(RmRF())    // Remove the temp folder after everything's converted
);
Gulp.task("clean", () => Gulp.src([dest, tmp]).pipe(RmRF()));

// JAVASCRIPT TASKS
Gulp.task("post:scripts", ["convert:scripts"], () => {
    Gulp.src(tmpJS).pipe(RmRF());
});
Gulp.task("convert:scripts", ["pre:scripts"], cb => {
    const srcGlob = [].map(path => srcJS + path + ".js");
    let srcStream = Gulp.src(srcGlob, { base: srcJS }).pipe(Gulp.dest(tmpJS));
    let destStream = Gulp.dest(destJS);
    convertScripts(srcStream, destStream, {
        lint: true,
        transpile: true,
        minify: true,
        concatName: null
    }, cb);
});
Gulp.task("pre:scripts", () => Gulp.src(destJS).pipe(RmRF()));

// CSS TASKS
Gulp.task("post:css", ["convert:css"], () => {
    Gulp.src(tmpCSS).pipe(RmRF());
});
Gulp.task("convert:css", ["pre:css"], () => {
    // Convert CSS files in separate streams
    // Wait for all of these streams by merging them
    return Merge(
        convertCSS("site")
    );

    // Stream source CSS files into the temp directory and transform them
    // Pipe them to the distribution directory, concatenating (if requested) and renaming them in the process
    // Create source maps if we are in the Development environment
    function convertCSS(glob, concatName) {
        glob = Array.isArray(glob) ? glob.map(path => srcCSS + path + ".css") : srcCSS + glob + ".css";
        return Pump([
            Gulp.src(glob, { base: srcCSS }),
            Gulp.dest(tmpCSS),
            isDev() ? SourceMaps.init() : NoOp(),
            concatName ? Concat(concatName) : NoOp(),   // yeah, yeah, we're using a truthy value...
            CSSMin(),   // minify
            Rename(path => path.extname = ".min.css"),
            isDev() ? SourceMaps.write(maps, { mapFile: path => path.replace(".css.map", ".map") }) : NoOp(),
            Gulp.dest(destCSS)
        ]);
    }
});
Gulp.task("pre:css", () => Gulp.src(destCSS).pipe(RmRF()));

// HELPERS
function isDev() {
    return (Env.configuration === "debug" || Env.configuration === undefined) ? true : false;
}

// Stream source JS files into the temp directory and transform them
// Pipe them to the distribution directory, concatenating (if requested) and renaming them in the process
// Create source maps if we are in the Development environment
function convertScripts(srcStream, destStream, options, cb) {
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
        isDev() ? SourceMaps.write(maps, { mapFile: path => path.replace(".js.map", ".map") }) : NoOp(),
        destStream
    ], cb);
}
