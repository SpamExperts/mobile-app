angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', '$ionicPopup', 'AuthService',
        function($scope, $state, $ionicPopup, AuthService) {

            $scope.data = AuthService.getUserCredentials();

            $scope.login = function(data) {

                AuthService.login(data.hostname, data.username, data.password, data.remember)
                    .then(function(response) {
                        console.log(response);
                        if (!response.data.token) {
                            $ionicPopup.alert({
                                title: 'Login failed!',
                                template: 'Please check your credentials!'
                            });
                        } else {
                            $state.go('main.dash', {}, {reload: true});
                            $scope.setCurrentUsername(data.username);
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