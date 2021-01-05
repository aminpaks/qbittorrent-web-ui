# qBittorrent Web UI
A simple but efficient UI for qBittorrent

## Development
To start development tools you will need to have some basic tools installed.
We are using webpack dev-server to handling the web-server locally. Follow [Scripts](#Start local web-server) section to see how you can start the local web-server.

### Development tools
Install the following tools:
* [Node.js](https://nodejs.org/) (Recommended LTS)
* [Yarn](https://yarnpkg.com/) (Optional)

### Install application dependencies
You need to install/updated the app dependencies by running `npm install` or `yarn install` in the project root directory.

### Start local web-server
You can start the web-server by running `npm start` or `yarn start` and open following [link](http://localhost:9000) in your browser.

We also are using a proxy for the time being to make the QBT API available during development. You should create your own `.env.local` and set the content to `QBT_API_HOST=http://localhost:8080` or whatever port QBT is serving.

### I18n
We are using [React Intl](https://formatjs.io/docs/react-intl) library to handle translations in the app. Follow section below to see how you should work with scripts to update translation in case you change any strings in the components.

#### Extract strings
You can extract the strings from the source code by running `npm run intl:extract` or `yarn intl:extract` which will update the default English language file at `src/lang/en.json`.

#### Compile strings
You have to compile the translated message from `src/lang/*.json` to `public/lang/*.json` and application will pick them up based on the language you choose. If a locale is missing in that folder application will fallback to English.