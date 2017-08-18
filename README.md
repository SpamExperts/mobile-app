# ![](src/assets/se_logo.png) SpamExperts mobile app

This is a branch for converting the mobile app to use Ionic 3

### Steps to build the app:

- install Android SDK for Android platform and XCode for iOS
- make sure you installed [Node.js](http://nodejs.org/)
- install Cordova and Ionic CLI `$ npm install -g ionic cordova`

- run the following command in a terminal
```bash
$ wget https://raw.githubusercontent.com/SpamExperts/mobile-app/mobileApp2/scripts/build.sh
$ bash build.sh [arguments...]
```
Checkout help for the available options `bash build.sh -h`

### For development:
- open a terminal and run the following command:
```bash
$ wget https://raw.githubusercontent.com/SpamExperts/mobile-app/mobileApp2/scripts/build.sh
$ bash build.sh -p android -w -x <server_name> -b mobileApp2
```
- open `spamexperts_mobile_app` project folder with your IDE and register the VCS root
- run `$ npm run ionic:serve` from your command line to start the local server

When working in the development mode a service proxy has to be setup in order to prevent the CORS errors.
There is an nodejs script to toggle this service.
```bash
$ # Adding the proxy server
$ npm run toggleProxy <proxy_server>

$ # Removing the proxy server
$ npm run toggleProxy
```

The ionic build process has been tweaked to set up specific environment variable depending on the mode you are running.
Whenever the proxy is enabled it assumes you are using dev configuration and sets the "DEV_PROXY" variable to true.
This should be taken into account whenever performing AJAX requests during development. In production "DEV_PROXY" would always be off as no server proxy is set.

For more information visit the [Ionic documentation page](http://ionicframework.com/docs/).
