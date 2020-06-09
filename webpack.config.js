// Работает на этапе сборки приложения, в само приложение  не попадает
const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/place_pattern/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}