module.exports = {
    entry: {
        index: "./dist/scripts/index.js"
    },
    externals: {
        THREE: "three"
    },
    output: {
        path: __dirname + "/dist/bundles/",
        filename: "[name].js"
    }
};