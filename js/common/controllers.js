angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$scope', '$state', '$ionicPopup', '$ionicSideMenuDelegate', 'AuthService', 'MessageQueue', 'MENU_ITEMS', 'API_EVENTS',
        function($rootScope, $scope, $state, $ionicPopup, $ionicSideMenuDelegate, AuthService, MessageQueue, MENU_ITEMS, API_EVENTS) {

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

            $rootScope.$on(API_EVENTS.notFound, function() {
                $ionicPopup.alert({
                    title: 'Not found!',
                    template: 'The resource you are trying to access might have been moved or is unavailable at the moment'
                });
            });

        }
    ]);
