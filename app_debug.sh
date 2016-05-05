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

    # add dependencies
    wget http://code.ionicframework.com/1.2.4/js/ionic.bundle.min.js -P www/lib/ionic/js/

    wget http://code.ionicframework.com/1.2.4/css/ionic.min.css -P www/lib/ionic/css/

    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.eot  -P www/lib/ionic/fonts/
    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.svg  -P www/lib/ionic/fonts/
    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.ttf  -P www/lib/ionic/fonts/
    wget http://code.ionicframework.com/1.2.4/fonts/ionicons.woff -P www/lib/ionic/fonts/

    # get the app
    git clone https://github.com/SpamExperts/mobile-app.git

    # add index.html
    mv mobile-app/* www/

    cd www
    bash build_assets.sh $2
    cd -

    # remove unused folder
    rm -rf mobile-app

    # add own config
    mv www/config.xml .
    mv www/ionic.project .

    if [ "$PLATFORM" = "ios" ]; then
        sed -i '' 's/"proxies": \[\]/\"proxies\"\: \[\{"path": "\/rest","proxyUrl": "http:\/\/'$2'\/rest"\}\]/g' ionic.project
    else
        sed -i 's/"proxies": \[\]/\"proxies\"\: \[\{"path": "\/rest","proxyUrl": "http:\/\/'$2'\/rest"\}\]/g' ionic.project
    fi

    # add platform
    ionic platform add $PLATFORM

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

    ionic emulate $PLATFORM --livereload --consolelogs --serverlogs --stacktrace
fi