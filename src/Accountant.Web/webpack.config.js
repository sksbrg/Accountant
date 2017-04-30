// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin');

// https://github.com/aurelia/webpack-plugin
const { AureliaPlugin } = require("aurelia-webpack-plugin");

var webpack = require('webpack');
var path = require('path');

const project = require('./package.json');


module.exports = {
    entry: {
        app: ['aurelia-bootstrapper'],
        
        // all Aurelia libraries will be saved into a dedicated bundle
        // to ease maintenance we read the required packages from the 'dependencies' section of our 'package.json' file
        aurelia: Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'))
    },
    output: {
        path: path.resolve(__dirname, './wwwroot'),
        filename: 'scripts/[name].bundle.js'
    },

    resolve: {
        extensions: ['.js'],
        modules: ['src', 'node_modules'],
    },

    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            }]
        },
        {
            // this loader reads the referenced html templates and bundles them with the javascript files, e.g. 'app.html'
            test: /\.html$/,
            loader: 'html-loader',
            exclude: path.resolve('src/index.html')
        }]
    },
    plugins: [
        // https://github.com/jods4/aurelia-webpack-build/wiki/AureliaPlugin-options
        new AureliaPlugin({ includeAll: 'src' }),
        // creates the seperate bundle for Aurelia libraries
        new webpack.optimize.CommonsChunkPlugin({ name: ['aurelia'] }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
