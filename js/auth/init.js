angular.module('SpamExpertsApp')
    .run(['$rootScope', '$state', '$ionicHistory', '$ionicPopup', 'AuthService', 'AUTH_EVENTS',
        function ($rootScope, $state, $ionicHistory, $ionicPopup, AuthService, AUTH_EVENTS) {

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
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        }
                    }
                }
            });

            $rootScope.$on('$logout', function () {
                $ionicPopup
                    .confirm({
                        title: 'Confirm action',
                        template: 'Are you sure you want to log out?'
                    })
                    .then(function(choice) {
                        if (choice) {
                            AuthService.logout();
                            $ionicHistory.clearHistory();
                            $state.go('login', {}, {reload: true});
                        }
                    });
            });

            $rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
                $ionicPopup.alert({
                    title: 'Unauthorized!',
                    template: 'You are not allowed to access this resource.'
                });
            });

            $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
                AuthService.logout();
                $state.go('login');
                $ionicPopup.alert({
                    title: 'Session Lost!',
                    template: 'Sorry, You have to login again.'
                });
            });

        }
    ]);