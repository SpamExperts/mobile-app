#!/usr/bin/env bash

# break on first error
set -e

if ! type "ionic" > /dev/null; then
    echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
    exit 1;
fi

REPOSITORY="https://github.com/SpamExperts/mobile-app.git"

while getopts hp:k:v:wx:b:t:d option
do
    case "${option}" in
        p)
            if [ "${OPTARG}" = "ios" ]; then
                PLATFORM='ios'
            elif [ "${OPTARG}" = "android" ]; then
                PLATFORM='android'
            fi
        ;;

        k) KEYSTORE_FILE=${OPTARG};;
        v) VERSION=${OPTARG};;

        w) WEB_DEV=true;;
        x) PROXY_SERVER=${OPTARG};;

        b) BRANCH=${OPTARG};;
        t) TEMPLATE=${OPTARG};;
        d) DEBUG=true;;

        h)
          echo "Usage:
$0 [ARG...]

- For development only -p <platform> -w and -x <server> arguments are needed
- For production build you need to specify -p <platform> -v <version_no: x.y.z> and additionally -k <keystore file>
- You can develop/build various remote or local versions of the app by using -b <git_branch_name> or -t <path/to/local/src_folder> for local versions.
- When debugging a production app use -d flag to add the jshybugger plugin and enable remote debugging.

Options:

    -h
        display help

    -p <android/ios> (always required)
        Specify platform: android or ios

--------------------------- PROD ---------------------------------

    -k <path/to/android-keystore-file>
        specify keystore file for android signing (Android only, use Automatic sign from XCode for iOS)

    -v <x.y.z>
        specify a new version number for the new build

---------------------------- DEV ----------------------------------

    -w
        specify this flag whether you want to get the sources for development.
        You may also want to specify a proxy server using -x <server_name> argument when working as dev.

    -x <server_name>
        Specify the proxy server for development
        The proxy server can be manually added later using npm run toggleProxy <server_name>

-------------------------- TESTING ---------------------------------

    -b <git_branch_name>
        Specify branch name

    -t <path/to/local/src_folder>
        Specify path to local template src folder

    -d
        Specify this flag if you want to pack the app with cordova-plugin-jshybugger for remote debugging the production app
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
ionic start spamexperts_mobile_app blank --cordova

cd spamexperts_mobile_app

# we don't need the default git repo
rm -rf .git

# clear default src folder
rm -rf src

if ! [ -z "${TEMPLATE}" ]; then
    cp -rf ${TEMPLATE} .
else
    # clone our repo to src
    git clone ${REPOSITORY} src

    # switch to specific branch is specified
    if ! [ -z "${BRANCH}" ]; then
        cd src
        git checkout -b $BRANCH origin/$BRANCH
        git pull
        cd -
    fi
fi

# get our npm config
cp -f ./src/config/package.json .

# update node dependencies
npm i

if ! [ -z "${WEB_DEV}" ]; then
    if ! [ -z "${PROXY_SERVER}" ]; then
        npm run toggleProxy ${PROXY_SERVER}
    else
        echo "You haven't added a proxy server when choosing the -w developer flag.
        The proxy server can be manually added later using npm run toggleProxy <server_name>.
        "
    fi
    echo "Open the project in your IDE, register the proper VCS root and run the following command: npm run ionic:serve"
    exit;
fi

npm run ionic:build

# add platform
ionic cordova platform add $PLATFORM

# add cordova plugins
ionic cordova plugin add cordova-plugin-network-information

# add jshybugger for debugging a production app
if ! [ -z "${DEBUG}" ]; then
    ionic cordova plugin add https://github.com/jsHybugger/cordova-plugin-jshybugger.git
fi

# add own config
cp ./src/config/config.xml .

if ! [ -z "${VERSION}" ]; then
    sed -i'' s/x\.y\.z/${VERSION}/g ./config.xml
else
    sed -i'' s/x\.y\.z/1.0.0/g ./config.xml
fi

rm -rf resources
cp -rf ./src/assets/resources .

 # build resources
ionic cordova resources ${PLATFORM}

 # remove useless icon
rm -rf resources/splash.png resources/icon.png

 # cleanup
rm -rf www/src

if [ "${PLATFORM}" = "android" ]; then
    if [ -z "${KEYSTORE_FILE}" ]; then
        ionic cordova build android
    else
        ionic cordova build android --prod --release --keystore=${KEYSTORE_FILE}--alias=spamexperts_app
    fi
    exit;
fi

if [ "${PLATFORM}" = "ios" ]; then
    echo "Open SpamExpertsQuarantine.xcodeproj with Xcode and build for release using Automatic Provisioning feature."
fi
