#!/usr/bin/env bash

if ! type "gulp" > /dev/null; then
    sudo npm i -g gulp
fi

if ! type "bower" > /dev/null; then
    sudo npm i -g bower
fi