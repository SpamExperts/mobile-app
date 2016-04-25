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

    # create blank app
    while true; do echo n; done | ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app

    # clear the blank assets
    rm -rf www/*

    # add dependencies
    wget http://code.ionicframework.com/1.2.4/js/ionic.bundle.min.js -P www/lib/ionic/js/

    wget http://code.ionicframework.com/1.2.4/css/ionic.min.css -P www/lib/ionic/css/

    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.eot  -P www/lib/ionic/fonts/
    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.svg  -P www/lib/ionic/fonts/
    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.ttf  -P www/lib/ionic/fonts/
    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.woff -P www/lib/ionic/fonts/

    # get the app
    git clone https://github.com/SpamExperts/mobile-app.git

    # build app assets
    cd mobile-app
    npm install
    gulp
    cd -

    # add index.html
    mv mobile-app/index.html www/

    # add img folder
    mv mobile-app/img www/

    # add the minified scripts
    mv mobile-app/minified www/

    # keep our config
    mv mobile-app/config.xml www/

    # remove unused folder
    rm -rf mobile-app

    # add platform
    ionic platform add $PLATFORM

    # set config and resources
    mv www/img/splash.png resources/$PLATFORM

    # build resources
    ionic resources

    # remove useless icon
    rm resources/$PLATFORM/splash.png

    # add own config
    mv www/config.xml .

    # build for platform
    OUTPUT="$(ionic build $PLATFORM | tail -n 1)"

    # get the apk/ipa file
    mv $OUTPUT ../spamexperts_app.$EXTENSION

    # cleanup
    cd ..
    rm -rf spamexperts_mobile_app
fi
