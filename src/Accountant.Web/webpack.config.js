// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin');

// https://github.com/aurelia/webpack-plugin
var AureliaWebPackPlugin = require('aurelia-webpack-plugin');

var webpack = require('webpack');
var path = require('path');

const project = require('./package.json');


module.exports = {
    entry: {
        // the app's entry point, this should be set automatically by 'aurelia-webpack-plugin'
        // using the files in the 'src' folder
        // the app knows which of the files is our entry point because of the 'aurelia-bootstrapper-webpack'
        // who reads the entry point from the aurelia-app="main" in our index.html
        // app: [],
        // TODO: does not work as intended; needed to reference 'main.js' manually
        app: ['./src/main.js'],
        // all Aurelia libraries will be saved into a dedicated bundle
        // to ease maintenance we read the required packages from the 'dependencies' section of our 'package.json' file
        aurelia: Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'))
    },
    output: {
        path: './wwwroot',
        filename: 'scripts/[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
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
        new AureliaWebPackPlugin(),
        // creates the seperate bundle for Aurelia libraries
        new webpack.optimize.CommonsChunkPlugin({ name: ['aurelia'] }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
