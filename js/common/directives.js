angular.module('SpamExpertsApp')
    .directive('messageQueue', function () {
            return {
                replace: true,
                templateUrl: 'templates/common/messageQueue.html'
            };
        }
    )
    .directive('seCheckbox', function () {
            return {
                replace: true,
                templateUrl: 'templates/common/checkbox.html'
            };
        }
    );