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
    )
    .directive('ngLastRepeat', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngLastRepeat' + (attr.ngLastRepeat ? '.' + attr.ngLastRepeat : ''));
                        });
                    }
                }
            }
        }
    ]);