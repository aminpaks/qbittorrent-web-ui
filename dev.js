const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

clearConsole();

const compiler = Webpack(config);

compiler.hooks.invalid.tap('invalid', () => {
  clearConsole();

  console.log('Compiling...');
});

const devServer = new WebpackDevServer(compiler, config.devServer);
devServer.listen(9000, 'localhost', err => {
  if (err) {
    console.log('err', err);
  }
});
// const watching = compiler.watch({}, (err, stats) => {
//   console.clear();

//   if (err) {
//     console.error(err.stack || err);
//     if (err.details) {
//       console.error(err.details);
//     }
//     return;
//   }

//   console.log(stats.toJson('minimal'));
// });

process.once('SIGUSR2', function () {
  console.log('shutting down...');
  const killProcess = () => {
    console.log('Killing process!');
    process.kill(process.pid, 'SIGUSR2');
  };

  if (typeof devServer !== 'undefined' && devServer.close) {
    devServer.close(() => {
      console.log('Webpack watch closed!');
      killProcess();
    });
  } else {
    killProcess();
  }
});
