require('dotenv').config();

const path = require('path');
const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');
const webpack = require('webpack');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[sha512:hash:base64:7].[ext]',
          publicPath: './',
          outputPath: 'images/',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            'MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN)
        }
    }),
  ]
};
