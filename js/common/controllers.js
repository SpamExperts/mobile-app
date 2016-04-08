SpamExpertsApp
    .controller('AppCtrl', function($scope, $state, $ionicPopup, $location, $ionicSideMenuDelegate, AuthService, AUTH_EVENTS) {
        $scope.username = AuthService.username();

        $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'You are not allowed to access this resource.'
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
            AuthService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Session Lost!',
                template: 'Sorry, You have to login again.'
            });
        });

        $scope.setCurrentUsername = function(name) {
            $scope.username = name;
        };

        $scope.menuItems = [
            {
                title: 'Dashboard',
                icon: 'ion-ios-gear-outline',
                route: '/dash'
            },
            {
                title: 'Incoming',
                icon: 'ion-log-in',
                route: '/incoming'
            },
            {
                title: 'Outgoing',
                icon: 'ion-log-out',
                route: '/outgoing'
            }
        ];

        $ionicSideMenuDelegate.toggleLeft(false);
        $ionicSideMenuDelegate.toggleRight(false);

        $scope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
            $ionicSideMenuDelegate.toggleLeft(false);
            $ionicSideMenuDelegate.toggleRight(false);
        });

        $scope.$on('$stateChangeSuccess', function (event,next, nextParams, fromState) {
            $scope.rightSideMenu = $state.current.rightSideMenu;
        });

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.getGroup = function () {
            return $state.current.group || '';
        };

        $scope.onDragLeft = function() {
            $ionicSideMenuDelegate.toggleLeft(false);
            $ionicSideMenuDelegate.canDragContent(false);
        };
        $scope.onDragRight = function() {
            $ionicSideMenuDelegate.canDragContent(true);
        };
    })

;
