angular.module('SpamExpertsApp')
    .run(['$rootScope', '$state', 'uiService', 'AuthService', 'API_EVENTS',
        function ($rootScope, $state, uiService, AuthService, API_EVENTS) {

            $rootScope.$on('$stateChangeStart', function (event, next) {
                if (next.name !== 'login') {
                    $rootScope.username = AuthService.getUsername();
                    $rootScope.role = AuthService.getRole();

                    if (!AuthService.isAuthenticated()) {
                        event.preventDefault();
                        $state.go('login');
                    } else if ('data' in next && 'authorizedRoles' in next.data) {
                        var authorizedRoles = next.data.authorizedRoles;
                        if (!AuthService.isAuthorized(authorizedRoles)) {
                            event.preventDefault();
                            $state.go($state.current, {}, {reload: true});
                            $rootScope.$broadcast(API_EVENTS.notAuthorized);
                        }
                    }
                } else {
                    if (AuthService.isAuthenticated()) {
                        event.preventDefault();
                        $state.go('main.dash');
                    }
                }
            });

            $rootScope.$on('$logout', function () {
                uiService.confirm({
                        title: 'Confirm logout',
                        template: 'Are you sure you want to log out?'
                    }, function() {
                        AuthService.logout();
                        $state.go('login');
                    });
            });

            $rootScope.$on(API_EVENTS.notAuthorized, function() {
                uiService.alert({
                    title: 'Unauthorized!',
                    template: 'You are not allowed to access this resource.'
                });
            });

            $rootScope.$on(API_EVENTS.userNotAllowed, function() {
                uiService.alert({
                    title: 'Not allowed',
                    template: 'You are not able to use the app as an admin user.'
                });
            });

            $rootScope.$on(API_EVENTS.notAuthenticated, function() {
                AuthService.logout();
                AuthService.clearPassword();
                $state.go('login');
                uiService.alert({
                    title: 'Authentication expired',
                    template: 'Sorry, you have to login again.'
                });
            });

        }
    ]);