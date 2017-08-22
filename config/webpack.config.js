const webpackConfig = require('@ionic/app-scripts/config/webpack.config.js');
const webpack = require('webpack');

const ionicConfig = require('../../ionic.config.json');

var ENV = 'prod';

if (ionicConfig.proxies && ionicConfig.proxies.length) {
    ENV = 'dev';
}

const envConfigFile = require('./config.' + ENV + '.json');

webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        seEnvVars: envConfigFile
    })
);


