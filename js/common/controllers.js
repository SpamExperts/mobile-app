angular.module('SpamExpertsApp')
    .controller('AppCtrl', ['$scope', '$state', '$ionicPopup', '$ionicSideMenuDelegate', 'AuthService', 'MessageQueue', 'AUTH_EVENTS', 'MENU_ITEMS',
        function($scope, $state, $ionicPopup, $ionicSideMenuDelegate, AuthService, MessageQueue, AUTH_EVENTS, MENU_ITEMS) {

            $scope.removeQueueMessage = function(item) {
                delete $scope.messageQueue[item];
                MessageQueue.set($scope.messageQueue);
            };

            $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
                $ionicPopup.alert({
                    title: 'Unauthorized!',
                    template: 'You are not allowed to access this resource.'
                });
            });

            $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
                AuthService.logout();
                $state.go('login');
                $ionicPopup.alert({
                    title: 'Session Lost!',
                    template: 'Sorry, You have to login again.'
                });
            });

            $scope.logout = function() {
                $ionicPopup
                    .confirm({
                        title: 'Confirm action',
                        template: 'Are you sure you want to log out?'
                    })
                    .then(function(choice) {
                        if (choice) {
                            AuthService.logout();
                            $state.go('login');
                        }
                    });
            };

            $scope.menuItems = MENU_ITEMS;

            $scope.$on('$stateChangeSuccess', function () {

                $scope.username = AuthService.username();
                $scope.role = AuthService.role();

                $ionicSideMenuDelegate.toggleLeft(false);
                $ionicSideMenuDelegate.toggleRight(false);
            });

            $scope.canDragRight = function() {
                $ionicSideMenuDelegate.canDragContent(true);
            };

            $scope.canDragLeft = function () {
                if (
                    typeof $state.current.views['right-side-menu'] === 'undefined' &&
                    !$ionicSideMenuDelegate.isOpenLeft()
                ) {
                    $ionicSideMenuDelegate.canDragContent(false);
                    $ionicSideMenuDelegate.toggleRight(false);
                }
            };

        }
    ]);
