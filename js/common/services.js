SpamExpertsApp
    .factory('$localstorage', ['$window',
        function($window) {

            if (typeof window.localStorage['persistent'] === 'undefined') {
                $window.localStorage['persistent'] = '{}';
            }

            $window.localStorage['volatile'] = '{}';

            return {
                get: function(key, defaultValue, isVolatile) {

                    if (!defaultValue) defaultValue = {};

                    var persistent = JSON.parse(window.localStorage['persistent']);
                    var volatile   = JSON.parse(window.localStorage['volatile']);

                    if (
                        angular.isDefined(persistent[key]) &&
                        !angular.equals({}, persistent[key])
                    ) {
                        return persistent[key];
                    } else {
                        if (
                            angular.isDefined(volatile[key]) &&
                            !angular.equals({}, volatile[key])
                        ) {
                            return volatile[key];
                        } else {
                            this.set(key, defaultValue, isVolatile);
                            return defaultValue;
                        }
                    }
                },
                set: function(key, value, isVolatile) {

                    var persistent = JSON.parse(window.localStorage['persistent']);
                    var volatile   = JSON.parse(window.localStorage['volatile']);

                    if (isVolatile) {
                        volatile[key]   = value;
                        delete persistent[key];
                    } else {
                        persistent[key] = value;
                        delete volatile[key];
                    }
                    $window.localStorage['persistent'] = JSON.stringify(persistent);
                    $window.localStorage['volatile']   = JSON.stringify(volatile);
                },
                cleanup: function () {
                    $window.localStorage['volatile'] = '{}';
                }
            }
        }
    ])
    .factory('Base64', function () {

            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            return {
                encode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    do {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output +
                            keyStr.charAt(enc1) +
                            keyStr.charAt(enc2) +
                            keyStr.charAt(enc3) +
                            keyStr.charAt(enc4);
                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";
                    } while (i < input.length);

                    return output;
                }
            }
        }
    )
    .factory('MessageQueue', ['$rootScope',
        function ($rootScope) {

            return {
                set: function (messageQueue) {
                    if (
                        angular.isArray(messageQueue) ||
                        (
                            isEmpty(messageQueue.error) &&
                            isEmpty(messageQueue.notice) &&
                            isEmpty(messageQueue.success)
                        )
                    ) {
                        messageQueue = null;
                    }
                    $rootScope.messageQueue = messageQueue;
                }
            };
        }
    ])
    .factory('Api', ['$http', '$localstorage', 'MessageQueue','Base64', 'ENDPOINTS',
        function($http, $localstorage, MessageQueue, Base64, ENDPOINTS) {

            var settings = $localstorage.get('settings');
            var token    = $localstorage.get('token');
            var usingToken= false;

            if (!angular.equals({}, token)) {
                setToken(token);
            }

            function setAuth(username, password) {
                var authorization = '';

                if (typeof username !== 'undefined' &&
                    typeof password !== 'undefined'
                ) {
                    authorization = Base64.encode(username + ':' + password);
                    $http.defaults.headers.common['X-Auth-Token'] = undefined;
                }

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authorization;
            }

            function setToken(token) {
                if (!token) {
                    token = undefined;
                    $http.defaults.headers.common['Authorization'] = 'Basic ';
                    usingToken = false;
                } else {
                    usingToken = true;
                }

                $http.defaults.headers.common['X-Auth-Token'] = token;
            }

            return {
                protocol: 'http://',
                useHttps: function() {
                    this.protocol = "https://";
                },
                isUsingToken: function () {
                    return usingToken;
                },
                setAuth: setAuth,
                setToken: setToken,
                request: function (params) {
                    var baseEndpoint = this.protocol + settings.hostname;

                    var defaultParams = {
                        direction : null,
                        resource  : null,
                        action    : null,
                        urlParams : null,
                        requestParams: null
                    };

                    angular.merge(defaultParams, params);

                    var request;

                    if (params.direction) {
                        request = ENDPOINTS[params.direction][params.resource];
                    } else {
                        request = ENDPOINTS[params.resource];
                    }

                    if (params.action) {
                        request = request[params.action];
                    }

                    $http.defaults.transformResponse.push(function (response) {
                        if (response.body) {
                            if (response.body['messageQueue']) {
                                MessageQueue.set(response.body['messageQueue']);
                            }
                            return response.body;
                        } else {
                            return response;
                        }
                    });

                    switch (request.method) {
                        case 'GET':
                            return $http.get(baseEndpoint + request.endpoint.printf(params.urlParams), {params: params.requestParams, paramSerializer: '$httpParamSerializerJQLike'});
                        case 'PUT':
                            return $http.put(baseEndpoint + request.endpoint.printf(params.urlParams), params.requestParams);
                        case 'POST':
                            return $http.post(baseEndpoint + request.endpoint.printf(params.urlParams), params.requestParams);
                        case 'DELETE':
                            return $http.delete(baseEndpoint + request.endpoint.printf(params.urlParams), {params: params.requestParams});
                    }
                }
            };
        }
    ]);