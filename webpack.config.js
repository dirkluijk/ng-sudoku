const path = require('path');

const config = {
  entry: './src/app/generator.worker.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'generator.worker.js'
  }
};

module.exports = config;
