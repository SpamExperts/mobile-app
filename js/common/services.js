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
                },
                cleanup: cleanup
            };
        }
    ])
    .factory('MessageQueue', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            var queueTimer;
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
                    if (queueTimer) {
                        $timeout.cancel(queueTimer);
                    }
                    queueTimer = $timeout(this.remove, 10000);
                }
            };
        }
    ])
    .factory('filterPermissions', ['$state', 'AuthService', 'USER_ROLES', 'GROUPS',
        function ($state, AuthService, USER_ROLES, GROUPS) {
            return function (collection, params, constants) {

                if (isEmpty(params)) { params = {}; }
                if (isEmpty(constants)) { constants = {};}

                angular.merge(
                    params,
                    {
                        role: AuthService.getRole(),
                        direction: (params['direction'] ? params['direction'] : $state.current.data.group)
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
    .factory('NetworkService', ['$rootScope', '$cordovaNetwork', '$ionicLoading', '$q', '$timeout',
        function($rootScope, $cordovaNetwork, $ionicLoading, $q, $timeout) {
            return {
                isOnline: function () {
                    var status;
                    try {
                        status = $cordovaNetwork.isOnline()
                    } catch (e) {
                        status = navigator.onLine;
                    }
                    return status;
                },
                getNetwork: function () {
                    var network;

                    try {
                        var networkStates = {};
                        networkStates[Connection.CELL]     = 'internet cell';
                        networkStates[Connection.WIFI]     = 'WiFi';
                        networkStates[Connection.UNKNOWN]  = 'Internet';
                        networkStates[Connection.CELL_2G]  = 'cell 2G';
                        networkStates[Connection.CELL_3G]  = 'cell 3G';
                        networkStates[Connection.CELL_4G]  = 'cell 4G';
                        network = networkStates[$cordovaNetwork.getNetwork()];
                    } catch (e) {
                        network = 'Internet';
                    }

                    return network;
                },
                showOffline: function() {
                    var NetworkService = this;
                    var $scope = $rootScope.$new(true);

                    $scope.connectionType = this.getNetwork();
                    $scope.checkingConnection = false;

                    $scope.recheckConnection = function () {
                        $scope.checkingConnection = true;

                        $timeout(function () {
                            if (NetworkService.isOnline()) {
                                NetworkService.showOnline();
                            }
                            $scope.checkingConnection = false;
                        }, 700);
                    };

                    $ionicLoading.show({
                        templateUrl: 'templates/common/offlineIndicator.html',
                        scope: $scope,
                        animation: 'fade-in',
                        showBackdrop: true,
                        showDelay: 300
                    });

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    deferred.reject();
                    promise.success = function(fn) {promise.then(fn); return promise;};
                    promise.error = function(fn) {promise.then(null, fn); return promise;};

                    return promise;
                },
                showOnline: function() {
                    $ionicLoading.hide();
                }
            };
        }
    ])
    .factory('Api', ['$http', '$localstorage', 'MessageQueue', 'ENDPOINTS', 'DEV_PROXY', 'NetworkService',
        function($http, $localstorage, MessageQueue, ENDPOINTS, DEV_PROXY, NetworkService) {

            return {
                protocol: 'http://',
                useHttps: function() {
                    this.protocol = "https://";
                },
                setAuth: function (username, password) {
                    var authorization = btoa(unescape(encodeURIComponent(username + ':' + password)));
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authorization;
                },
                clearAuth: function () {
                    $http.defaults.headers.common['Authorization'] = 'Bearer ';
                },
                request: function (params) {
                    var baseEndpoint = '';

                    if (!NetworkService.isOnline()) {
                        return NetworkService.showOffline();
                    }

                    if (DEV_PROXY == 'DEV_PROXY_FALSE') {
                        var host;

                        if (!isEmpty(params['hostname'])) {
                            host =  params['hostname'];
                        } else {
                            host = $localstorage.get('settings.hostname');
                        }

                        baseEndpoint = this.protocol + host;
                    }

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
    .factory('ApiInterceptor', ['$q', '$rootScope', '$injector', '$timeout', '$localstorage', 'MessageQueue', 'API_EVENTS', 'OTHERS',
        function ($q, $rootScope, $injector, $timeout, $localstorage, MessageQueue, API_EVENTS, OTHERS) {
            var pendingXHR;
            var requestTimer;
            var manualStop;

            return {
                request: function(config) {

                    if (
                        config.hasOwnProperty('params') ||
                        config.hasOwnProperty('responseKey')
                    ) {
                        var BusyService = $injector.get('BusyService');
                        manualStop = false;

                        BusyService.hide();

                        if (pendingXHR) {
                            pendingXHR.resolve();
                        }

                        pendingXHR = $q.defer();
                        config.timeout = pendingXHR.promise;

                        var scope = $rootScope.$new();

                        scope.cancelLoading = false;

                        $rootScope.stopRequest = function () {
                            manualStop = true;
                            pendingXHR.resolve();
                            BusyService.hide();
                            if (requestTimer) {
                                $timeout.cancel(requestTimer);
                            }
                        };

                        if (config.loading === true) {
                            requestTimer = $timeout(function () {
                                scope.cancelLoading = (config.cancelLoading === true);
                            }, OTHERS.apiTimeout * 1000);
                            BusyService.show(scope);
                        } else {
                            requestTimer = $timeout(function () {
                                scope.cancelLoading = true;
                                BusyService.show(scope);
                            }, OTHERS.apiTimeout * 1000);

                        }

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
                        $injector.get('BusyService').hide();

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

                        if (requestTimer) {
                            $timeout.cancel(requestTimer);
                        }

                        response.data = data[key];
                    }

                    return response;
                },
                responseError: function (response) {
                    $injector.get('BusyService').hide();

                    if (requestTimer) {
                        $timeout.cancel(requestTimer);
                    }

                    var status = {
                          0: API_EVENTS.notFound,
                        302: API_EVENTS.notFound,
                        401: API_EVENTS.notAuthenticated,
                        403: API_EVENTS.notAuthorized,
                        404: API_EVENTS.notFound,
                        500: API_EVENTS.serverError,
                        503: API_EVENTS.serviceUnavailable
                    };

                    if (!manualStop) {
                        $rootScope.$broadcast(status[response.status], response);
                    }

                    return $q.reject(response);
                }
            };
        }
    ]);