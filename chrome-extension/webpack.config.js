const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      popup: './popup/popup.js',
      options: './options/options.js',
      background: './background/background.js',
      content: './content/content.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]/[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name]/[name].css',
      }),
      new CopyPlugin({
        patterns: [
          { from: 'manifest.json', to: '.' },
          { from: 'assets', to: 'assets' },
          { from: 'popup/popup.html', to: 'popup' },
          { from: 'options/options.html', to: 'options' },
          { from: 'sidebar/sidebar.html', to: 'sidebar' },
        ],
      }),
      ...(isProduction
        ? [
            new ZipPlugin({
              filename: 'jobsai-extension.zip',
            }),
          ]
        : []),
    ],
    devtool: isProduction ? false : 'source-map',
  };
};