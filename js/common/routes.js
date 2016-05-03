angular.module('SpamExpertsApp')
    .config(['$stateProvider', '$urlRouterProvider', 'GROUPS', 'USER_ROLES',
        function ($stateProvider, $urlRouterProvider, GROUPS, USER_ROLES) {
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
                        'main-container': {
                            templateUrl: 'templates/dashboard/dashboard.html'
                        }
                    },
                    data: {
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.domain, USER_ROLES.email]
                    }
                })
                .state('main.incomingLogSearch', {
                    url: 'incoming/log/search',
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
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.domain, USER_ROLES.email]
                    }
                })
                .state('main.outgoingLogSearch', {
                    url: 'outgoing/log/search',
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
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.domain, USER_ROLES.email]
                    }
                })
                .state('main.message-detail', {
                    url: 'message',
                    cache: false,
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
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.domain, USER_ROLES.email]
                    }
                });

            $urlRouterProvider.otherwise('dash');
        }
    ]);