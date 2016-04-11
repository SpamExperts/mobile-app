#!/usr/bin/env bash

function mcp()
{
    if [[ -z "$1" || -z "$2" ]]; then
        echo "Usage: mycp SOURCE... DIRECTORY"
        return 1;
    fi
    mkdir -p "$2"
    cp -r "$1" "$2"
}

if ! type "ionic" > /dev/null; then
echo "You need to install ionic.\n Try using: npm install -g cordova ionic \n http://ionicframework.com/getting-started/"
else
    ionic start spamexperts_mobile_app blank

    cd spamexperts_mobile_app
    git clone https://nicolaeSE:Loiciemeh1850@github.com/SpamExperts/mobile-app.git

    mcp www/lib/ionic/js/ionic.bundle.min.js mobile-app/lib/ionic/js
    mcp www/lib/ionic/css/ionic.min.css mobile-app/lib/ionic/css
    mcp www/lib/ionic/fonts mobile-app/lib/ionic/

    rm -rf www
    mv mobile-app www

    cd www
    npm install
    gulp
    cd ..

    rm -rf www/js www/css www/templates

    ionic platform add android
    ionic build android
    cd ..
    mv spamexperts_mobile_app/platforms/android/build/outputs/apk/*.apk ./spamexperts_mobile_app.apk
    rm -rf spamexperts_mobile_app build.sh
fi