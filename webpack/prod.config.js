const Path = require('path');
const Webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  getConfig: ({ publicFolderPath, buildFolderPath }) => {
    const bundleReportFile = Path.resolve(__dirname, '..', 'build-reports', 'report.html');

    return {
      plugins: [
        new CopyPlugin(
          [
            {
              from: Path.resolve(publicFolderPath, '**', '*'),
              to: buildFolderPath,
              transformPath: targetPath => {
                return targetPath.replace('public' + Path.sep, '');
              },
            },
          ],
          { ignore: ['*.js', '*.css', '*.htm', '*.html'] }
        ),
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: bundleReportFile,
          openAnalyzer: false,
        }),
      ],

      optimization: {
        splitChunks: {
          name: true,
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '-',
        },
      },
    };
  },
};
