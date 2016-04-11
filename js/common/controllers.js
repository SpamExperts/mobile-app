SpamExpertsApp
    .controller('AppCtrl', ['$scope', '$state', '$ionicPopup', '$ionicSideMenuDelegate', '$ionicActionSheet', 'AuthService', 'MessageQueue', 'AUTH_EVENTS', 'MENU_ITEMS',
        function($scope, $state, $ionicPopup, $ionicSideMenuDelegate, $ionicActionSheet, AuthService, MessageQueue, AUTH_EVENTS, MENU_ITEMS) {
            $scope.username = AuthService.username();

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

            $scope.setCurrentUsername = function(name) {
                $scope.username = name;
            };

            $scope.menuItems = MENU_ITEMS;

            $scope.$on('$stateChangeSuccess', function () {
                $scope.selectedAll = false;
                $scope.bulkMode = false;
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

            $scope.bulkMode = false;
            $scope.selectedAll = false;

            $scope.selectEntry = function(index) {
                $scope.bulkManager.service.selectMessage(index);
                $scope.bulkMode = $scope.bulkManager.service.isBulkMode();
            };
            $scope.selectAll = function (toggle) {
                $scope.selectedAll = toggle;
                $scope.bulkManager.service.selectAll($scope.selectedAll);
                $scope.bulkMode = $scope.bulkManager.service.isBulkMode();
            };

            $scope.showBulkActions = function () {
                var actionSheet = $ionicActionSheet.show({
                    buttons: $scope.bulkManager.actions,
                    titleText: 'Select Actions',
                    cancelText: 'Cancel',
                    cancel: function() {
                        actionSheet();
                    },
                    buttonClicked: function(i, action) {
                        $ionicPopup
                            .confirm({
                                title: 'Confirm action',
                                template: action.confirmText
                            })
                            .then(function(res) {
                                if (res) {
                                    $scope.bulkManager.service
                                        .bulkAction(action.name)
                                        .then(function () {
                                            $state.go($state.current, {}, {reload: true});
                                            $scope.$broadcast('refreshEntries');
                                            $scope.bulkMode = false;
                                        });
                                }
                            });
                        return true;
                    }
                })
            };
        }
    ]);
