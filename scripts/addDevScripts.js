#!/usr/bin/env node

var fs = require('fs');

var path = require('path');
var projectRoot = path.resolve(__dirname, '../../');

var seConfig = require('../config/package.json');
var ionicConfig = require(projectRoot + "/package.json");

var newConfig = Object.assign(ionicConfig, seConfig);

fs.writeFile(projectRoot + "/package.json", JSON.stringify(newConfig, null, 2), function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("Node dev scripts added")
});
