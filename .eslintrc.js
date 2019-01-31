module.exports = {

    root: true,

    parserOptions: {
        ecmaVersion: 8,
        sourceType: "module",
        ecmaFeatures: {
            jsx: false,
            impliedStrict: true,
            globalReturn: false
        }
    },

    env: {
        browser: true,
        es6: true,
        node: true
    },

    extends: "eslint:recommended",
    rules: {
        "no-console": "off",
        "indent": [ "error", 4, { SwitchCase: 1, MemberExpression: "off" } ],
        "linebreak-style": [ "error", "unix" ],
        "quotes": [ "error", "double" ],
        "semi": [ "error", "always" ],
        "no-unused-vars": [ "error", { args: "none" } ],
        "no-var": "error",
        "eqeqeq": "error"
    }

}