angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$state', '$ionicPopup', '$ionicSideMenuDelegate', 'MessageQueue', 'ROUTES', 'GROUPS', 'USER_ROLES', 'API_EVENTS', 'ionicMaterialInk',
        function($rootScope, $state, $ionicPopup, $ionicSideMenuDelegate, MessageQueue, ROUTES, GROUPS, USER_ROLES, API_EVENTS, ionicMaterialInk) {

            ionicMaterialInk.displayEffect();

            $rootScope.$on('ngLastRepeat.mylist',function(e) {
                ionicMaterialInk.displayEffect();
            });

            $rootScope.removeQueueMessage = MessageQueue.remove;

            function filterRoutes(Routes, role) {
                var out = [];
                for (var i in Routes) {
                    if (!isEmpty(Routes[i].items)) {
                        Routes[i].items = filterRoutes(Routes[i].items, role);
                        if (!isEmpty(Routes[i].items)) {
                            out.push(Routes[i]);
                        }
                    } else if (
                        Routes[i].data.authorizedRoles &&
                        Routes[i].data.authorizedRoles.indexOf(role) == -1
                    ) {
                        break;
                    } else {
                        out.push(Routes[i]);
                    }
                }
                return out;
            }

            $rootScope.$on('$stateChangeSuccess', function () {

                $ionicSideMenuDelegate.toggleLeft(false);
                $ionicSideMenuDelegate.toggleRight(false);

                $rootScope.menuItems = filterRoutes(
                    ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES}),
                    $rootScope.role
                );

                if ($rootScope.stopRequest && $rootScope.stopRequest instanceof Function) {
                    $rootScope.stopRequest();
                }

                if (!$state.params.keepMessageQueue) {
                    MessageQueue.remove();
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
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

            $rootScope.$on(API_EVENTS.serviceUnavailable, function() {
                $ionicPopup.alert({
                    title: 'Service unavailable',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

        }
    ]);
