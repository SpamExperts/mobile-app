angular.module('SpamExpertsApp')
    .factory('$localstorage', ['$window',
        function($window) {

            cleanup();

            function cleanup() {
                if (!isEmpty($window.localStorage['volatile'])) {
                    var volatile = $window.localStorage['volatile'].split(',');
                    for (var item in $window.localStorage) {
                        for (var j in volatile) {
                            if (
                                !isEmpty(volatile[j]) &&
                                item.indexOf(volatile[j]) === 0
                            ) {
                                $window.localStorage.removeItem(item);
                            }
                        }
                    }
                }
                $window.localStorage['volatile'] = '';
            }

            function unpack(original, store) {
                var unpacked = {};

                function unpackObject(obj, key) {

                    for (var i in obj) {
                        var ind = key ? key + '.' + i : i;
                        if (typeof obj[i] === 'object') {
                            unpackObject(obj[i], ind);
                        } else {
                            if (typeof store !== 'undefined') {
                                store[ind] = obj[i];
                            } else {
                                unpacked[ind] = obj[i];
                            }
                        }
                    }
                }

                unpackObject(original);

                if (typeof store !== 'undefined') {
                    return unpacked;
                }
            }

            function pack(unpacked, keyStarter) {

                function packObject(obj, path, value) {
                    if (
                        typeof path !== 'string' &&
                        typeof obj[path[0]] === 'undefined'
                    ) {
                        obj[path[0]] = {};
                    }

                    if (typeof path == 'string') {
                        return packObject(obj, path.split('.'), value);
                    }
                    else if (path.length == 1 && value !== undefined) {
                        return obj[path[0]] = value;
                    }
                    else if (path.length == 0) {
                        return obj;
                    }
                    else {
                        return packObject(obj[path[0]], path.slice(1), value);
                    }
                }

                var original = {};

                if (!keyStarter.split('.').length) {
                    keyStarter += '.';
                }

                for (var i in unpacked) {
                    if (i.indexOf(keyStarter) === 0) {
                        var key = i.replace(keyStarter, '');
                        packObject(original, key, unpacked[i]);
                    }

                }
                return original[''];
            }

            return {
                get: function (key, defaultValue, isVolatile) {
                    if (isEmpty(defaultValue)) defaultValue = {};

                    var unpack = pack($window.localStorage, key);

                    if (isEmpty(unpack) && !isEmpty(defaultValue)) {
                        this.set(key, defaultValue, isVolatile);
                        return defaultValue;
                    } else {
                        return unpack;
                    }
                },

                set: function (key, value, isVolatile) {
                    if (!isEmpty(value)) {
                        var object = {};
                        if (isVolatile) {
                            var volatile = $window.localStorage['volatile'].split(',');
                            if (-1 === volatile.indexOf(key)) {
                                volatile.push(key);
                                $window.localStorage['volatile'] = volatile.join(',')
                            }
                        }
                        object[key] = value;
                        unpack(object, $window.localStorage);
                    }
                },
                cleanup: cleanup
            };
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

            var token      = $localstorage.get('token');
            var usingToken = false;


            if (!angular.equals({}, token)) {
                setToken(token);
            }

            function setAuth(username, password) {
                var authorization = '';

                if (typeof username !== 'undefined' &&
                    typeof password !== 'undefined'
                ) {
                    authorization = Base64.encode(username + ':' + password);
                }

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authorization;
            }

            function setToken(token) {
                usingToken = !!token;
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            }


            $http.defaults.transformResponse.push(function (response) {
                if (response.body) {
                    if (response.body['messageQueue']) {
                        MessageQueue.set(response.body['messageQueue']);
                    }
                    if (response['token']) {
                        response.body.token = response['token'];
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + response['token'];
                    }
                    return response.body;
                } else {
                    return response;
                }
            });

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
                request: function (params, hostname) {
                    var host;

                    if (!isEmpty(params['hostname'])) {
                        host =  params['hostname'];
                    } else {
                        host = $localstorage.get('settings.hostname');
                    }

                    if (isEmpty(host)) {
                        MessageQueue.set({'error': ['Hostname is empty']});
                        return;
                    }

                    var baseEndpoint = this.protocol + host;

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