const path = require('path')
const webpack = require('webpack')
const dist = require('./package.json').miniprogram

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, './'),
  entry: {
    index: './index.js'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, dist),
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          'babel-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({}),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ],
  optimization: {
    minimize: false,
  },
}
