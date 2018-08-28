const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Generator = function (configDirname, filename, isProduction) {
    this.configDirname = configDirname;
    this.filename = filename;
    this.isProduction = isProduction;
};

Object.assign(Generator.prototype, {
    cssLoaders() {
        return [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: !this.isProduction } }
        ];
    },

    sassRules() {
        return [
            {
                test: /\.scss$/,
                use: this.cssLoaders().concat([
                    { loader: 'sass-loader', options: { sourceMap: !this.isProduction } }
                ])
            },
            {
                test: /\.css$/,
                use: this.cssLoaders()
            }
        ]
    },

    extractPlugins() {
        let plugins = [
            new MiniCssExtractPlugin({
                filename: this.filename + '.css',
                chunkFilename: this.isProduction ? '[id]-[hash].css' : '[id].css'
            })
        ];
        if (this.isProduction) {
            return plugins.concat([
                new OptimizeCssAssetsPlugin({})
            ]);
        }
        return plugins;
    }
});

module.exports = function (configDirname, filename, isProduction) {
    return new Generator(configDirname, filename, isProduction);
};