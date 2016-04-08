angular.module('ionic.utils', [])

    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])
    //.directive('stopEvent', function () {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, element, attr) {
    //            element.bind('click', function (e) {
    //                e.stopPropagation();
    //            });
    //        }
    //    };
    //});

    //.directive('on-nav-view-dynamic', function($compile) {
    //    return {
    //        restrict: 'ECA',
    //        priority: -400,
    //        link: function(scope, $element, $attr, ctrl) {
    //            var dynamicName = scope.$eval($attr.name);
    //            $element.html('<ion-nav-view name="' + dynamicName + '"></ion-nav-view>');
    //            $compile($element.contents())(scope);
    //        }
    //    };
    //})
;

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.utils', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
      url: "",
      abstract: true,
      templateUrl: "templates/main.html",
      controller: 'CommonCtrl'
  })

  // Each tab has its own nav history stack:

  .state('app.outgoing', {
    url: '/outgoing',
    views: {
      'view-container': {
        templateUrl: 'templates/messages.html',
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('app.messages', {
      url: '/messages',
      views: {
        'view-container': {
          templateUrl: 'templates/messages.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('app.message-detail', {
      url: '/messages/:messageId',
      views: {
        'view-container': {
          templateUrl: 'templates/message-detail.html',
          controller: 'MessageDetailCtrl'
        }
      }
    })

  .state('app.settings', {
    url: '/settings',
    views: {
      'view-container': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/messages');

});
