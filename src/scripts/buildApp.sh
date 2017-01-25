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

    rm -rf spamexperts_app.$EXTENSION *_spamexperts_app.$EXTENSION spamexperts_mobile_app

    # create blank app
    ionic start spamexperts_mobile_app https://github.com/SpamExperts/mobile-app

    # build assets
    cd spamexperts_mobile_app/www/src/
    npm install
    bower install
    gulp
    cd -

    cd spamexperts_mobile_app

    # add platform
    ionic platform add $PLATFORM

    # add cordova plugins
    cordova plugin add cordova-plugin-network-information

    # remove debug plugin
    cordova plugin rm cordova-plugin-console

    # add jshybugger for debugging a production app
    if ! [ -z "$3" ] && [ "$3" = "debug" ]; then
        ionic plugin add https://github.com/jsHybugger/cordova-plugin-jshybugger.git
    fi

    # add own config
    mv www/src/config/config.xml .
    rm -rf resources
    mv www/img/resources .

    # build resources
    ionic resources

    # remove useless icon
    rm -rf resources/splash.png resources/icon.png

    # cleanup
    rm -rf www/css www/js www/lib www/src

    # build for platform
    if [ -z "$2" ]; then
        # do not build for release if no keystore was provided
        OUTPUT="$(cordova build $PLATFORM | tail -n 1)"
    else
        # we need this plugin to allow connection on servers with self-signed certificates
        cordova plugin add cordova-plugin-certificates
        OUTPUT="$(cordova build --release $PLATFORM | tail -n 1)"
    fi

    if ! [ -z "$2" ]; then
       if [ "$PLATFORM" = "android" ]; then
            # get the apk file
            mv $OUTPUT ../unsigned_spamexperts_app.apk
            cd -
            jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $2 unsigned_spamexperts_app.apk spamexperts_app
            zipalign -v 4 unsigned_spamexperts_app.apk spamexperts_app.apk
            rm unsigned_spamexperts_app.apk

        elif [ "$PLATFORM" = "ios" ]; then
            cd -
            OUTPUT="$(find . -name 'SpamExpertsQuarantine.xcodeproj')"
            mv $OUTPUT .
            echo "Open SpamExpertsQuarantine.xcodeproj with Xcode and build for release using Automatic Provisioning feature."
        fi
    fi

fi

rm -rf spamexperts_mobile_app