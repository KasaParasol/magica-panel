const path = require('node:path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'main.js',
        library: {
            name: 'MagicaPanel',
            type: 'var',
            export: 'default',
        },
    },
    mode: 'development',
    devtool: 'inline-source-map',
};
