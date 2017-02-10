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
                    if (!scope.content) return;

                    var iframe = document.createElement('iframe');
                    var element0 = element[0];
                    element0.appendChild(iframe);

                    var iDoc = iframe.contentDocument;
                    iframe.style.width = '100%';


                    iDoc.body.innerHTML = scope.content ? scope.content : '';
                    iframe.style.height = iDoc.body.scrollHeight + 'px';

                    var $iframe = angular.element(iDoc.body);

                    $iframe.find('a').attr('target', '_blank');

                    var img = $iframe.find('img');

                    for (var i = 0; i < img.length; i++) {
                        var currentImg = angular.element(img[i]);
                        var imageHtml = currentImg.clone().wrap('<div></div>').parent().html();

                        currentImg.replaceWith(
                            '<span class="se-img-replacement" style="cursor: pointer;">click to load image</span>'
                        );

                        angular.element(iDoc.querySelectorAll('.se-img-replacement')[i])
                            .data('img', imageHtml)
                            .on('click', function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                var elem = angular.element(this);
                                elem.replaceWith(elem.data('img'));
                            });
                    }

                },
                restrict: 'E',
                scope: {
                    content: '='
                }
            };
        }
    );