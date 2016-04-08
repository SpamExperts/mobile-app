// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var SpamExpertsApp = angular.module('starter', ['ionic']);

    //.run(function($httpBackend){
    //  $httpBackend.whenGET('http://localhost:8100/valid')
    //        .respond({message: 'This is my valid response!'});
    //  $httpBackend.whenGET('http://localhost:8100/notauthenticated')
    //        .respond(401, {message: "Not Authenticated"});
    //  $httpBackend.whenGET('http://localhost:8100/notauthorized')
    //        .respond(403, {message: "Not Authorized"});
    //
    //  $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
    // })


    // bower install angular-mocks --save
    // <script src="lib/angular-mocks/angular-mocks.js"></script>
    // https://docs.angularjs.org/api/ngMockE2E
SpamExpertsApp
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
})
    .run(function ($localstorage) {

    })
;