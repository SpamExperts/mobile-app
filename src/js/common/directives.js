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

                    var iFrame = document.createElement('iframe');
                    element[0].appendChild(iFrame);

                    var iFrameDocument = iFrame.contentDocument;

                    var $content = '';

                    if (scope.content) {
                        scope.content = scope.content.replace(/src=/g, 'data-src=');
                        $content = angular.element('<div>' + scope.content + '</div>');

                        $content.find('a').attr('target', '_blank');

                        var img = $content.find('img');

                        for (var i = 0; i < img.length; i++) {
                            var currentImg = angular.element(img[i]);
                            var imageHtml = currentImg.clone().wrap('<div></div>').parent().html();

                            currentImg.replaceWith(
                                '<span class="se-img-replacement" style="cursor: pointer;" data-img="' + encodeURIComponent(imageHtml) + '">click to load image</span>'
                            );
                        }
                    }

                    iFrame.style.width = '100%';

                    iFrameDocument.body.innerHTML = scope.content ? $content.html() : '';
                    iFrame.style.height = iFrameDocument.body.scrollHeight + 'px';

                    angular.element(iFrameDocument.querySelectorAll('.se-img-replacement'))
                        .on('click', function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            var elem = angular.element(this);
                            elem.replaceWith(
                                decodeURIComponent(elem.attr('data-img')).replace(/data-src=/, 'src=')
                            );
                            iFrame.style.height = iFrameDocument.body.scrollHeight + 'px';
                        });

                    angular.element(iFrameDocument.querySelectorAll('a'))
                        .on('click', function (e) {
                            e.preventDefault();
                        });
                },
                restrict: 'E',
                scope: {
                    content: '='
                }
            };
        }
    );