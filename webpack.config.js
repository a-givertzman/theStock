// Работает на этапе сборки приложения, в само приложение  не попадает
const path = require('path')
const HTMLWebPackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: './place_pattern/main.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new HTMLWebPackPlugin({
            template: './place_pattern/index.php'
        })
    ]
}