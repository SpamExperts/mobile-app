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
                //controller: 'CommonCtrl'
            })

            .state('main.dash', {
                url: 'dash',
                views: {
                    'view-container': {
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
                //cache: false, //required
                group: GROUPS.incoming,
                views: {
                    'view-container': {
                        templateUrl: 'templates/logSearch/view/messages.html',
                        controller: 'MessagesCtrl'
                    }
                },
                rightSideMenu:  {
                    templateUrl: 'templates/logSearch/menu/menu.html',
                    controller: 'SearchCriteriaCtrl'
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })

            .state('main.outgoing', {
                url: 'outgoing',
                //cache: false, //required
                group: GROUPS.outgoing,
                views: {
                    'view-container': {
                        templateUrl: 'templates/logSearch/view/messages.html',
                        controller: 'MessagesCtrl'
                    }
                },
                rightSideMenu:  {
                    templateUrl: 'templates/logSearch/menu/menu.html',
                    controller: 'SearchCriteriaCtrl'
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })

            .state('main.message-detail', {
                url: 'message/:messageId/:direction',
                cache: false, //required
                views: {
                    'view-container': {
                        templateUrl: 'templates/logSearch/view/message-detail.html',
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
;