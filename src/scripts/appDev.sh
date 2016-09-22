#!/usr/bin/env bash

# break on first error
set -e

# bash buildApp.sh <android|ios>
if [ -z "$1" ]; then
    echo "Please specify android or ios";
    exit 1
elif [ "$1" = "ios" ]; then
    PLATFORM='ios'
    EXTENSION="ipa"
elif [ "$1" = "android" ]; then
    PLATFORM='android'
    EXTENSION="apk"
fi

if [ -z "$2" ]; then
    echo "Please specify a hostname";
    exit 1
fi

if ! type "ionic" > /dev/null; then
    echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
else

    rm -rf spamexperts_mobile_app

    # create blank app
    ionic start spamexperts_mobile_app https://github.com/SpamExperts/mobile-app

    # build assets
    cd spamexperts_mobile_app/www/src/
    npm install
    bower install
    gulp
    gulp add-proxy --server $2
    cd -

    cd spamexperts_mobile_app

    # add platform
    ionic platform add $PLATFORM

    # add cordova plugins
    cordova plugin add cordova-plugin-network-information

    # we need this plugin to allow connection on servers with self-signed certificates
    cordova plugin add cordova-plugin-certificates

    # add own config
    cp www/src/config/config.xml .
    rm -rf resources
    cp -r www/img/resources .

    # build resources
    ionic resources

    # remove useless icon
    rm -rf resources/splash.png resources/icon.png

    # cleanup
    rm -rf www/css www/js www/lib

    cd www

    git init
    git remote add origin https://github.com/SpamExperts/mobile-app/

    ionic serve $PLATFORM
fi