SpamExpertsApp
    .directive('dynamicController', ['$controller', function($controller) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {

                var locals = {
                    $scope: scope,
                    $element: element,
                    $attrs: attrs
                };

                element.data('$Controller', $controller(scope.$eval(attrs.dynamicController), locals));
            }
        };
    }
    ]);