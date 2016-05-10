'use strict';
angular.module('SpamExpertsApp', ['ionic', 'ADM-dateTimePicker'])
    .run(['$ionicPlatform',
        function($ionicPlatform) {
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
        }
    ])
    .config(['$httpProvider', '$ionicConfigProvider',
        function ($httpProvider, $ionicConfigProvider) {
            $httpProvider.interceptors.push('ApiInterceptor');
            $ionicConfigProvider.views.forwardCache(true);
        }
    ])
    .config(['ADMdtpProvider', function(ADMdtp) {
        ADMdtp.setOptions({
            calType: 'gregorian',
            format: 'YYYY-MM-DD hh:mm',
            multiple: false
        });
    }
    ]);