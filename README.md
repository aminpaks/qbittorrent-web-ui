# qBittorrent Web UI
A simple but efficient UI for qBittorrent

## Installation & Usage
Follow [this article](https://github.com/aminpaks/qbittorrent-web-ui/wiki/How-to-use-this-custom-WebUI) in Wiki explaining how to install this alternative WebUI for your qBittorrent.

## Compatibility
This version of WebUI requires [API v2.6.2](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)) and above.

## Development
To start development environment you will need to get installed some tools.
We are using webpack dev-server to handle the local web server. Follow [this section](#start-the-local-web-server) to see how to start.

### Development tools
Install the following tools:
* [Node.js](https://nodejs.org/) (Recommended LTS)
* [Yarn](https://yarnpkg.com/) (Optional)

### Install application dependencies
You need to install the app dependencies by running `npm install` or `yarn install` in the root directory of project.

### Start the local web server
You can start the web server by running `npm start` or `yarn start` and then open following [link](http://localhost:9000) in your browser.

We also are using a proxy during development to make http requests to QBT. You should create your own `.env.local` and set the content to `QBT_API_BASE_URL=http://localhost:8080` or whatever port QBT is serving on.

### I18n
We are using [React Intl](https://formatjs.io/docs/react-intl) library to handle translations in the app. Follow section below to see how you should work with scripts to update translation in case you are chaning any strings in the components.

#### Extract strings
You can extract the strings from the source code by running `npm run intl:extract` or `yarn intl:extract` which will update the default English language file at `src/lang/en.json`.

#### Compile strings
You have to compile the translated messages from `src/lang/*.json` to `public/lang/*.json` and application will pick them up based on the language you choose. If a locale is missing in that folder application will fallback to English.
