angular.module('SpamExpertsApp')
    .run(['$rootScope', '$state', 'AuthService', 'AlertDialog', 'API_EVENTS',
        function ($rootScope, $state, AuthService, AlertDialog, API_EVENTS) {

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
                }
            });

            $rootScope.$on('$logout', function () {
                AlertDialog
                    .confirm({
                        title: 'Confirm logout',
                        template: 'Are you sure you want to log out?'
                    })
                    .then(function(choice) {
                        if (choice) {
                            AuthService.logout();
                            $state.go('login', {}, {reload: true});
                            // $ionicHistory.clearHistory();
                            // $ionicHistory.clearCache().then(function() {
                            //    window.location.reload();
                            // });
                        }
                    });
            });

            $rootScope.$on(API_EVENTS.notAuthorized, function() {
                AlertDialog.alert({
                    title: 'Unauthorized!',
                    template: 'You are not allowed to access this resource.'
                });
            });

            $rootScope.$on(API_EVENTS.notAuthenticated, function() {
                AuthService.logout();
                AuthService.clearPassword();
                $state.go('login');
                AlertDialog.alert({
                    title: 'Authentication expired',
                    template: 'Sorry, you have to login again.'
                });
            });

        }
    ]);