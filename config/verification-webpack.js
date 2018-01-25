const path = require('path');

module.exports = {
  entry: './src/verification-unicorn.ts',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'verification-unicorn.js',
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
