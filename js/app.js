// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'
        //, 'ngMockE2E'
    ])

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

    .config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('main', {
                url: '/',
                abstract: true,
                templateUrl: 'templates/main.html'
                //controller: 'CommonCtrl'
            })

            .state('main.dash', {
                url: 'dash',
                views: {
                    'view-container': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'DashCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })

            .state('main.incoming', {
                url: 'incoming',
                views: {
                    'view-container': {
                        templateUrl: 'templates/messages.html',
                        controller: 'MessagesCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })

            .state('main.outgoing', {
                url: 'outgoing',
                views: {
                    'view-container': {
                        templateUrl: 'templates/messages.html',
                        controller: 'MessagesCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })

            .state('main.message-detail', {
                url: 'messages/:messageId/:direction',
                views: {
                    'view-container': {
                        templateUrl: 'templates/message-detail.html',
                        controller: 'MessageDetailCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
        ;
        $urlRouterProvider.otherwise('dash');
    })

    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
        $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

            if (!AuthService.isAuthenticated()) {
                if (next.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            }

            if ('data' in next && 'authorizedRoles' in next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    $state.go($state.current, {}, {reload: true});
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                }
            }

        });
    });
