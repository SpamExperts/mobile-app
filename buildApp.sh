#!/usr/bin/env bash

set -e

function mcp()
{
    if [[ -z "$1" || -z "$2" ]]; then
        echo "Usage: mcp SOURCE... DIRECTORY"
        return 1;
    fi
    mkdir -p "$2"
    cp -r "$1" "$2"
}


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

if ! type "ionic" > /dev/null; then
echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
else

    while true; do echo n; done | ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app
    git clone https://github.com/SpamExperts/mobile-app.git

    mv mobile-app/config.xml .
    mv mobile-app/resources .

    mcp www/lib/ionic/js/ionic.bundle.min.js ./lib/ionic/js
    mcp www/lib/ionic/css/ionic.min.css ./lib/ionic/css
    mcp www/lib/ionic/fonts ./lib/ionic/

    rm -rf www/*
    mv lib www/

    cd mobile-app
    npm install
    gulp
    rm -rf js css templates
    cd -

    mcp mobile-app/index.html www
    mcp mobile-app/compiled www
    mcp mobile-app/img www

    rm -rf mobile-app

    ionic platform add $PLATFORM
    OUTPUT="$(ionic build $PLATFORM | tail -n 1)"

    mv $OUTPUT ../spamexperts_app.$EXTENSION
    cd ..
    rm -rf spamexperts_mobile_app
fi