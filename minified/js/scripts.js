String.prototype.printf = function (obj) {
    var useArguments = false;
    var _arguments = arguments;
    var i = -1;
    if (typeof _arguments[0] == "string") {
        useArguments = true;
    }
    if (obj instanceof Array || useArguments) {
        return this.replace(/\%s/g,
            function (a, b) {
                i++;
                if (useArguments) {
                    if (typeof _arguments[i] == 'string') {
                        return _arguments[i];
                    }
                    else {
                        throw new Error("Arguments element is an invalid type");
                    }
                }
                return obj[i];
            });
    } else {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = obj[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
    }
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function unique(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
        if (-1 == arr.indexOf(array[i])) {
            arr.push(array[i]);
        }
    }
    return arr;
}

function adminOrIncoming(params, constant) {
    return -1 < [
            constant['USER_ROLES'].admin
        ].indexOf(params['role']) ||
        constant['GROUPS'].incoming ==  params['direction'];
}

function domainAndIncoming(params, constant) {
    return -1 < [
            constant['USER_ROLES'].domain
        ].indexOf(params['role']) &&
        constant['GROUPS'].incoming == params['direction'];
}

function domainAndEmailAndIncoming(params, constant) {
    return -1 < [
            constant['USER_ROLES'].domain,
            constant['USER_ROLES'].email
        ].indexOf(params['role']) &&
        constant['GROUPS'].incoming == params['direction'];
}
'use strict';
angular.module('SpamExpertsApp', ['ui.router', 'ngSanitize', 'ngMaterial', 'ngCordova'])
    // .run(['$ionicPlatform',
    //     function($ionicPlatform) {
    //         $ionicPlatform.ready(function() {
    //             // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //             // for form inputs)
    //             if(window.cordova && window.cordova.plugins.Keyboard) {
    //                 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //             }
    //             if(window.StatusBar) {
    //                 StatusBar.styleDefault();
    //             }
    //         });
    //     }
    // ])
    .config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.push('ApiInterceptor');
            // $ionicConfigProvider.views.forwardCache(true);
        }
    ])
    .filter('trust', ['$sce', function($sce) {
        return $sce.trustAsHtml;
    }]);
angular.module('SpamExpertsApp')

    .constant("DEV_PROXY", "DEV_PROXY_TRUE")

    .constant('OTHERS', {
        sliceLength: 10,
        apiTimeout: 10,
        dateFormat: 'yyyy-MM-dd HH:mm'
    })

    .constant('GROUPS', {
        incoming: 'incoming',
        outgoing: 'outgoing'
    })

    .constant('USER_ROLES', {
        admin:  'Super-Admin',
        domain: 'Domain User',
        email:  'Email User',
        public: 'public_role'
    })

    .constant('API_EVENTS', {
        notAuthenticated: 'not-authenticated',
        notAuthorized: 'not-authorized',
        serverError: 'server-error',
        serviceUnavailable: 'server-unavailable',
        notFound: 'not-found'
    })

    .constant('ROUTES', function(constant) {
        return [
            {
                url: '/login',
                templateUrl: 'templates/auth/login.html',
                controller: 'LoginCtrl',
                data: {
                    state: 'login',
                    noDash: true,
                    noSide: true
                }
            },
            {
                url: '/',
                abstract: true,
                templateUrl: 'templates/common/main.html',
                data: {
                    state: 'main',
                    noDash: true,
                    noSide: true
                }
            },
            {
                url: 'dash',
                views: {
                    'main-container': {
                        templateUrl: 'templates/dashboard/dashboard.html'
                    }
                },
                data: {
                    state: 'main.dash',
                    name: 'Dashboard',
                    icon: 'home',
                    noDash: true,
                    authorizedRoles: [constant['USER_ROLES'].admin, constant['USER_ROLES'].domain, constant['USER_ROLES'].email]
                }
            },
            {

                name: 'Incoming',
                icon: 'cloud_download',
                items: [
                    {
                        url: 'incoming/log/search',
                        views: {
                            'main-container': {
                                templateUrl: 'templates/logSearch/view/messages.html',
                                controller: 'IncomingMessagesCtrl'
                            },
                            'right-side-menu':  {
                                templateUrl: 'templates/logSearch/menu/menu.html',
                                controller: 'IncomingSearchCriteriaCtrl'
                            }
                        },
                        data: {
                            state: 'main.incomingLogSearch',
                            group: constant['GROUPS'].incoming,
                            name: 'Quarantine',
                            icon: 'email',
                            authorizedRoles: [constant['USER_ROLES'].admin, constant['USER_ROLES'].domain, constant['USER_ROLES'].email]
                        }
                    }
                ]
            },
            {
                name: 'Outgoing',
                icon: 'cloud_upload',
                items: [
                    {
                        url: 'outgoing/log/search',
                        views: {
                            'main-container': {
                                templateUrl: 'templates/logSearch/view/messages.html',
                                controller: 'OutgoingMessagesCtrl'
                            },
                            'right-side-menu': {
                                templateUrl: 'templates/logSearch/menu/menu.html',
                                controller: 'OutgoingSearchCriteriaCtrl'
                            }
                        },
                        data: {
                            state: 'main.outgoingLogSearch',
                            group: constant['GROUPS'].outgoing,
                            name: 'Quarantine',
                            icon: 'email',
                            authorizedRoles: [constant['USER_ROLES'].admin, constant['USER_ROLES'].domain]
                        }
                    }
                ]
            },
            {
                url: 'message',
                cache: false,
                views: {
                    'main-container': {
                        templateUrl: 'templates/logSearch/view/message-detail.html',
                        controller: 'MessageDetailCtrl'
                    }
                },
                params: {message: {}, previousState: {}},
                data: {
                    state: 'main.message-detail',
                    noDash: true,
                    noSide: true,
                    authorizedRoles: [constant['USER_ROLES'].admin, constant['USER_ROLES'].domain, constant['USER_ROLES'].email]
                }
            }
        ]
    })

    .constant('ENDPOINTS', {
        auth: {
            method: 'GET',
            endpoint: '/rest/auth/token',
            loading: true,
            cancelLoading: true
        },
        incoming: {
            logSearch: {
                get: {
                    method: 'GET',
                    endpoint: '/rest/log/search/delivery',
                    loading: false
                },
                release: {
                    method: 'PUT',
                    endpoint: '/rest/log/release/delivery',
                    loading: true
                },
                releaseandwhitelist: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandwhitelist/delivery',
                    loading: true
                },
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandtrain/delivery',
                    loading: true
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/delivery',
                    loading: true
                },
                removeandblacklist: {
                    method: 'DELETE',
                    endpoint: '/rest/log/removeandblacklist/delivery',
                    loading: true
                },
                view: {
                    method: 'GET',
                    endpoint: '/rest/log/view/delivery',
                    loading: false
                },
                purge: {
                    method: 'DELETE',
                    endpoint: '/rest/log/quarantined/delivery',
                    loading: true
                }
            }
        },
        outgoing: {
            logSearch: {
                get: {
                    method: 'GET',
                    endpoint: '/rest/log/search/submission',
                    loading: false
                },
                release: {
                    method: 'PUT',
                    endpoint: '/rest/log/release/submission',
                    loading: true
                },
                releaseandwhitelist: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandwhitelist/submission',
                    loading: true
                },
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandtrain/submission',
                    loading: true
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/submission',
                    loading: true
                },
                removeandblacklist: {
                    method: 'DELETE',
                    endpoint: '/rest/log/removeandblacklist/submission',
                    loading: true
                },
                view: {
                    method: 'GET',
                    endpoint: '/rest/log/view/submission',
                    loading: false
                },
                purge: {
                    method: 'DELETE',
                    endpoint: '/rest/log/quarantined/submission',
                    loading: true
                }
            }
        }
    })

    .constant('SEARCH_CRITERIA', {
        logSearch: {
            fields: [
                {
                    label: 'Sender',
                    type: 'text',
                    model: 'sender',
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].admin,
                                constant['USER_ROLES'].domain
                            ].indexOf(params['role'])
                            || params['direction'] == constant['GROUPS'].incoming;
                    }
                },
                {
                    label: 'Recipient',
                    type: 'text',
                    model: 'recipient',
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].admin,
                                constant['USER_ROLES'].domain
                            ].indexOf(params['role'])
                            || params['direction'] == constant['GROUPS'].outgoing;
                    }
                },
                {
                    label: 'Domain',
                    type: 'text',
                    model: 'domain',
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].admin
                            ].indexOf(params['role']);
                    }
                }
            ],
            actions: [
                {
                    label: 'Search',
                    cssClass: 'md-primary',
                    icon: 'search',
                    action: 'doSearch'
                },
                {
                    label: 'Reset',
                    cssClass: 'md-warn',
                    icon: 'refresh',
                    action: 'doReset'
                }
            ]
        }
    })

    .constant('BULK_ACTIONS', {
        logSearch: {
            actionSheet: [
                {
                    name: 'release',
                    icon: 'screen_share',
                    text: 'Release',
                    confirmText:
                        'The email(s) that you have selected previously will be released.%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                },
                {
                    name: 'releaseandwhitelist',
                    icon: 'list',
                    text: 'Whitelist and release',
                    confirmText:
                    'You have chosen to release the email and whitelist their senders.' +
                    ' Please note, spammers generally use fake \'from\' addresses trying to match whitelisted ' +
                    'senders so their spam emails bypass the checks.%s Are you sure you wish to whitelist these senders?'
                    ,
                    condition: domainAndIncoming
                },
                {
                    name: 'releaseandtrain',
                    text: 'Release and train',
                    icon: 'filter_list',
                    confirmText:
                    'Choosing \'Release and Train\', for one or several messages, might adversely' +
                    ' affect the quality of filtering for all the existing users.' +
                    'Please avoid any mistakes in your selection!%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                },
                {
                    name: 'remove',
                    icon: 'remove_circle_outlined',
                    text: 'Remove',
                    confirmText: 'The email(s) that you have selected will be removed.%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                },
                {
                    name: 'removeandblacklist',
                    icon: 'list',
                    text: 'Blacklist and remove',
                    confirmText:
                    'You have chosen to remove the email and blacklist the sender.' +
                    'Please note, emails from blacklisted senders are immediately discarded.%s' +
                    'Are you sure you wish to blacklist these senders ?',
                    condition: domainAndIncoming
                },
                {
                    name: 'purge',
                    icon: 'delete',
                    text: 'Empty quarantine',
                    confirmText:
                    'You are going to empty your spam quarantine folder.%s' +
                    'ALL its messages will be removed.%s' +
                    'Please keep in mind that messages might still appear in the list while we\'re processing this action.%s' +
                    'Are you sure you want to do this?',
                    condition: domainAndEmailAndIncoming
                }
            ],
            tapAction: [{
                condition: adminOrIncoming
            }]
        }
    });
angular.module('SpamExpertsApp')
    .config(['$stateProvider', '$urlRouterProvider', 'ROUTES', 'GROUPS', 'USER_ROLES',
        function ($stateProvider, $urlRouterProvider, ROUTES, GROUPS, USER_ROLES) {

            var Routes = ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES});
            var stateConfig;
            for (var i in Routes) {
                if (!isEmpty(Routes[i].items)) {
                    for (var j in Routes[i].items) {
                        stateConfig = Routes[i].items[j];
                        stateConfig.params = angular.merge({}, stateConfig.params, {keepMessageQueue: null});
                        $stateProvider.state(Routes[i].items[j].data.state, stateConfig);
                    }
                } else {
                    stateConfig = Routes[i];
                    stateConfig.params = angular.merge({}, stateConfig.params, {keepMessageQueue: null});
                    $stateProvider.state(Routes[i].data.state, Routes[i]);
                }
            }
            $urlRouterProvider.otherwise('dash');
        }
    ]);
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
                        $rootScope.messageQueue = {};
                    } else {
                        $rootScope.messageQueue[item] = [];
                    }
                },
                set: function (messageQueue) {
                    if (isEmpty(messageQueue)) return;
                    if (isEmpty($rootScope.messageQueue)) $rootScope.messageQueue = {error:[], notice: [], success: [], info: []};

                    $rootScope.messageQueue['info']    = unique($rootScope.messageQueue['info'].concat(messageQueue.info || []));
                    $rootScope.messageQueue['error']   = unique($rootScope.messageQueue['error'].concat(messageQueue.error || []));
                    $rootScope.messageQueue['notice']  = unique($rootScope.messageQueue['notice'].concat(messageQueue.notice || []));
                    $rootScope.messageQueue['success'] = unique($rootScope.messageQueue['success'].concat(messageQueue.success || []));

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
    .factory('NetworkService', ['$rootScope', '$cordovaNetwork', '$q', '$timeout', '$mdDialog',
        function($rootScope, $cordovaNetwork, $q, $timeout, $mdDialog) {
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

                    $mdDialog.show({
                        templateUrl: 'templates/common/offlineIndicator.html',
                        scope: $scope
                    });

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    deferred.reject();
                    promise.success = function(fn) {promise.then(fn); return promise;};
                    promise.error = function(fn) {promise.then(null, fn); return promise;};

                    return promise;
                },
                showOnline: function() {
                    $mdDialog.hide();
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
    .factory('BusyService', ['$mdDialog',
        function($mdDialog) {
            return {
                show: function($scope) {

                    return $mdDialog.show({
                        templateUrl: 'templates/common/loading.html',
                        scope: $scope
                    });
                },
                hide: function() {
                     $mdDialog.hide();
                }
            };
        }
    ])
    .factory('ApiInterceptor', ['$q', '$rootScope', '$injector', '$timeout', '$localstorage', 'MessageQueue', 'API_EVENTS', 'OTHERS',
        function ($q, $rootScope, $injector, $timeout, $localstorage, MessageQueue, API_EVENTS, OTHERS) {
            var pendingXHR;
            var requestTimer;
            var manualStop;

            var interceptor = {
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

                        if (requestTimer) {
                            $timeout.cancel(requestTimer);
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

                        if (!angular.isObject(response.data)) {
                            response.status = 302;
                            return interceptor.responseError(response);
                        }

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
                    if (
                        !isEmpty(response.config.params) ||
                        response.config.hasOwnProperty('responseKey')
                    ) {
                        $injector.get('BusyService').hide();

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
    .factory('AlertDialog', ['$mdDialog',
        function ($mdDialog) {
            
            return {
                alert: function (params) {
                    if (isEmpty(params['ok'])) {
                        params['ok'] = 'Close';
                    }

                    return $mdDialog.show(
                        $mdDialog.alert()
                            .title(params['title'])
                            .textContent(params['template'])
                            .ok(params['ok'])
                    );
                },
                confirm: function (params) {
                    if (isEmpty(params['ok'])) {
                        params['ok'] = 'Yes';
                    }            
                    if (isEmpty(params['cancel'])) {
                        params['cancel'] = 'No';
                    }

                    return $mdDialog.show(
                        $mdDialog.confirm()
                            .title(params['title'])
                            .textContent(params['template'])
                            .ok(params['ok'])
                            .cancel(params['cancel'])
                    );
                }
            };
    }
]);
angular.module('SpamExpertsApp')
    .controller('CommonCtrl', ['$rootScope', '$state', '$mdSidenav', 'MessageQueue', 'AlertDialog', 'ROUTES', 'GROUPS', 'USER_ROLES', 'API_EVENTS',
        function($rootScope, $state, $mdSidenav, MessageQueue, AlertDialog, ROUTES, GROUPS, USER_ROLES, API_EVENTS) {

            $rootScope.removeQueueMessage = MessageQueue.remove;

            function filterRoutes(Routes, role) {
                var out = [];
                for (var i in Routes) {
                    if (!isEmpty(Routes[i].items)) {
                        Routes[i].items = filterRoutes(Routes[i].items, role);
                        if (!isEmpty(Routes[i].items)) {
                            out.push(Routes[i]);
                        }
                    } else if (
                        Routes[i].data.authorizedRoles &&
                        Routes[i].data.authorizedRoles.indexOf(role) == -1
                    ) {
                        break;
                    } else {
                        out.push(Routes[i]);
                    }
                }
                return out;
            }

            $rootScope.isSidenavOpen = false;
            $rootScope.risSidenavOpen = false;

            $rootScope.canDragLeft = false;

            $rootScope.openLeftMenu = function() {
                $mdSidenav('left').toggle();
            };

            $rootScope.openRightMenu = function() {
                $mdSidenav('right').toggle();
            };

            $rootScope.items = [];
            for (var i = 0; i < 1000; i++) {
                $rootScope.items.push(i);
            }

            $rootScope.$on('$stateChangeSuccess', function () {


                $rootScope.menuItems = filterRoutes(
                    ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES}),
                    $rootScope.role
                );
                
                $rootScope.canDragLeft =  
                    !isEmpty($state.current.views) && 
                    !isEmpty($state.current.views['right-side-menu']);


                if ($rootScope.stopRequest && $rootScope.stopRequest instanceof Function) {
                    $rootScope.stopRequest();
                }

                if (!$state.params.keepMessageQueue) {
                    MessageQueue.remove();
                }
            });


            $rootScope.logout = function() {
                $rootScope.$broadcast('$logout')
            };

            $rootScope.$on(API_EVENTS.notFound, function() {
                AlertDialog.alert({
                    title: 'Not found!',
                    template: 'The resource you are trying to access might have been moved or is unavailable at the moment'
                });
            });
            
            $rootScope.$on(API_EVENTS.serverError, function() {
                AlertDialog.alert({
                    title: 'Server error',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });
            
            $rootScope.$on(API_EVENTS.serviceUnavailable, function() {
                AlertDialog.alert({
                    title: 'Service unavailable',
                    template: 'Oops! Something went wrong! Please try again later!'
                });
            });

        }
    ]);

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
    );
angular.module('SpamExpertsApp')
    .run(['$rootScope', '$state', 'AuthService', 'AlertDialog', 'API_EVENTS',
        function ($rootScope, $state, AuthService, AlertDialog, API_EVENTS) {

            $rootScope.$on('$stateChangeStart', function (event, next) {
                if (next.name !== 'login') {
                    $rootScope.username = AuthService.getUsername();
                    $rootScope.role = AuthService.getRole();

                    if (!AuthService.isAuthenticated()) {
                        event.preventDefault();
                        $state.go('login');
                    } else if ('data' in next && 'authorizedRoles' in next.data) {
                        var authorizedRoles = next.data.authorizedRoles;
                        if (!AuthService.isAuthorized(authorizedRoles)) {
                            event.preventDefault();
                            $state.go($state.current, {}, {reload: true});
                            $rootScope.$broadcast(API_EVENTS.notAuthorized);
                        }
                    }
                }
            });

            $rootScope.$on('$logout', function () {
                AlertDialog
                    .confirm({
                        title: 'Confirm logout',
                        template: 'Are you sure you want to log out?'
                    })
                    .then(function(choice) {
                        if (choice) {
                            AuthService.logout();
                            $state.go('login', {}, {reload: true});
                            // $ionicHistory.clearHistory();
                            // $ionicHistory.clearCache().then(function() {
                            //    window.location.reload();
                            // });
                        }
                    });
            });

            $rootScope.$on(API_EVENTS.notAuthorized, function() {
                AlertDialog.alert({
                    title: 'Unauthorized!',
                    template: 'You are not allowed to access this resource.'
                });
            });

            $rootScope.$on(API_EVENTS.notAuthenticated, function() {
                AuthService.logout();
                AuthService.clearPassword();
                $state.go('login');
                AlertDialog.alert({
                    title: 'Authentication expired',
                    template: 'Sorry, you have to login again.'
                });
            });

        }
    ]);
angular.module('SpamExpertsApp')
    .service('AuthService', ['$http', '$localstorage', 'Api', 'USER_ROLES',
        function($http, $localstorage, Api, USER_ROLES) {

            var authenticatedUsername = '';
            var authenticatedUserRole = '';
            var isAuthenticated = false;

            var defaultSettings = {
                hostname: '',
                username: '',
                password: '',
                remember: 'disabled',
                role: USER_ROLES.public
            };

            var settings = $localstorage.get('settings', defaultSettings);
            var token = $localstorage.get('token');

            if (settings.remember == 'enabled' && !isEmpty(token)) {
                useCredentials(settings.username, settings.role);
            }

            function useCredentials(username, role) {
                isAuthenticated = true;

                if (username) {
                    authenticatedUsername = username;
                    authenticatedUserRole = USER_ROLES[role]
                } else {
                    authenticatedUserRole = USER_ROLES.public
                }
            }

            return {
                isAuthorized: function(authorizedRoles) {
                    if (!angular.isArray(authorizedRoles)) {
                        authorizedRoles = [authorizedRoles];
                    }
                    return (isAuthenticated && authorizedRoles.indexOf(authenticatedUserRole) !== -1);
                },
                isAuthenticated: function() {
                    return isAuthenticated;
                },
                getUsername: function() {
                    return authenticatedUsername;
                },
                getRole: function() {
                    return authenticatedUserRole;
                },
                getUserCredentials: function() {
                    return $localstorage.get('settings', defaultSettings);
                },
                toggleRemember: function(remember) {
                    $localstorage.set('settings.remember', remember, false);
                },
                clearPassword: function() {
                    $localstorage.set('settings.password', '', false);
                },
                login: function(hostname, username, password, remember) {
                    var settings = $localstorage.get('settings', defaultSettings);
                    var token = $localstorage.get('token');

                    if (isEmpty(token) ||
                        settings.hostname != hostname ||
                        settings.username != username ||
                        settings.password != password
                    ) {
                        $localstorage.set('token', '');
                        Api.setAuth(username, password);
                    }

                    return Api.request({resource: 'auth', hostname: hostname, responseKey: 'userData'})
                        .success(function(response) {
                            Api.clearAuth();

                            if (remember == 'enabled') {
                                password = new Array(password.length + 1).join('*');
                            } else {
                                password = '';
                            }

                            $localstorage.set('settings', {
                                hostname: hostname,
                                username: response.username || '',
                                password: password,
                                remember: remember,
                                role    : response.role || ''
                            });

                            useCredentials(response.username, response.role);
                        })
                        .error(function () {
                            Api.clearAuth();
                        });
                },
                logout: function () {
                    authenticatedUsername = '';
                    authenticatedUserRole = '';

                    isAuthenticated = false;

                    var settings = $localstorage.get('settings');

                    if (settings.remember == 'disabled') {
                        Api.clearAuth();
                        $localstorage.set('settings', defaultSettings);
                    }
                    $localstorage.cleanup();
                }
            };
        }
    ]);
angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', 'AuthService', 'AlertDialog', 'MessageQueue',
        function($scope, $state, AuthService, AlertDialog, MessageQueue) {

            $scope.$on('$stateChangeSuccess', function () {
                $scope.data = AuthService.getUserCredentials();
            });

            $scope.toggleRemember = function(remember) {
                AuthService.toggleRemember(remember);
            };

            $scope.login = function(data) {

                var failedPopup = {
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                };

                if (
                    isEmpty(data.hostname) ||
                    isEmpty(data.username) ||
                    isEmpty(data.password)
                ) {
                    AlertDialog.alert(failedPopup);
                } else {
                    AuthService.login(data.hostname, data.username, data.password, data.remember)
                        .then(function(response) {
                            if (!response.data.token) {
                                AlertDialog.alert(failedPopup);
                                $scope.data.password = '';
                            } else {
                                MessageQueue.remove();
                                $state.go('main.dash', {}, {reload: true});
                            }
                        });
                }
            };
        }
    ]);
angular.module('SpamExpertsApp')
    .factory('SearchCriteriaService', ['$filter', '$localstorage', 'GROUPS', 'OTHERS',
        function ($filter, $localstorage, GROUPS, OTHERS) {

            /** @var modelData = {direction: direction} */

            function SearchCriteriaService(modelData) {

                this.direction = null;

                if (!isEmpty(modelData)) {
                    this.construct(modelData);
                }

            }

            function filterDates(criteria) {
                var newCriteria = angular.merge({}, criteria);
                newCriteria.since = $filter('date')(newCriteria.since, OTHERS.dateFormat);
                newCriteria.until = $filter('date')(newCriteria.until, OTHERS.dateFormat);
                return newCriteria;
            }

            SearchCriteriaService.prototype = {
                construct: function(modelData) {
                    angular.merge(this, modelData);
                },
                getDirection: function () {
                    return this.direction;
                },
                getDefaultCriteria: function() {
                    var yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0);
                    yesterday.setMinutes(0);

                    return {
                        since: yesterday,
                        until: new Date(),
                        offset: 0,
                        length: OTHERS.sliceLength,
                        refresh: false,
                        sender: '',
                        recipient: '',
                        domain: ''
                    };
                },
                getCurrentDate: function (apiDate) {
                    var now = new Date();
                    if (apiDate) {
                        now = $filter('date')(now, OTHERS.dateFormat);
                    }
                    return now;
                },
                getSearchCriteria: function(apiDates) {
                    var criteria = this.getDefaultCriteria();
                    var currentCriteria = $localstorage.get('searchCriteria.' + this.direction, filterDates(criteria), true);
                    if (!apiDates) {
                        currentCriteria.since = new Date(currentCriteria.since);
                        currentCriteria.until = new Date(currentCriteria.until);
                    }
                    return currentCriteria;
                },
                getDateFormat: function () {
                    return OTHERS.dateFormat;
                },
                setSearchCriteria: function(criteria) {
                    $localstorage.set('searchCriteria.' + this.direction, filterDates(criteria), true);
                }
            };

            return SearchCriteriaService;

        }
    ])
    .factory('CriteriaManager', ['filterPermissions', 'SEARCH_CRITERIA',
        function (filterPermissions, SEARCH_CRITERIA) {

            return function () {
                var criteriaForm = {
                    fields: filterPermissions(SEARCH_CRITERIA.logSearch['fields']),
                    actions: filterPermissions(SEARCH_CRITERIA.logSearch['actions'])
                };

                this.criteriaForm = function (type) {
                    return criteriaForm[type];
                }
            };
        }
    ]);
angular.module('SpamExpertsApp')
    .controller('IncomingSearchCriteriaCtrl', ['$scope', '$controller', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, SearchCriteriaService, GROUPS) {

            $controller('CommonSearchCriteriaCtrl', {
                $scope: $scope,
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.incoming,
                    searchCriteria: {}
                })
            });
        }
    ]);

angular.module('SpamExpertsApp')
    .controller('OutgoingSearchCriteriaCtrl', ['$scope', '$controller', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, SearchCriteriaService, GROUPS) {

            $controller('CommonSearchCriteriaCtrl', {
                $scope: $scope,
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.outgoing,
                    searchCriteria: {}
                })
            });
        }
    ]);

angular.module('SpamExpertsApp')
    .controller('CommonSearchCriteriaCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'criteriaService', 'CriteriaManager',
        function($rootScope, $scope, $state, $timeout, criteriaService, CriteriaManager) {

            var criteriaManager = new CriteriaManager();

            $scope.criteriaFields  = criteriaManager.criteriaForm('fields');
            $scope.criteriaActions = criteriaManager.criteriaForm('actions');

            $scope.searchCriteria = criteriaService.getSearchCriteria();

            $scope.dateFormat = criteriaService.getDateFormat();

            $scope.actions = {
                doSearch: function() {
                    criteriaService.setSearchCriteria($scope.searchCriteria);
                    $timeout(function() {
                        $rootScope.$broadcast('refreshEntries');
                    });
                },
                doReset: function() {
                    var defaultCriteria = criteriaService.getDefaultCriteria();
                    criteriaService.setSearchCriteria(defaultCriteria);
                    $scope.searchCriteria = defaultCriteria;
                    $timeout(function() {
                        $rootScope.$broadcast('refreshEntries');
                    });
                }
            };
        }
    ]);
angular.module('SpamExpertsApp')
    .factory('MessagesService', ['Api',
        function(Api) {

            /** @var modelData = {direction: direction, last_count: last_count, messages: [], message: {}}; */
            function MessagesService(modelData) {
                this.messages = [];
                this.last_count = 0;
                this.direction = null;
                this.messageParts = {};
                this.selected = 0;

                if (!isEmpty(modelData)) {
                    this.construct(modelData);
                }
            }

            MessagesService.prototype = {
                construct: function(modelData) {
                    angular.merge(this, modelData);
                    this.criteriaService = modelData.criteriaService;
                },
                getDirection: function () {
                    return this.direction;
                },
                getMessages: function () {
                    return this.messages;
                },
                getDataSet: function () {
                    var self = this;
                    var slice = 10;
                    return {
                        numLoaded_: 0,
                        toLoad_: 0,
                        items: [],

                        // Required.
                        getItemAtIndex: function (index) {

                            if (index > self.count()) {
                                this.fetchMoreItems_(index);
                            } else if (!isEmpty(this.items[index])) {
                                return this.items[index];
                            }
                            return null;
                        },

                        // Required.
                        getLength: function () {
                            return self.last_count;
                        },

                        fetchMoreItems_: function (index) {
                            var that = this;
                            if (this.toLoad_ < index) {
                                this.toLoad_ += slice;
                                
                                var criteria = self.criteriaService.getSearchCriteria(true);

                                criteria.offset = self.count();
                                criteria.refresh = false;
                                
                                self.fetch(criteria).then(function () {
                                    that.numLoaded_ = that.toLoad_;
                                    that.items = self.messages;
                                });
                            }
                        }
                    }
                },
                getMessageParts: function () {
                    return this.messageParts;
                },
                isBulkMode: function () {
                    return 0 < this.selected;
                },
                selectMessage: function (index) {
                    var toggle = !this.messages[index].isChecked;
                    this.messages[index].isChecked = toggle;
                    if (toggle) {
                        this.selected++;
                    } else {
                        this.selected--;
                    }
                },
                countSelected: function () {
                    return this.selected;
                },
                selectAll: function (toggle) {
                    angular.forEach(this.messages, function(value) {
                        value.isChecked = toggle;
                    });
                    this.selected = (toggle ? this.count() : 0);
                },
                wipe: function() {
                    this.messages = [];
                    this.last_count = 0;
                },
                count: function() {
                    return this.messages.length;
                },
                getLastCount: function() {
                    return this.last_count;
                },
                fetch: function(searchCriteria) {
                    var that = this;

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: 'get',
                            requestParams: searchCriteria
                        })
                        .success(function(resp) {
                            if (!isEmpty(resp['newest_entries'])) {
                                that.messages = resp['newest_entries'];
                            } else if (!isEmpty(resp['new_entries'])) {
                                that.messages = resp['new_entries'].concat(that.messages);
                            } else if (!isEmpty(resp['entries']))  {
                                that.messages = that.messages.concat(resp['entries']);
                            }
                            that.last_count = resp.last_count || 0;
                        });
                },
                viewMessage: function (message) {

                    if (message) {
                        this.messageParts = message;

                        var that = this;

                        return Api.request({
                                direction: this.direction,
                                resource: 'logSearch',
                                action: 'view',
                                requestParams: message
                            })
                            .success(function (response) {
                                that.messageParts.details = response['mail'];
                            });
                    }

                    return null;
                },
                bulkAction: function (action, entry) {
                    var entries = [];

                    if (!isEmpty(entry)) {
                        entries.push(entry);
                    } else {
                        angular.forEach(this.messages, function(message) {
                            if (message.isChecked) {
                                this.push(message);
                            }
                        }, entries);
                    }

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: action,
                            requestParams: entries
                        });
                }
            };

            return MessagesService;
        }
    ])
    .factory('ActionManager', ['MessageQueue', 'filterPermissions', 'AlertDialog', 'BULK_ACTIONS',
        function (MessageQueue, filterPermissions, AlertDialog, BULK_ACTIONS) {

            function confirm (action, callback) {
                AlertDialog
                    .confirm({
                        title: 'Confirm action',
                        template: action.confirmText.replace(/\%s/g, '<br>')
                    })
                    .then(function(choice) {
                        if (choice &&  typeof callback == 'function') {
                            callback(action);
                        }
                    });
            }

            return function (direction) {
                var actions = {
                    actionSheet: filterPermissions(BULK_ACTIONS.logSearch['actionSheet'], {direction: direction}),
                    bar: filterPermissions(BULK_ACTIONS.logSearch['bar'], {direction: direction}),
                    tapAction: filterPermissions(BULK_ACTIONS.logSearch['tapAction'], {direction: direction})
                };

                this.getActions = function(type) {
                    return actions[type];
                };

                this.processAction = function (action, callback) {
                    confirm(action, callback);
                };

                this.noAvailableAction = function () {
                    MessageQueue.set({info: ['No bulk actions are available']});
                };

                this.noViewAction = function () {
                    MessageQueue.set({info: ['You are not allowed to view this message']});
                };

            };

        }
    ]);
angular.module('SpamExpertsApp')
    .controller('IncomingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.incoming,
                    last_count: 0,
                    messages: [],
                    criteriaService: new SearchCriteriaService({
                        direction: GROUPS.incoming
                    })
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('OutgoingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.outgoing,
                    last_count: 0,
                    messages: [],
                    criteriaService: new SearchCriteriaService({
                        direction: GROUPS.outgoing
                    })
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('CommonMessagesCtrl', ['$scope', '$state', '$timeout', 'MessageQueue', 'messagesService', 'ActionManager',
        function($scope, $state, $timeout, MessageQueue, messagesService, ActionManager) {

            $scope.info = {
                count: 0,
                lastCount: 0
            };

            $scope.noMoreItemsAvailable = false;
            $scope.isOpen = false;

            $scope.loadingEntries = false;

            $scope.$on('refreshEntries', function () {
                MessageQueue.remove();
                messagesService.wipe();
                messagesService.getMessages();
                $scope.messageEntries = messagesService.getDataSet();

                $scope.noMoreItemsAvailable = false;
                $scope.bulkMode = false;
            });

            $scope.$on('$stateChangeSuccess', function () {
                    $scope.messageEntries = messagesService.getDataSet();
                    $scope.messageEntries.fetchMoreItems_(1);

            });


            var actionManager = new ActionManager();

            var barActions = actionManager.getActions('bar');
            var availableActions = actionManager.getActions('actionSheet');
            var tapAction = actionManager.getActions('tapAction');

            $scope.bulkMode = false;
            $scope.selectedCount = messagesService.countSelected();

            $scope.availableActions = availableActions;
            $scope.barActions = barActions;

            $scope.openMessage = function(message) {
                if (!isEmpty(tapAction)) {
                    $state.go('main.message-detail', {
                        message: message,
                        previousState: {
                            group: $state.current.data.group,
                            state: $state.current.data.state
                        }
                    }, {reload: true});
                } else {
                    actionManager.noViewAction();
                }
            };

            $scope.selectEntry = function(index) {
                if (!isEmpty(barActions) || !isEmpty(availableActions)) {
                    messagesService.selectMessage(index);
                    $scope.selectedCount = messagesService.countSelected();
                    $scope.bulkMode = messagesService.isBulkMode();
                } else {
                    actionManager.noAvailableAction();
                }
            };

            $scope.selectAll = function (toggle) {
                messagesService.selectAll(toggle);
                $scope.selectedCount = messagesService.countSelected();
                $scope.bulkMode = messagesService.isBulkMode();
            };

            $scope.processAction = function (action) {
                actionManager.processAction(
                    action,
                    function (action) {
                        messagesService
                            .bulkAction(action.name)
                            .then(function () {
                                $timeout(function() {
                                    $scope.$broadcast('refreshEntries');
                                });
                                $scope.bulkMode = false;
                            });
                    }
                );
            };

        }
    ])

    .controller('MessageDetailCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'MessageQueue', 'MessagesService', 'ActionManager',
        function($rootScope, $scope, $state, $timeout, MessageQueue, MessagesService, ActionManager) {

            var message = angular.copy($state.params.message);
            if (isEmpty(message)) {
                $state.go('main.dash', {}, {reload: true});
                return;
            }

            var messageService = new MessagesService({
                direction: $state.params.previousState.group,
                messageParts: {}
            });

            $scope.message = message;

            $scope.showRaw = false;

            $scope.toggleRaw = function() {
                $scope.showRaw = !$scope.showRaw;
            };

            $scope.back = function () {
                $state.go($state.params.previousState.state);
            };

            messageService.viewMessage(message).then(function() {
                $scope.message = messageService.getMessageParts();
            });

            var actionManager = new ActionManager($state.params.previousState.group);
            var availableActions = actionManager.getActions('actionSheet');

            $scope.availableActions = availableActions;

            $scope.hasActions = !isEmpty(availableActions);

            $scope.processAction = function (action) {
                actionManager.processAction(
                    action,
                    function (action) {
                        messageService
                            .bulkAction(action.name, message)
                            .then(function () {
                                $state.go($state.params.previousState.state, {keepMessageQueue: true}, {reload: true});
                                $timeout(function() {
                                    $rootScope.$broadcast('refreshEntries');
                                });
                            });
                    }
                );
            };

        }
    ]);