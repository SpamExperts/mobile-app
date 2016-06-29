angular.module('SpamExpertsApp')

    // notification queue directive, see template and common.js -> 'MessageQueue' factory
    .directive('messageQueue', function () {
            return {
                replace: true,
                templateUrl: 'templates/common/messageQueue.html'
            };
        }
    )

    // round message list checkbox directive
    .directive('seCheckbox', function () {
            return {
                replace: true,
                templateUrl: 'templates/common/checkbox.html'
            };
        }
    );