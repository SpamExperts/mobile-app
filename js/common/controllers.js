angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$state', '$ionicPopup', '$ionicSideMenuDelegate', 'MessageQueue', 'ROUTES', 'GROUPS', 'USER_ROLES', 'API_EVENTS',
        function($rootScope, $state, $ionicPopup, $ionicSideMenuDelegate, MessageQueue, ROUTES, GROUPS, USER_ROLES, API_EVENTS) {

            $rootScope.menuItems = ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES});
            $rootScope.removeQueueMessage = MessageQueue.remove;

            $rootScope.$on('$stateChangeSuccess', function () {
                $ionicSideMenuDelegate.toggleLeft(false);
                $ionicSideMenuDelegate.toggleRight(false);
                if ($rootScope.stopRequest && $rootScope.stopRequest instanceof Function) {
                    $rootScope.stopRequest();
                }
            });

            $rootScope.canDragRight = function() {
                $ionicSideMenuDelegate.canDragContent(true);
            };

            $rootScope.canDragLeft = function () {
                if (
                    isEmpty($state.current.views['right-side-menu']) &&
                    !$ionicSideMenuDelegate.isOpenLeft()
                ) {
                    $ionicSideMenuDelegate.canDragContent(false);
                    $ionicSideMenuDelegate.toggleRight(false);
                }
            };

            $rootScope.logout = function() {
                $rootScope.$broadcast('$logout')
            };

            $rootScope.$on(API_EVENTS.notFound, function() {
                $ionicPopup.alert({
                    title: 'Not found!',
                    template: 'The resource you are trying to access might have been moved or is unavailable at the moment'
                });
            });

            $rootScope.$on(API_EVENTS.serverError, function() {
                $ionicPopup.alert({
                    title: 'Server error',
                    template: 'Oops! Something went wrong!%s Help us improve your experience by sending an error report'.printf('<br>')
                });
            });

        }
    ]);
