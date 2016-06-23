#!/usr/bin/env bash

# break on first error
set -e
current="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

appContainer=$current/../..

if [ ! -d $appContainer/.se_app_assets ]; then
    mkdir $appContainer/.se_app_assets

    ln -s $current/js $appContainer/.se_app_assets/js
    ln -s $current/css $appContainer/.se_app_assets/css
    ln -s $current/templates $appContainer/.se_app_assets/templates

    sudo chmod -R 770 $appContainer/.se_app_assets
fi

cp $current/gulpfile.js $appContainer/.se_app_assets/
cp $current/package.json $appContainer/.se_app_assets/

cp $current/bower.json $appContainer/.se_app_assets/
cp $current/.bowerrc $appContainer/.se_app_assets/

cd $appContainer/.se_app_assets

sudo npm install
sudo bower install --allow-root

if [ -z "$1" ]; then
    gulp default
    gulp remove-proxy
else
    gulp dev default
    gulp add-proxy
fi

rm -rf $current/minified
mv minified $current/
cd -

# remove the assets folder if not in dev mode
if [ -z "$1" ]; then
    sudo rm -rf $appContainer/.se_app_assets
fi