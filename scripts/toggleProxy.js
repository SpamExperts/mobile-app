#!/usr/bin/env node

var fs = require('fs');

var path = require('path');
var projectRoot = path.resolve(__dirname, '../../');

var config = require('../config/ionic.config.json');

var server = process.argv.slice(2)[0];

if (server) {
    config['proxies'] = [{
        "path": "/rest",
        "proxyUrl": "https://" + server + "/rest"
    }];
}

fs.writeFile(projectRoot + "/ionic.config.json", JSON.stringify(config, null, 2), function(err) {
    if(err) {
        return console.error(err);
    }
    if (server) {
        console.log("The proxy was set to " + server);
    } else {
        console.log("Proxy was removed")
    }
});
