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

                        var volatile = $window.localStorage['volatile'];
                        if (isEmpty(volatile)) {
                            volatile = [];
                        } else {
                            volatile = volatile.split(',');
                        }
                        var p = volatile.indexOf(key);

                        if (isVolatile === true && p == -1) {
                            volatile.push(key.split('.')[0]);
                        } else if(-1 < p) {
                            volatile = volatile.splice(p, 1);
                        }

                        $window.localStorage['volatile'] = volatile.join(',');

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
    .factory('MessageQueue', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                remove: function (item) {
                    if (isEmpty(item)) {
                        $rootScope.messageQueue = [];
                    } else {
                        $rootScope.messageQueue[item] = [];
                    }
                },
                set: function (messageQueue) {
                    $rootScope.messageQueue = angular.merge({}, $rootScope.messageQueue, messageQueue);
                    $timeout(this.remove, 10000);
                }
            };
        }
    ])
    .factory('filterPermissions', ['AuthService', 'USER_ROLES', 'GROUPS',
        function (AuthService, USER_ROLES, GROUPS) {
            return function (collection, params, constants) {
                angular.merge(
                    params,
                    {
                        role: AuthService.getRole()
                    }
                );

                angular.merge(
                    constants,
                    {
                        USER_ROLES: USER_ROLES,
                        GROUPS: GROUPS
                    }
                );

                var allowed = [];
                angular.forEach(collection, function (entry) {
                    if (
                        typeof entry.condition == 'function' &&
                        !entry.condition(params, constants)
                    ) {
                        return;
                    }
                    this.push(entry);

                }, allowed);

                return allowed;
            }
        }
    ])
    .factory('Api', ['$http', '$q', '$localstorage', 'MessageQueue','Base64', 'ENDPOINTS',
        function($http, $q, $localstorage, MessageQueue, Base64, ENDPOINTS) {

            return {
                protocol: 'http://',
                useHttps: function() {
                    this.protocol = "https://";
                },
                setAuth: function (username, password) {
                    var authorization = Base64.encode(username + ':' + password);
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authorization;
                },
                clearAuth: function () {
                    $http.defaults.headers.common['Authorization'] = 'Bearer ';
                },
                request: function (params) {
                    var host;

                    if (!isEmpty(params['hostname'])) {
                        host =  params['hostname'];
                    } else {
                        host = $localstorage.get('settings.hostname');
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
                            return $http.get(
                                baseEndpoint + request.endpoint.printf(params.urlParams),
                                {
                                    params: params.requestParams,
                                    paramSerializer: '$httpParamSerializerJQLike',
                                    responseKey: !isEmpty(params.responseKey) ? params.responseKey : '',
                                    loading: request.loading === true,
                                    cancelLoading: request.cancelLoading
                                }
                            );

                        case 'PUT':
                            return $http.put(
                                baseEndpoint + request.endpoint.printf(params.urlParams),
                                params.requestParams,
                                {
                                    responseKey: !isEmpty(params.responseKey) ? params.responseKey : '',
                                    loading: request.loading === true,
                                    cancelLoading: request.cancelLoading
                                }
                            );

                        case 'POST':
                            return $http.post(
                                baseEndpoint + request.endpoint.printf(params.urlParams),
                                params.requestParams,
                                {
                                    responseKey: !isEmpty(params.responseKey) ? params.responseKey : '',
                                    loading: request.loading === true,
                                    cancelLoading: request.cancelLoading
                                }
                            );

                        case 'DELETE':
                            return $http.delete(
                                baseEndpoint + request.endpoint.printf(params.urlParams),
                                {
                                    params: params.requestParams,
                                    responseKey: !isEmpty(params.responseKey) ? params.responseKey : '',
                                    loading: request.loading === true,
                                    cancelLoading: request.cancelLoading
                                }
                            );
                    }
                }
            };
        }
    ])
    .factory('BusyService', ['$ionicLoading',
        function($ionicLoading) {
            return {
                show: function($scope) {
                    $ionicLoading.show({
                        templateUrl: 'templates/common/loading.html',
                        scope: $scope,
                        animation: 'fade-in',
                        showBackdrop: true,
                        showDelay: 300
                    });
                },

                hide: function() {
                    $ionicLoading.hide();
                }
            };
        }
    ])
    .factory('ApiInterceptor', ['$q', '$rootScope', '$injector', '$timeout', '$localstorage', 'MessageQueue', 'AUTH_EVENTS',
        function ($q, $rootScope, $injector, $timeout, $localstorage, MessageQueue, AUTH_EVENTS) {
            return {
                request: function(config) {

                    if (config.loading === true) {
                        var canceller = $q.defer();
                        var scope = $rootScope.$new(true);

                        config.timeout = canceller.promise;

                        scope.cancelLoading = false;

                        $timeout(function () {
                            scope.cancelLoading = config.cancelLoading === true;
                        }, 5000);

                        scope.stopRequest = function () { canceller.resolve(); };

                        $injector.get('BusyService').show(scope);
                    }

                    if (
                        config.hasOwnProperty('params') ||
                        config.hasOwnProperty('responseKey')
                    ) {

                        var authHeader = config.headers['Authorization'];

                        if (isEmpty(authHeader) || authHeader.indexOf('Basic') == -1) {
                            var token = $localstorage.get('token', '');
                            config.headers['Authorization'] = 'Bearer ' + $localstorage.get('token');
                        }
                    }
                    return config || $q.when(config);
                },
                response: function (response) {
                    if (
                        !isEmpty(response.config.params) ||
                        response.config.hasOwnProperty('responseKey')
                    ) {

                        var data = response.data;
                        var key = !isEmpty(response.config.responseKey) ? response.config.responseKey : 'body';

                        if (data['body'].hasOwnProperty('messageQueue')) {
                            MessageQueue.set(data['body']['messageQueue']);
                        }

                        if (!isEmpty(data['token'])) {
                            $localstorage.set('token', data['token'],
                                ($localstorage.get('settings.remember') != 'enabled')
                            );
                            data[key].token = data['token'];
                        }

                        response.data = data[key];
                    }
                    if (response.config.loading === true) {
                        $injector.get('BusyService').hide();
                    }

                    return response;
                },
                responseError: function (response) {
                    $injector.get('BusyService').hide();

                    if (response.status == 500) {
                        MessageQueue.set({error: ['An error occurred while trying to perform a server request']});
                    } else {
                        $rootScope.$broadcast({
                            401: AUTH_EVENTS.notAuthenticated,
                            403: AUTH_EVENTS.notAuthorized
                        }[response.status], response);
                    }
                    return $q.reject(response);
                }
            };
        }
    ]);