#!/usr/bin/env bash

# break on first error
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

if ! type "ionic" > /dev/null; then
echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
else

    # create blank app
    while true; do echo n; done | ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app
    # get the app
    git clone https://github.com/SpamExperts/mobile-app.git

    # set config and resources
    mv mobile-app/config.xml .
    mv mobile-app/resources .

    # keep the important lib files
    wget https://code.angularjs.org/1.4.3/angular-sanitize.min.js.map -P ./lib/ionic/js
    mcp www/lib/ionic/js/angular-sanitize.min.js.map
    mcp www/lib/ionic/js/ionic.bundle.min.js ./lib/ionic/js
    mcp www/lib/ionic/css/ionic.min.css ./lib/ionic/css
    mcp www/lib/ionic/fonts ./lib/ionic/

    # clear the blank assets
    rm -rf www/*
    # place back the lib
    mv lib www/

    # build app assets
    cd mobile-app
    npm install
    gulp
    cd -

    # add index.html
    mcp mobile-app/index.html www

    # add img folder
    mv mobile-app/img www

    # add the minified scripts
    mv mobile-app/minified/* www

    # remove unused folder
    rm -rf mobile-app

    # add platform
    ionic platform add $PLATFORM

    # build for platform
    OUTPUT="$(ionic build $PLATFORM | tail -n 1)"

    # get the apk/ipa file
    mv $OUTPUT ../spamexperts_app.$EXTENSION

    # cleanup
    cd ..
    rm -rf spamexperts_mobile_app
fi