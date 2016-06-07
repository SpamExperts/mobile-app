angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$state', '$mdSidenav', 'MessageQueue', 'AlertDialog', 'ROUTES', 'GROUPS', 'USER_ROLES', 'API_EVENTS',
        function($rootScope, $state, $mdSidenav, MessageQueue, AlertDialog, ROUTES, GROUPS, USER_ROLES, API_EVENTS) {

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

            $rootScope.isSidenavOpen = false;
            $rootScope.risSidenavOpen = false;

            $rootScope.canDragLeft = false;

            $rootScope.openLeftMenu = function() {
                $mdSidenav('left').toggle();
            };

            $rootScope.openRightMenu = function() {
                $mdSidenav('right').toggle();
            };

            $rootScope.items = [];
            for (var i = 0; i < 1000; i++) {
                $rootScope.items.push(i);
            }

            $rootScope.$on('$stateChangeSuccess', function () {


                $rootScope.menuItems = filterRoutes(
                    ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES}),
                    $rootScope.role
                );
                
                $rootScope.canDragLeft =  
                    !isEmpty($state.current.views) && 
                    !isEmpty($state.current.views['right-side-menu']);


                if ($rootScope.stopRequest && $rootScope.stopRequest instanceof Function) {
                    $rootScope.stopRequest();
                }

                if (!$state.params.keepMessageQueue) {
                    MessageQueue.remove();
                }
            });


            $rootScope.logout = function() {
                $rootScope.$broadcast('$logout')
            };

            $rootScope.$on(API_EVENTS.notFound, function() {
                AlertDialog.alert({
                    title: 'Not found!',
                    template: 'The resource you are trying to access might have been moved or is unavailable at the moment'
                });
            });
            
            $rootScope.$on(API_EVENTS.serverError, function() {
                AlertDialog.alert({
                    title: 'Server error',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });
            
            $rootScope.$on(API_EVENTS.serviceUnavailable, function() {
                AlertDialog.alert({
                    title: 'Service unavailable',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

        }
    ]);
