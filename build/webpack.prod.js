/*
 * @Author: fox 
 * @Date: 2018-10-25 14:10:07 
 * @Last Modified by: fox
 * @Last Modified time: 2018-10-25 19:20:05
 */
import webpack from 'webpack';
import config from 'config';
import debug from 'debug';
import path from 'path';
import merge from 'webpack-merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HappyPack from 'happypack';
import rm from 'rimraf';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import defaultConf from './webpack.default';

const extractSass = new ExtractTextPlugin({
    filename: 'scss/[name].[contenthash].css'
});

const log = debug('console.log: ');

const prodConf = merge(defaultConf, {
    devtool: 'source-map',
    output: {
        library: config.outputName,
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: 'happypack/loader?id=scss'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                comments: false,
                compress: {
                    collapse_vars: true,
                    drop_console: true,
                    reduce_vars: true,
                    warnings: false
                }
            }
        }),
        new HappyPack({
            id: 'scss',
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        }),
        extractSass
    ]
});

const compiler = webpack(prodConf);

rm(path.resolve(__dirname, '../dist'), err => {
    if (err) {
        throw err;
    }
    compiler.run((err, stats) => {
        if (err) {
            throw err;
        }
        process.stdout.write(
            '\n\n' +
                stats.toString({
                    colors: true,
                    modules: false,
                    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                    chunks: false,
                    chunkModules: false
                }) +
                '\n\n'
        );
    });
});
