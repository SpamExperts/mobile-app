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
    while true; do echo n; done | ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app

    # clear the blank assets
    rm -rf www/*

    # checkout branch in www and build assets
    cd www
    git init
    git pull https://github.com/SpamExperts/mobile-app.git
    git remote add origin https://github.com/SpamExperts/mobile-app/
    bash build_assets.sh dev
    cd -

    # add own config
    cp www/config.xml .
    cp www/ionic.project .

    if [ "$PLATFORM" = "ios" ]; then
        sed -i '' 's/"proxies": \[\]/\"proxies\"\: \[\{"path": "\/rest","proxyUrl": "http:\/\/'$2'\/rest"\}\]/g' ionic.project
    else
        sed -i 's/"proxies": \[\]/\"proxies\"\: \[\{"path": "\/rest","proxyUrl": "http:\/\/'$2'\/rest"\}\]/g' ionic.project
    fi

    # add platform
    ionic platform add $PLATFORM

    # add cordova plugins
    cordova plugin add cordova-plugin-network-information

    # clear default resources
    rm -rf resources/*

    # set config and resources
    cp www/img/spamexperts_logo.png resources/splash.png
    cp www/img/spamexperts_logo.png resources/icon.png

    # build resources
    ionic resources

    # remove useless icon
    rm resources/splash.png
    rm resources/icon.png

#    ionic emulate $PLATFORM --livereload --consolelogs --serverlogs --stacktrace
    ionic serve $PLATFORM
fi