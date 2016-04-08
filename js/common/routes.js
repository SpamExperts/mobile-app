SpamExpertsApp
    .config(function ($stateProvider, $urlRouterProvider, GROUPS, USER_ROLES) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/auth/login.html',
                controller: 'LoginCtrl'
            })
            .state('main', {
                url: '/',
                abstract: true,
                templateUrl: 'templates/common/main.html'
            })
            .state('main.dash', {
                url: 'dash',
                views: {
                    'b': {
                        templateUrl: 'templates/logSearch/view/messages.html',
                        controller: 'IncomingMessagesCtrl'
                    },
                    'main-container': {
                        templateUrl: 'templates/dashboard/dashboard.html',
                        controller: 'DashCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('main.incoming', {
                url: 'incoming',
                group: GROUPS.incoming,
                views: {
                    'main-container': {
                        templateUrl: 'templates/logSearch/view/messages.html',
                        controller: 'IncomingMessagesCtrl'
                    },
                    'right-side-menu':  {
                        templateUrl: 'templates/logSearch/menu/menu.html',
                        controller: 'IncomingSearchCriteriaCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('main.outgoing', {
                url: 'outgoing',
                group: GROUPS.outgoing,
                views: {
                    'main-container': {
                        templateUrl: 'templates/logSearch/view/messages.html',
                        controller: 'OutgoingMessagesCtrl'
                    },
                    'right-side-menu': {
                        templateUrl: 'templates/logSearch/menu/menu.html',
                        controller: 'OutgoingSearchCriteriaCtrl'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('main.message-detail', {
                url: 'message',
                views: {
                    'main-container': {
                        templateUrl: 'templates/logSearch/view/message-detail.html',
                        controller: 'MessageDetailCtrl'
                    }
                },
                params: {
                    message: {},
                    previousState: {}
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            });

        $urlRouterProvider.otherwise('dash');
    });