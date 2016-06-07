angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', 'AuthService', 'AlertDialog', 'MessageQueue',
        function($scope, $state, AuthService, AlertDialog, MessageQueue) {

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
                    AlertDialog.alert(failedPopup);
                } else {
                    AuthService.login(data.hostname, data.username, data.password, data.remember)
                        .then(function(response) {
                            if (!response.data.token) {
                                AlertDialog.alert(failedPopup);
                                $scope.data.password = '';
                            } else {
                                MessageQueue.remove();
                                $state.go('main.dash', {}, {reload: true});
                            }
                        });
                }
            };
        }
    ]);