angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$state', '$filter', '$timeout', 'uiService', 'MessageQueue', 'ROUTES', 'GROUPS', 'USER_ROLES', 'API_EVENTS',
        function($rootScope, $state, $filter, $timeout, uiService, MessageQueue, ROUTES, GROUPS, USER_ROLES, API_EVENTS) {

            $rootScope.removeQueueMessage = MessageQueue.remove;

            // Filter routes based on current role to get the menu items
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

                // we should always close the side-menu when changing routes
                uiService.sideMenuDelegate.toggleLeft(false);
                uiService.sideMenuDelegate.toggleRight(false);

                // get the menu items
                $rootScope.menuItems = filterRoutes(
                    ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES}),
                    $rootScope.role
                );

                // we should stop pending requests when changing routes (happens only for infinite-scroll and pull-to-refresh)
                if ($rootScope.stopRequest && $rootScope.stopRequest instanceof Function) {
                    $rootScope.stopRequest();
                }

                // depending on the keepMessageQueue state param we keep or discard the notification queue
                if (!$state.params.keepMessageQueue) {
                    MessageQueue.remove();
                }
            });

            $rootScope.forceScrollUpdate = function (time) {
                var scrollView = uiService.scrollDelegate.getScrollView();
                if (scrollView) {
                    $timeout(function () {
                        uiService.scrollDelegate.resize();
                    }, time);
                }
            };

            $rootScope.isSuperAdmin = function () {
                return $rootScope.role === USER_ROLES.admin;
            };

            $rootScope.getCurrentYear = function () {
                return $filter('date')(new Date(), 'yyyy')
            };

            $rootScope.getDate = function (date, format) {
                date = new Date(date.replace(/-/g, '/'));
                return $filter('date')(date, format)
            };

            $rootScope.kConvert = function (value) {
                return uiService.kConvert(value);
            };

            // allow closing left menu using swipe
            $rootScope.closeLeft = function () {
                uiService.sideMenuDelegate.toggleLeft(false);
            };

            // allow closing right menu using swipe
            $rootScope.closeRight = function () {
                uiService.sideMenuDelegate.toggleRight(false);
            };

            $rootScope.toggleLeftMenu = function ($event) {
                if ($event) $event.stopPropagation();

                if (!$rootScope.bulkMode) {
                    uiService.sideMenuDelegate.toggleLeft();
                }
            };

            $rootScope.toggleRightMenu = function ($event) {
                if ($event) $event.stopPropagation();

                if (!$rootScope.bulkMode) {
                    uiService.sideMenuDelegate.toggleRight();
                }
            };

            // we should always be able to open LEFT side menu unless we're in bulk mode
            $rootScope.canDragRight = function() {
                if (!$rootScope.bulkMode) {
                    uiService.sideMenuDelegate.canDragContent(true);
                } else {
                    uiService.sideMenuDelegate.canDragContent(false);
                    uiService.sideMenuDelegate.toggleLeft(false);
                }
            };

            // we should be able to open the right side menu if there is one and we're not in bulk mode
            $rootScope.canDragLeft = function () {
                if (
                    isEmpty($state.current.views['right-side-menu']) &&
                    !uiService.sideMenuDelegate.isOpenLeft()
                    && !$rootScope.bulkMode
                ) {
                    uiService.sideMenuDelegate.canDragContent(false);
                    uiService.sideMenuDelegate.toggleRight(false);
                }
            };

            // Tap to top utility
            $rootScope.scrollTop = function() {
                uiService.scrollDelegate.scrollTop();
            };

            // broadcast the logout event - see Auth init $rootScope.$on('$logout')
            $rootScope.logout = function() {
                $rootScope.$broadcast('$logout')
            };

            // handle 404 http status
            $rootScope.$on(API_EVENTS.notFound, function() {
                uiService.alert({
                    title: 'Not found!',
                    template: 'The resource you are trying to access might have been moved or is unavailable at the moment'
                });
            });

            // handle 500 http status
            $rootScope.$on(API_EVENTS.serverError, function() {
                uiService.alert({
                    title: 'Server error',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

            // handle 503 http error
            $rootScope.$on(API_EVENTS.serviceUnavailable, function() {
                uiService.alert({
                    title: 'Service unavailable',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

        }
    ]);
