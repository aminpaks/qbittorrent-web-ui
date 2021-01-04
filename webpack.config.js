require('dotenv-flow').config();
const Path = require('path');
const Fs = require('fs');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = Path.resolve(__dirname);
const publicFolderPath = Path.resolve(rootPath, 'public');
const buildFolderPath = Path.resolve(rootPath, 'build');
const clientEntry = Path.resolve(rootPath, 'src', 'main.ts');

const publicUrl = '';

const htmlTemplatePath = Path.resolve(publicFolderPath, '', 'index.html');
const htmlTemplateContent = String(Fs.readFileSync(htmlTemplatePath)).replace(/%PUBLIC_URL%/g, publicUrl);

const PROXY_HOST_TARGET = process.env.QBT_API_HOST;
const url = new URL(PROXY_HOST_TARGET);
const PROXY_HOST = url.host;

// Prepare env variables
const envVariables = Object.entries(process.env).reduce((acc, entry) => {
  const [key, value] = entry;
  if (key.indexOf('QBT_') === 0) {
    acc[key] = JSON.stringify(value);
  }
  return acc;
}, {});
envVariables['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV);
envVariables['process.env.QBT_DEV_SERVER_URL'] = JSON.stringify('http://localhost:9000');
envVariables['process.env.PUBLIC_URL'] = JSON.stringify(publicUrl);
console.log('Webpack proxy: localhost:9000 -> ' + PROXY_HOST + '\n\n');

const excludePaths = /(node_modules|bower_components)/;

module.exports = {
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  entry: clientEntry,
  output: {
    filename: 'main.js',
    // publicPath: '/build/',
    path: buildFolderPath,
  },
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: excludePaths,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new Webpack.DefinePlugin(envVariables),
    new HtmlWebpackPlugin({ templateContent: htmlTemplateContent }),
  ],
  devServer: {
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    contentBase: publicFolderPath,
    proxy: {
      '/api': {
        target: PROXY_HOST_TARGET,
        bypass: function (req) {
          req.headers['host'] = PROXY_HOST;
          req.headers['origin'] = PROXY_HOST_TARGET;
          req.headers['referer'] = PROXY_HOST_TARGET;
        },
      },
    },
  },
};
