angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', '$timeout', 'uiService', 'AuthService', 'MessageQueue',
        function($scope, $state, $timeout, uiService, AuthService, MessageQueue) {

            $scope.$on('$stateChangeSuccess', function () {
                $scope.data = AuthService.getUserCredentials();
            });

            $scope.toggleRemember = function(remember) {
                AuthService.toggleRemember(remember);
            };

            $scope.login = function(data) {

                var failedPopup = {
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                };

                if (
                    isEmpty(data.hostname) ||
                    isEmpty(data.username) ||
                    isEmpty(data.password)
                ) {
                    uiService.alert(failedPopup);
                } else {
                    AuthService.login(data.hostname, data.username, data.password, data.remember)
                        .then(function(response) {
                            if (!response.data.token) {
                                if (!isEmpty(response.data.error)) {
                                    failedPopup.template = response.data.error;
                                }
                                uiService.alert(failedPopup);
                                $scope.data.password = '';
                            } else {
                                MessageQueue.remove();
                                uiService.history.clearHistory();
                                uiService.history.clearCache().then(function () {
                                    $state.go('main.dash', {}, {reload: true});
                                });
                            }
                        })
                        .catch(function () {
                            AuthService.logout();
                        });
                }
            };

            $scope.showHelper = function () {

                $timeout(function () {
                    $scope.troubleShoot =
                        uiService.popup(
                            {
                                templateUrl: 'templates/auth/help.html',
                                cssClass: 'troubleshooting',
                                scope: $scope,
                                buttons: []
                            }
                        );
                }, 250);

            };

            $scope.closeHelper = function () {
                $scope.troubleShoot.close();
            };

            $scope.groups = [
                {
                    name: 'Where can I find my hostname',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mattis nibh vitae nulla venenatis venenatis. In hac habitasse platea dictumst. Curabitur congue ipsum leo, vel convallis erat consectetur elementum.'
                },
                {
                    name: 'I forgot my username or password',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mattis nibh vitae nulla venenatis venenatis. In hac habitasse platea dictumst. Curabitur congue ipsum leo, vel convallis erat consectetur elementum. '
                }
            ];

            /*
             * if given group is the selected group, deselect it
             * else, select the given group
             */
            $scope.toggleGroup = function(group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };

            $scope.isGroupShown = function(group) {
                return $scope.shownGroup === group;
            };

        }
    ]);