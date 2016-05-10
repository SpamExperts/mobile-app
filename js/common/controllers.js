angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$scope', '$state', '$ionicSideMenuDelegate', 'AuthService', 'MessageQueue', 'MENU_ITEMS',
        function($rootScope, $scope, $state, $ionicSideMenuDelegate, AuthService, MessageQueue, MENU_ITEMS) {

            $scope.menuItems = MENU_ITEMS;
            $scope.removeQueueMessage = MessageQueue.remove;

            $scope.$on('$stateChangeSuccess', function () {
                $ionicSideMenuDelegate.toggleLeft(false);
                $ionicSideMenuDelegate.toggleRight(false);
            });

            $scope.canDragRight = function() {
                $ionicSideMenuDelegate.canDragContent(true);
            };

            $scope.canDragLeft = function () {
                if (
                    isEmpty($state.current.views['right-side-menu']) &&
                    !$ionicSideMenuDelegate.isOpenLeft()
                ) {
                    $ionicSideMenuDelegate.canDragContent(false);
                    $ionicSideMenuDelegate.toggleRight(false);
                }
            };

            $scope.logout = function() {
                $rootScope.$broadcast('$logout')
            };
        }
    ]);
