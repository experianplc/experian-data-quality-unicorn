const path = require('path');

module.exports = {
  entry: '../src/typedown-single.ts',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'typedown-single.js',
    publicPath: '../lib/'
  },

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
