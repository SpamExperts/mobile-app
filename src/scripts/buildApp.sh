#!/usr/bin/env bash

# break on first error
set -e

if ! type "ionic" > /dev/null; then
    echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
    exit 1;
fi

TEMPLATE="https://github.com/SpamExperts/mobile-app"

while getopts p:s:v:t:dh option
do
    case "${option}" in
        p)
            if [ "${OPTARG}" = "ios" ]; then
                PLATFORM='ios'
            elif [ "${OPTARG}" = "android" ]; then
                PLATFORM='android'
            fi
        ;;

        s) KEYSTORE_FILE=${OPTARG};;
        v) VERSION=${OPTARG};;
        t) TEMPLATE=${OPTARG};;
        d) DEBUG=true;;
        h)
          echo "Usage:
$0 {p|s|d|v|h}[ARG...]

Options:
    -p
      specify platform: android or ios
    -s
      specify keystore file for android signing
    -v
      specify a new version number for the new build
    -t
      specify path to local template www folder
    -d
      specify this flag if you want to pack the app with cordova-plugin-jshybugger for remote debugging the production app
    -h
      display help
"
            exit 1
        ;;
    esac
done

if [ -z "${PLATFORM}" ]; then
    echo "Please specify android or ios for the platform parameter. Type bash $0 -h for help";
    exit 1
fi

# cleanup previous files
rm -rf spamexperts_app.* *_spamexperts_app.* spamexperts_mobile_app

# create blank app
ionic start spamexperts_mobile_app ${TEMPLATE}

# build assets
cd spamexperts_mobile_app/www/src/
npm install
bower install
gulp

if ! [ -z "${VERSION}" ]; then
    gulp set-build-version --version ${VERSION}
fi
cd -

cd spamexperts_mobile_app

# add platform
ionic platform add $PLATFORM

# add cordova plugins
cordova plugin add cordova-plugin-network-information

# remove debug plugin
cordova plugin rm cordova-plugin-console

# add jshybugger for debugging a production app
if ! [ -z "${DEBUG}" ]; then
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
rm -rf www/styles www/js www/lib www/src

# build for platform
if [ -z "${KEYSTORE_FILE}" ]; then
    # do not build for release if no keystore was provided
    OUTPUT="$(cordova build $PLATFORM | tail -n 1)"
else
    # we need this plugin to allow connection on servers with self-signed certificates
    cordova plugin add cordova-plugin-certificates
    OUTPUT="$(cordova build --release $PLATFORM | tail -n 1)"
fi


if [ "$PLATFORM" = "android" ]; then
    if ! [ -z "${KEYSTORE_FILE}" ]; then
        # get the apk file
        mv $OUTPUT ../unsigned_spamexperts_app.apk
        cd -
        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${KEYSTORE_FILE} unsigned_spamexperts_app.apk spamexperts_app
        zipalign -v 4 unsigned_spamexperts_app.apk spamexperts_app.apk
        rm unsigned_spamexperts_app.apk
        echo "The app has been built and signed"
    else
        echo "The app has been built: ${OUTPUT}"
    fi
elif [ "$PLATFORM" = "ios" ]; then
    cd -
    OUTPUT="$(find . -name 'SpamExpertsQuarantine.xcodeproj')"
    mv $OUTPUT .
    echo "Open SpamExpertsQuarantine.xcodeproj with Xcode and build for release using Automatic Provisioning feature."
fi

rm -rf spamexperts_mobile_app