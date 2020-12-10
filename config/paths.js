// Source: https://github.com/taniarascia/webpack-boilerplate

const path = require('path');

module.exports = {
  src: path.resolve(__dirname, '../src'),
  utils: path.resolve(__dirname, '../src/utils'),
  styles: path.resolve(__dirname, '../src/styles'),
  build: path.resolve(__dirname, '../dist'),
  public: path.resolve(__dirname, '../public'),
};
