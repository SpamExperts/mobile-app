angular.module('SpamExpertsApp')

// notification queue directive, see template and common.js -> 'MessageQueue' factory
    .directive('messageQueue', function () {
            return {
                replace: true,
                templateUrl: 'templates/common/messageQueue.html'
            };
        }
    )
    // html message preview directive
    .directive('seMailPreview', function () {
            return {
                link: function (scope, element) {
                    var iframe = document.createElement('iframe');
                    var element0 = element[0];
                    element0.appendChild(iframe);

                    var body = iframe.contentDocument.body;

                    iframe.style.width = '100%';
                    scope.$watch('content', function () {
                        body.innerHTML = scope.content ? scope.content : '';
                        iframe.style.height = body.scrollHeight + 'px';
                    });
                },
                restrict: 'E',
                scope: {
                    content: '='
                }
            };
        }
    );