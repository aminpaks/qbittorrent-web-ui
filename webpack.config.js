require('dotenv-flow').config();
const Path = require('path');
const Fs = require('fs');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge: mergeConfigs } = require('webpack-merge');
const { getConfig: getDevConfig } = require('./webpack/dev.config');
const { getConfig: getProdConfig } = require('./webpack/prod.config');

module.exports = ({ production = false }) => {
  const rootPath = Path.resolve(__dirname);
  const publicFolderPath = Path.resolve(rootPath, 'public');
  const buildFolderPath = Path.resolve(rootPath, 'build');
  const clientEntry = Path.resolve(rootPath, 'src', 'main.ts');

  // For now we use standard Public URL as ''
  const publicUrl = '';

  const htmlTemplatePath = Path.resolve(publicFolderPath, '', 'index.html');
  const htmlTemplateContent = String(Fs.readFileSync(htmlTemplatePath)).replace(/%PUBLIC_URL%/g, publicUrl);

  // Prepare env variables
  const envVariables = Object.entries(process.env).reduce((acc, entry) => {
    const [key, value] = entry;
    if (key.indexOf('QBT_') === 0) {
      acc[key] = JSON.stringify(value);
    }
    return acc;
  }, {});
  envVariables['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV);
  envVariables['process.env.QBT_DEV_SERVER_BASE_URL'] = JSON.stringify('');
  envVariables['process.env.PUBLIC_URL'] = JSON.stringify(publicUrl);

  const excludePaths = /(node_modules|bower_components)/;

  const config = mergeConfigs(
    production
      ? getProdConfig({ publicFolderPath, buildFolderPath })
      : getDevConfig({ publicFolderPath, buildFolderPath }),
    {
      mode: production ? 'production' : 'development',
      target: 'web',
      devtool: production ? 'source-map' : 'cheap-eval-source-map',
      entry: clientEntry,
      output: {
        filename: production ? `bundle.[contenthash].js` : 'bundle.js',
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
    }
  );

  return config;
};
