angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$state', 'uiService', 'MessageQueue', 'ROUTES', 'GROUPS', 'USER_ROLES', 'API_EVENTS',
        function($rootScope, $state, uiService, MessageQueue, ROUTES, GROUPS, USER_ROLES, API_EVENTS) {

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

                uiService.sideMenuDelegate.toggleLeft(false);
                uiService.sideMenuDelegate.toggleRight(false);

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

            $rootScope.closeLeft = function () {
                uiService.sideMenuDelegate.toggleLeft(false);
            };

            $rootScope.closeRight = function () {
                uiService.sideMenuDelegate.toggleRight(false);
            };

            $rootScope.canDragRight = function() {
                uiService.sideMenuDelegate.canDragContent(true);
            };

            $rootScope.canDragLeft = function () {
                if (
                    isEmpty($state.current.views['right-side-menu']) &&
                    !uiService.sideMenuDelegate.isOpenLeft()
                ) {
                    uiService.sideMenuDelegate.canDragContent(false);
                    uiService.sideMenuDelegate.toggleRight(false);
                }
            };

            $rootScope.logout = function() {
                $rootScope.$broadcast('$logout')
            };

            $rootScope.$on(API_EVENTS.notFound, function() {
                uiService.alert({
                    title: 'Not found!',
                    template: 'The resource you are trying to access might have been moved or is unavailable at the moment'
                });
            });

            $rootScope.$on(API_EVENTS.serverError, function() {
                uiService.alert({
                    title: 'Server error',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

            $rootScope.$on(API_EVENTS.serviceUnavailable, function() {
                uiService.alert({
                    title: 'Service unavailable',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

        }
    ]);
