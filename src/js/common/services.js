angular.module('SpamExpertsApp')

    // factory for easier usage of localStorage
    // allows to keep volatile values and access properties of an object like settings.hostname
    .factory('$localstorage', ['$window',
        function($window) {

            cleanup();

            // cleaning up volatile storage
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

            // unpacking an object for local storage
            // {a: {b:1, c:2}} -> {'a.b':1, 'a.c':2}
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

            // packing back an object
            // {'a.b':1, 'a.c':2} -> {a: {b:1, c:2}}
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
                        if (value == 'true') value = true;
                        if (value == 'false') value = false;
                        if (value != '' && !isNaN(value)) value *= 1;
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
                // retrieve a localstorage value/object
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

                // set localstorage value/object
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
                            volatile.push(key);
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

    // Notification queue factory
    .factory('MessageQueue', ['$rootScope', '$timeout', 'OTHERS',
        function ($rootScope, $timeout, OTHERS) {
            var queueTimer;
            return {
                remove: function (item) {
                    if (isEmpty(item)) {
                        $rootScope.messageQueue = {};
                    } else {
                        $rootScope.messageQueue[item] = [];
                    }
                    $rootScope.forceScrollUpdate(150);
                },
                set: function (messageQueue) {
                    if (isEmpty(messageQueue)) return;
                    if (isEmpty($rootScope.messageQueue)) $rootScope.messageQueue = {error:[], notice: [], success: [], info: []};

                    $rootScope.messageQueue['info']    = unique($rootScope.messageQueue['info'].concat(messageQueue.info || []));
                    $rootScope.messageQueue['error']   = unique($rootScope.messageQueue['error'].concat(messageQueue.error || []));
                    $rootScope.messageQueue['notice']  = unique($rootScope.messageQueue['notice'].concat(messageQueue.notice || []));
                    $rootScope.messageQueue['success'] = unique($rootScope.messageQueue['success'].concat(messageQueue.success || []));

                    $rootScope.forceScrollUpdate(150);

                    if (queueTimer) {
                        $timeout.cancel(queueTimer);
                    }
                    queueTimer = $timeout(this.remove, OTHERS.notificationsTimeout * 1000);
                }
            };
        }
    ])

    // filtering permissions for SEARCH_CRITERIA or BULK_ACTIONS
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

    // Wrapper for $cordovaNetwork plugin - used for detecting network states (works only on phone)
    .factory('NetworkService', ['$rootScope', '$cordovaNetwork', 'uiService', '$q', '$timeout',
        function($rootScope, $cordovaNetwork, uiService, $q, $timeout) {
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

                    uiService.loading().show($scope, 'templates/common/offlineIndicator.html');

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    deferred.reject();
                    promise.success = function(fn) {promise.then(fn); return promise;};
                    promise.error = function(fn) {promise.then(null, fn); return promise;};

                    return promise;
                },
                showOnline: function() {
                    uiService.loading().hide();
                }
            };
        }
    ])

    // Filtering API parameters that need to be sent to the server see ENDPOINTS 'params' property
    .factory('ApiParamsFilter', [
        function() {

            return function (params, apiParams) {
                var entries = [];

                var filter = function (entry) {
                    var filteredEntry = {};

                    for (var param in apiParams) {
                        var key = apiParams[param];
                        filteredEntry[key] = entry[key];
                    }
                    return filteredEntry;
                };

                if (isObject(params)) {
                    return filter(params);
                } else {
                    if (1 < params.length) {
                        angular.forEach(params, function(entry) {
                            if (entry.isChecked) {
                                this.push(filter(entry));
                            }
                        }, entries);
                        return entries;

                    } else {
                        return [filter(params[0])];
                    }
                }
            }
        }
    ])

    // Factory used to perform API requests, returns a $http promise
    .factory('Api', ['$http', '$localstorage', 'NetworkService', 'ApiParamsFilter', 'ENDPOINTS', 'DEV_PROXY',
        function($http, $localstorage, NetworkService, ApiParamsFilter, ENDPOINTS, DEV_PROXY) {

            return {
                protocol: 'https://',
                // Basic authorization used to retrieve the token
                setAuth: function (username, password) {
                    var authorization = btoa(unescape(encodeURIComponent(username + ':' + password)));
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authorization;
                },
                // Clearing the basic authorization
                clearAuth: function () {
                    $http.defaults.headers.common['Authorization'] = 'Bearer ';
                },
                request: function (params) {
                    var baseEndpoint = '';

                    // checking network state using NetworkService wrapper over $cordovaNetwork
                    if (!NetworkService.isOnline()) {
                        return NetworkService.showOffline();
                    }

                    // ignoring hostname when development mode as we're using a proxy
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
                        requestParams: null,
                        filterChecked: false,
                        filterParams: false
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

                    if (params.filterParams) {
                        params.requestParams = ApiParamsFilter(params.requestParams, request.params);
                    }

                    switch (request.method) {
                        case 'GET':
                            return $http.get(
                                baseEndpoint + request.endpoint.printf(params.urlParams),
                                {
                                    params: params.requestParams,
                                    // need paramSerializer to fix requests with array parameters
                                    paramSerializer: '$httpParamSerializerJQLike',

                                    // custom properties used in the interceptor
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
                                    // custom properties used in the interceptor
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
                                    // custom properties used in the interceptor
                                    responseKey: !isEmpty(params.responseKey) ? params.responseKey : '',
                                    loading: request.loading === true,
                                    cancelLoading: request.cancelLoading
                                }
                            );

                        case 'DELETE':
                            // DELETE requires to send parameters via body (Request Payload)
                            // we need to send parameters as data and set 'Content-Type': 'application/json'
                            // otherwise they will be sent in the URL
                            return $http.delete(
                                baseEndpoint + request.endpoint.printf(params.urlParams),
                                {
                                    data: params.requestParams,
                                    headers: {'Content-Type': 'application/json'},

                                    // custom properties used in the interceptor
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

    // Display loading during requests
    .factory('BusyService', ['uiService',
        function(uiService) {
            return {
                show: function($scope) {
                    uiService.loading().show($scope, 'templates/common/loading.html');
                },
                hide: function() {
                    uiService.loading().hide();
                }
            };
        }
    ])

    // The $http interceptor
    .factory('ApiInterceptor', ['$q', '$rootScope', '$injector', '$timeout', '$localstorage', 'MessageQueue', 'API_EVENTS', 'OTHERS',
        function ($q, $rootScope, $injector, $timeout, $localstorage, MessageQueue, API_EVENTS, OTHERS) {
            var pendingXHR;
            var requestTimer;
            var manualStop;

            var interceptor = {
                request: function(config) {

                    // we need to perform actions only on our requests
                    if (
                        config.hasOwnProperty('params') ||
                        config.hasOwnProperty('responseKey')
                    ) {
                        // getting BusyService via $injector to prevent some errors
                        var BusyService = $injector.get('BusyService');
                        manualStop = false;

                        BusyService.hide();

                        // if we have a pending request (infinite-scroll, pull-to-refresh) we'll cancel it
                        if (pendingXHR) {
                            config.wasCanceled = true;
                            pendingXHR.resolve();
                        }

                        // we clear the previous requestTimer()
                        if (requestTimer) {
                            $timeout.cancel(requestTimer);
                        }

                        pendingXHR = $q.defer();
                        config.timeout = pendingXHR.promise;

                        var scope = $rootScope.$new();

                        scope.cancelLoading = false;

                        // register stopRequest function to be used in templates/common/loading.html
                        $rootScope.stopRequest = function () {
                            manualStop = true;
                            pendingXHR.resolve();
                            BusyService.hide();
                            if (requestTimer) {
                                $timeout.cancel(requestTimer);
                            }
                        };

                        // we display normal loading in the beginning
                        // we switch to allow cancel loading according to the timer
                        if (config.loading === true) {
                            requestTimer = $timeout(function () {
                                scope.cancelLoading = (config.cancelLoading === true);
                            }, OTHERS.apiTimeout * 1000);
                            BusyService.show(scope);
                        } else {
                            // any requests that don't require loading at first will get the cancel loading eventually
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
                    // we need to perform actions only on our requests

                    if (
                        !isEmpty(response.config.params) ||
                        response.config.hasOwnProperty('responseKey')
                    ) {

                        // response arrived hide loading
                        $injector.get('BusyService').hide();

                        // work-around for 302 redirect status
                        if (!angular.isObject(response.data)) {
                            response.status = 302;
                            return interceptor.responseError(response);
                        }

                        var data = response.data;
                        var key = !isEmpty(response.config.responseKey) ? response.config.responseKey : 'body';

                        // process the messageQueue
                        if (data['body'].hasOwnProperty('messageQueue')) {
                            MessageQueue.set(data['body']['messageQueue']);
                        }

                        // use the Token
                        if (!isEmpty(data['token'])) {
                            $localstorage.set('token', data['token'],
                                ($localstorage.get('settings.remember') != 'enabled')
                            );
                            data[key].token = data['token'];
                        }

                        // response arrived we should clear the requestTimer
                        if (requestTimer) {
                            $timeout.cancel(requestTimer);
                        }

                        response.data = data[key];
                    }

                    return response;
                },
                responseError: function (response) {
                    // we need to perform actions only on our requests
                    if (
                        !isEmpty(response.config.params) ||
                        response.config.hasOwnProperty('responseKey')
                    ) {
                        $injector.get('BusyService').hide();

                        // error response arrived we should clear the requestTimer
                        if (requestTimer) {
                            $timeout.cancel(requestTimer);
                        }

                        var status = {
                            302: API_EVENTS.notFound,
                            401: API_EVENTS.notAuthenticated,
                            403: API_EVENTS.notAuthorized,
                            404: API_EVENTS.notFound,
                            500: API_EVENTS.serverError,
                            503: API_EVENTS.serviceUnavailable
                        };

                        // broadcast event based on the received status if the stop was not done manually by the user
                        if (!manualStop) {
                            $rootScope.$broadcast(status[response.status], response);
                        }
                    }
                    return $q.reject(response);
                }
            };

            return interceptor;
        }
    ])

    // Wrapper for several $ionic services for easier transitioning on platform update
    .factory('uiService', ['$rootScope', '$timeout', '$ionicPopup', '$ionicActionSheet', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPopover',
        function($rootScope, $timeout, $ionicPopup, $ionicActionSheet, $ionicScrollDelegate, $ionicSideMenuDelegate, $ionicLoading, $ionicPopover) {

            return {
                sideMenuDelegate: $ionicSideMenuDelegate,
                scrollDelegate: $ionicScrollDelegate,
                popup: function (params) {
                    return $ionicPopup.show(params);
                },
                alert: function (params) {
                    $ionicPopup.alert(params);
                },
                confirm: function (params, agree, cancel) {
                    if (agree || cancel) {
                        $ionicPopup.confirm(params)
                            .then(function (choice) {
                                if (choice) {
                                    if (agree && typeof agree == 'function') {
                                        agree();
                                    }
                                } else {
                                    if (cancel && typeof cancel == 'function') {
                                        cancel();
                                    }
                                }
                            });
                    } else {
                        return $ionicPopup.confirm(params);
                    }
                },
                loading: function () {
                    return {
                        show: function($scope, template) {
                            $ionicLoading.show({
                                templateUrl: template,
                                scope: $scope,
                                animation: 'fade-in',
                                showBackdrop: true,
                                showDelay: 300
                            });
                        },
                        hide: function() {
                            $ionicLoading.hide();
                        }
                    }
                },
                dropdown: function () {
                    return {
                        show: function (action) {
                            var $scope = action.scope;
                            $scope.actions = action.actions;


                            $ionicPopover.fromTemplateUrl('templates/common/dropdown.html', {
                                scope: $scope
                            }).then(function(popover) {
                                $rootScope.popover = popover;
                                $rootScope.popover.show(action.event);
                            });

                            $scope.$on('popover.hidden', function() {
                                $rootScope.popover.remove();
                            });
                        },
                        hide: function () {
                            if ($rootScope.popover) {
                                $rootScope.popover.hide();
                                $rootScope.popover.remove();
                            }
                        }
                    };
                },
                tooltip: function () {
                    return {
                        show: function (list, $event) {
                            var $scope = $rootScope.$new();
                            $scope.list = list;

                            $ionicPopover.fromTemplateUrl('templates/common/tooltip-list.html', {
                                scope: $scope
                            }).then(function(popover) {
                                $rootScope.popover = popover;
                                $rootScope.popover.show($event);
                            });

                            $scope.$on('popover.hidden', function() {
                                $rootScope.popover.remove();
                            });
                        },
                        hide: function () {
                            if ($rootScope.popover) {
                                $rootScope.popover.hide();
                                $rootScope.popover.remove();
                            }
                        }
                    };
                },
                actionSheet: function (actions, success) {
                    var actionSheet = $ionicActionSheet.show({
                        buttons: actions,
                        titleText: 'Select Actions',
                        cancelText: 'Cancel',
                        cancel: function() {
                            actionSheet();
                        },
                        buttonClicked: function(i, action) {
                            actionSheet();
                            if (success && typeof success == 'function') {
                                $timeout(function () {success(action)}, 150);
                            }
                            return true;
                        }
                    });
                },
                kConvert: function (value) {
                    if (value < 1000) {
                        return value;
                    } else {
                        return Math.round(value/10) / 100 + 'k';
                    }
                }
            }
        }
    ]);