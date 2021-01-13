const Os = require('os');
const Webpack = require('webpack');

module.exports = {
  getConfig: ({ publicFolderPath }) => {
    const localV4IpAddress = Object.values(Os.networkInterfaces())
      .flat()
      .filter(({ family }) => String(family).toLowerCase() === 'ipv4');
    const server =
      localV4IpAddress.find(({ internal }) => !internal) || localV4IpAddress.find(({ internal }) => internal);

    const serverHostname = server ? server.address : 'localhost';

    const proxyUrl = new URL(process.env.QBT_API_BASE_URL);
    const proxyTargetOrigin = proxyUrl.origin.replace('localhost', serverHostname);
    const proxyHost = proxyUrl.host.replace('localhost', serverHostname);

    console.log(`Open the host in browser: http://localhost:9000`);
    console.log(`Proxy Server: ${serverHostname}:9000 -> ${proxyHost}\n\n`);

    return {
      plugins: [],

      devServer: {
        stats: 'minimal',
        port: 9000,
        host: '0.0.0.0',
        disableHostCheck: true,
        watchOptions: {
          ignored: /node_modules/,
        },
        contentBase: publicFolderPath,
        proxy: {
          '/api': {
            target: proxyTargetOrigin,
            bypass: function (req) {
              const originUrl = new URL('http://' + (req.headers.host || 'localhost'));
              const localProxyUrl = new URL(proxyTargetOrigin.replace(serverHostname, originUrl.hostname));

              req.headers['host'] = localProxyUrl.host;
              req.headers['origin'] = localProxyUrl.origin;
              req.headers['referer'] = localProxyUrl.origin;
            },
          },
        },
      },
    };
  },
};
