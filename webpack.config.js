const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const eslintrc = require("./.eslintrc.js");
const babelrc  = require("./.babelrc.js");

module.exports = (env, argv) => {
    const devMode = argv.mode === "development";

    return {
        entry: {
            index: "./src/index/index.js"
        },
        externals: {
            three: "THREE"
        },
        output: {
            path: __dirname + "/dist/",
            filename: "[name]-[contenthash].js"
        },

        devtool: devMode ? 
            "eval-source-map" :     // "best quality SourceMaps for development", see https://webpack.js.org/configuration/devtool/#development
            "hidden-source-map",    // "Useful if you only want SourceMaps to map error stack traces from error reports", see https://webpack.js.org/configuration/devtool/#production

        module: {
            rules: [

                // Markup rules
                {
                    test: /\.html$/,
                    use: [{
                        loader: "html-loader",
                        options: { minimize: !devMode }
                    }]
                },

                // Stylesheet rules
                {
                    test: /\.css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        { loader: "css-loader", options: { sourceMap: true } }
                    ]
                },

                // Script rules
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: "babel-loader",  options: babelrc },
                        { loader: "eslint-loader", options: eslintrc }
                    ]
                }
            ]
        },

        optimization: {
            minimize: true,
            minimizer: [
                new OptimizeCSSAssetsPlugin({})
            ]
        },

        plugins: [
            new CleanWebpackPlugin(["dist"]),   // Deletes the output folder before each run
            new HtmlWebpackPlugin({
                template: "src/index/index.html",
                filename: "index.html",
                minify: !devMode,
                cache: true    // Emit the file only if it was changed
            }),
            new MiniCssExtractPlugin({
                filename: "[name]-[contenthash].css"
            })
        ]
    };
};