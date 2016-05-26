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

if ! type "ionic" > /dev/null; then
echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
else

    rm -rf spamexperts_mobile_app

    # create blank app
    while true; do echo n; done | ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app

    # clear the blank assets
    rm -rf www/*

    # get the app
    git clone https://github.com/SpamExperts/mobile-app.git

    # build app assets
    cd mobile-app
    npm install
    gulp

    bower install
    find lib -type f ! -name '*.min.css' ! -name '*.min.js' ! -name '*.ttf' ! -name '*.woff' ! -name '*.svg' ! -name '*.eot'| xargs rm -rf
    find lib -type d -empty -delete

    cd -

    # add index.html
    mv mobile-app/index.html www/

    # add img folder
    mv mobile-app/img www/

    # add the minified scripts
    mv mobile-app/minified www/

    # keep our config
    mv mobile-app/config.xml www/
    mv mobile-app/ionic.project www/

    # remove unused folder
    rm -rf mobile-app

    # add platform
    ionic platform add $PLATFORM

    cordova plugin add cordova-plugin-network-information

    # clear default resources
    rm -rf resources/*

    # set config and resources
    cp www/img/spamexperts_logo.png resources/splash.png
    cp www/img/spamexperts_logo.png resources/icon.png

    # build resources
    ionic resources

    # remove useless icon
    rm www/img/spamexperts_logo.png
    rm resources/splash.png
    rm resources/icon.png

    # add own config
    mv www/config.xml .
    mv www/ionic.project .

    # build for platform
    OUTPUT="$(ionic build $PLATFORM | tail -n 1)"

    # get the apk/ipa file
    mv $OUTPUT ../spamexperts_app.$EXTENSION

    # cleanup
    cd ..
    rm -rf spamexperts_mobile_app
fi