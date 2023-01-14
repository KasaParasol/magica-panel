const path = require('node:path');

module.exports = env => ({
    entry: './src/index.js',
    output: {
        path: env.mode === 'demo' ? path.resolve('./demo') : path.resolve('./dist'),
        filename: 'main.js',
        library: {
            name: 'MagicaPanel',
            type: 'var',
            export: 'default',
        },
    },
    mode: 'development',
    devtool: 'inline-source-map',
});
