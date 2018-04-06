const path = require('path');
const Webpack = require('webpack');
const pkg = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        cui: ['./js/cui.js', './scss/cui.scss']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: `[name].${pkg.version}.js`,
        publicPath: '/public/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: false
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                })
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)\w*/,
                use: {
                    loader: 'file-loader',
                    query: {
                        name: 'assets/[name].[ext]'
                    }
                }
            }
        ]
    },
    watchOptions: {
        poll: 1000, //监测修改的时间(ms)
        aggregateTimeout: 500, //防止重复按键，500毫米内算按键一次
        ignored: /node_modules/ //不监测
    },
    plugins: [
        new ExtractTextPlugin(`cui.${pkg.version}.css`),
        new Webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        })
    ]
};