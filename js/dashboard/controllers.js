SpamExpertsApp
    .controller('DashCtrl', ['$scope', '$state', '$http', '$ionicPopup', '$localstorage', 'AuthService',
        function($scope, $state, $http, $ionicPopup, $localstorage, AuthService) {
            console.log('DashCtrl');

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };

            var settings = $localstorage.get('settings');
            var url = 'http://' + settings.hostname + '/api/log/search/action/test';

            $scope.performValidRequest = function() {
                $http.get(url).then(
                    function(result) {
                        $scope.response = result;
                    });
            };

            $scope.performUnauthorizedRequest = function() {
                $http.get('http://localhost:8100/notauthorized').then(
                    function(result) {
                        // No result here..
                    }, function(err) {
                        $scope.response = err;
                    });
            };

            $scope.performInvalidRequest = function() {
                $http.get('http://localhost:8100/notauthenticated').then(
                    function(result) {
                        // No result here..
                    }, function(err) {
                        $scope.response = err;
                    });
            };
        }
    ]);