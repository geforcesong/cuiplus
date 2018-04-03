const path = require('path');
const Webpack = require('webpack');
const pkg = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (isDev) {
    return {
        entry: {
            cui: ['./js/cui.js', './scss/cui.scss']
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: `[name].${pkg.version}.js`
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
                                minimize: !isDev
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
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin(`cui.${pkg.version}.css`)
        ]
    };
}