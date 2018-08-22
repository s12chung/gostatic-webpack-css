const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const Generator = function (configDirname, filename, isProduction) {
    this.configDirname = configDirname;
    this.filename = filename;
    this.isProduction = isProduction;
};

Object.assign(Generator.prototype, {
    cssLoaders() {
        return [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    minimize: this.isProduction,
                    sourceMap: !this.isProduction
                }
            }
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
        return [
            new MiniCssExtractPlugin({
                filename: this.filename + '.css',
                chunkFilename: this.isProduction ? '[id]-[hash].css' : '[id].css'
            })
        ];
    }
});

module.exports = function (configDirname, filename, isProduction) {
    return new Generator(configDirname, filename, isProduction);
};