#!/usr/bin/env bash

# break on first error
set -e


# get the app
if [ -z "$1" ]; then
git clone https://github.com/SpamExperts/mobile-app.git
else
git clone https://$1@github.com/SpamExperts/mobile-app.git
fi


cd mobile-app

# add dependencies
wget https://code.angularjs.org/1.4.3/angular-sanitize.min.js.map -P lib/ionic/js

wget http://code.ionicframework.com/1.2.4/js/ionic.bundle.min.js -P lib/ionic/js/

wget http://code.ionicframework.com/1.2.4/css/ionic.min.css -P lib/ionic/css/

wget http://code.ionicframework.com/1.2.4/fonts/ionicons.eot  -P lib/ionic/fonts/
wget http://code.ionicframework.com/1.2.4/fonts/ionicons.svg  -P lib/ionic/fonts/
wget http://code.ionicframework.com/1.2.4/fonts/ionicons.ttf  -P lib/ionic/fonts/
wget http://code.ionicframework.com/1.2.4/fonts/ionicons.woff -P lib/ionic/fonts/

# build app assets
npm install
gulp
