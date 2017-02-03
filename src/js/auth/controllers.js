angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', 'uiService', 'AuthService', 'MessageQueue',
        function($scope, $state, uiService, AuthService, MessageQueue) {
            $scope.isShowingHelp = false;

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
                                uiService.alert(failedPopup);
                                $scope.data.password = '';
                            } else {
                                MessageQueue.remove();
                                $state.go('main.dash', {}, {reload: true});
                            }
                        });
                }
            };

            $scope.showHelper = function () {
                $scope.isShowingHelp = true;
                $scope.troubleShoot =
                    uiService.popup(
                        {
                            templateUrl: 'templates/auth/help.html',
                            cssClass: 'troubleshooting',
                            scope: $scope,
                            buttons: []
                        }
                    );
            };

            $scope.closeHelper = function () {
                $scope.isShowingHelp = false;
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