// webpack.config.js

// npm install --save-dev babel-core babel-preset-react babel-preset-es2015 babel-loader
'use strict'
const path = require('path')

module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname+'/.bundle',
        filename: "node_modules.js"
    },
    resolve: {
      modulesDirectories: ['node_modules', 'src'],
      fallback: path.join(__dirname, 'node_modules'),
    },
    resolveLoader: {
      fallback: path.join(__dirname, 'node_modules'),
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, loader: "jsx-loader" }
        ]
    }
};