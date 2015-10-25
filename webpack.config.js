var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  devtool: '#cheap-eval-source-map',

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  // entry: [
  //   'webpack/hot/dev-server',
  //   './web/app.js'
  // ],

  entry: {
    accordionLayout: ['./accordion-layout/index']
  },

  output: {
    publicPath: '/assets/',
    filename: '[name].js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  devServer: {
    hot: true,
    inline: true,
    stats: { colors: true },
    historyApiFallback: true
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] }
    ]
  }
};
