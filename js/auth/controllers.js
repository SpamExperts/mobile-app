angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', '$ionicPopup', 'AuthService',
        function($scope, $state, $ionicPopup, AuthService) {

            $scope.$on('$stateChangeSuccess', function () {
                $scope.data = AuthService.getUserCredentials();
            });

            $scope.login = function(data) {

                AuthService.login(data.hostname, data.username, data.password, data.remember)
                    .then(function(response) {
                        if (!response.data.token) {
                            $ionicPopup.alert({
                                title: 'Login failed!',
                                template: 'Please check your credentials!'
                            });
                        } else {
                            $state.go('main.dash', {}, {reload: true});
                        }

                    }, function(err) {
                        $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    });
            };
        }
    ]);