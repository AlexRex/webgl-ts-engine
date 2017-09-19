const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'main': './main.ts'
    },

    output: {
        filename: '[name].bundle.js',
        path: DESTINATION,
        libraryTarget: 'var',
        library: 'TRCApp'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: ROOT + '/assets/**/*'
        },
        {
          from: ROOT + '/shaders/**/*'
        },
        {
          from: ROOT + '/index.html'
        },
        {
          from: ROOT + '/viewer.html'
        },
        {
          from: ROOT + '/app.html'
        }
      ])
    ],

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'tslint-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.tsx?$/,
                exclude: [ /node_modules/ ],
                use: 'awesome-typescript-loader?configFileName=tsconfig.json',
            }
        ]
    },

    devtool: 'cheap-module-source-map',
    devServer: {}
};
