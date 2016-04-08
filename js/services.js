angular.module('starter')
    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])
    .service('AuthService', function($q, $http, $localstorage, Base64, USER_ROLES) {
        //var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var username = '';
        var isAuthenticated = false;
        var role = '';
        var authToken;

        function loadUserCredentials() {
            var settings = $localstorage.getObject('settings');

            var token = window.localStorage.getItem(settings.token);
            if (token) {
                useCredentials(username, token);
            }
        }

        function storeUserCredentials(hostname, username, token) {
            $localstorage.setObject('settings', {
                hostname: hostname,
                username: username,
                token: token
            });
            useCredentials(username, token);
        }

        function useCredentials(username, token) {
            isAuthenticated = true;
            authToken = token;

            if (username) {
                role = USER_ROLES.admin
            } else {
                role = USER_ROLES.public
            }

            // Set the token as header for your requests!
            $http.defaults.headers.common['X-Auth-Token'] = token;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['X-Auth-Token'] = undefined;
            $localstorage.setObject('settings', {
                hostname: '',
                username: '',
                token: ''
            });
        }

        var login = function(hostname, username, password) {

            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(username + ':' + password);
            var protocol = 'http://';

            return $http
                .get(protocol + hostname + '/api/log/search/action/authenticate')
                .success(function(response) {
                    if (response.token) {
                        storeUserCredentials(hostname, username, response.token);
                    }
                    $http.defaults.headers.common.Authorization = 'Basic ';
                })
                .error(function (error) {
                    $http.defaults.headers.common.Authorization = 'Basic ';
                });

            //return $q(function(resolve, reject) {
            //  if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
            //    // Make a request and receive your auth token from your server
            //    storeUserCredentials(name + '.yourServerToken');
            //    resolve('Login success.');
            //  } else {
            //    reject('Login Failed.');
            //  }
            //});
        };

        var logout = function() {
            destroyUserCredentials();
        };

        var isAuthorized = function(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };

        loadUserCredentials();

        return {
            login: login,
            logout: logout,
            isAuthorized: isAuthorized,
            isAuthenticated: function() {return isAuthenticated;},
            username: function() {return username;},
            role: function() {return role;}
        };
    })


    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })
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
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    })

    .factory('Messages', function($http, $localstorage) {
        var messages = {'/incoming': [], '/outgoing': []};
        var message = null;
        var last_count = {'/incoming': 0, '/outgoing': 0};
        var direction = '/incoming';

        var protocol = "http://";
        var settings = $localstorage.getObject('settings');
        var baseEndpoint = protocol + settings.hostname;

        return {
            getDirection: function () {
                return direction;
            },
            setDirection: function (dir) {
                if (!dir) {
                    direction = '/incoming';
                } else {
                    direction = dir;
                }
            },
            refresh: function () {
                return messages[direction];
            },
            messages: function () {
                return messages[direction];
            },
            toggleSelection: function (toggle) {
                angular.forEach(messages[direction], function(value, key) {
                    if (1 || value.status=='quarantined' && value.classification=='Rejected') {
                        value.isChecked = toggle;
                    }
                });
            },
            //messages: messages,
            count: function() {
                return messages[direction].length;
            },
            message: function () {
                return message;
            },
            getLastCount: function() {
                return last_count[direction];
            },
            fetch: function(searchCriteria) {
                var endpoint = baseEndpoint;
                endpoint += '/api/log/search/action/get_rows_json/searchCriteria/' + JSON.stringify(searchCriteria);
                if (direction == '/outgoing') endpoint += '/outgoing/1';

                console.log(searchCriteria);

                return $http.get(endpoint)
                    .success(function(resp) {

                        if (resp.new_entries) {
                            messages[direction] = resp.new_entries.concat(messages[direction]);
                        } else {
                            messages[direction] = messages[direction].concat(resp.entries);
                        }
                        last_count[direction] = resp.last_count;
                    })
                    . error(function(err) {
                        console.log('ERR', err);
                    })
                    .finally(function() {

                    });
            },
            bulkAction: function (action, selection) {
                var endpoint = baseEndpoint;

                //test@example.com|1YiJCV-0003iL-94|server1.test21.simplyspamfree.com|2015-04-15 10:01
                var params = [];

                angular.forEach(selection, function(value, key) {
                    this.push([value.recipient, value.message_id, value.host, value.datestamp].join('|'));
                }, params);

                endpoint += '/api/log/search/action/'+ action + '/spam_messages/' + JSON.stringify(params);
                if (direction == '/outgoing') endpoint += '/outgoing/1';

                return $http.get(endpoint).
                success(function(resp) {
                }).
                error(function(err) {
                    console.log('ERR', err);
                }).
                finally(function() {

                });

            },
            get: function(message_id) {

                var protocol = "http://";
                var settings = $localstorage.getObject('settings');
                var baseEndpoint = protocol + settings.hostname;

                for (var i = 0; i < messages[direction].length; i++) {
                    if (messages[direction][i].message_id === message_id) {
                        message = messages[direction][i];
                    }
                }

                if (message) {

                    var spamMessages = [
                        (direction == '/outgoing'
                                ? message['user']
                                : message['recipient']
                        ),
                        message['message_id'],
                        message['host'],
                        message['datestamp']
                    ];

                    spamMessages = JSON.stringify([spamMessages.join('|')]);
                    //console.log(spamMessages);
                    var endpoint = baseEndpoint + '/api/log/search/action/view/spam_messages/' + spamMessages;
                    if (direction == '/outgoing') endpoint += '/outgoing/1';

                    //console.log(endpoint);

                    return $http.get(endpoint).
                    success(function(resp){
                        message.details = resp.mail;
                    }).
                    error(function(err) {
                        console.log('ERR', err);
                    });
                }

                return null;
            },
            wipe: function() {
                //console.log('wipe');
                messages[direction] = [];
                last_count[direction] = null;
            }
        };
    })
    .controller('MessageDetailCtrl', function($scope, $stateParams, $ionicPopup, $window, $location, Messages, SearchCriteria) {
        $scope.message = null;

        $scope.showRaw = false;
        $scope.toggleRaw = function() {
            $scope.showRaw = !$scope.showRaw;
        };

        Messages.setDirection('/' + $stateParams.direction);

        Messages.get($stateParams.messageId).then(function() {
            $scope.message = Messages.message();
        });

        $scope.bulkAction = function(action, messages) {

            var dialogText = '';
            switch (action) {
                case 'remove': dialogText = 'Are you sure you want to remove the selected messages?';break;
                case 'release': dialogText = 'Are you sure you want to release the selected messages?';break;
                case 'releaseandtrain': dialogText = 'Are you sure you want to release and train the selected messages?';break;
                default : dialogText =  'Are you sure you want to continue?';
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm action',
                template: dialogText
            });
            confirmPopup.then(function(res) {
                if (res) {
                    Messages.bulkAction(action, messages)
                        .then(function () {
                            var searchCriteria = SearchCriteria.getSearchCriteria();
                            searchCriteria.offset = 0;
                            searchCriteria.refresh = false;
                            SearchCriteria.setSearchCriteria(searchCriteria);
                            //console.log($scope.searchCriteria);
                            Messages.wipe();
                            $location.path($stateParams.direction);
                            $window.location.reload();

                        });
                    console.log(action);
                } else {
                    console.log('canceled');
                }
            });
        };

    })
    .factory('SearchCriteria',
        ['$localstorage',
            function ($localstorage) {
                var searchCriteria = $localstorage.getObject('searchCriteria') || {};

                return {
                    setSearchCriteria: function(criteria) {
                        searchCriteria = criteria;
                        $localstorage.setObject('searchCriteria', criteria);
                    },

                    getDefaultSearchCriteria: function() {
                        return {
                            since: '2015-04-15 00:00',
                            until: this.getDate(),
                            searchdomain: '',
                            offset: 0,
                            length: 5
                        };
                    },

                    getSearchCriteria: function() {
                        return searchCriteria;
                    },

                    getDate : function() {
                        var now = new Date();
                        var year = now.getFullYear();
                        var month = now.getMonth() + 1;
                        var day = now.getDate();
                        var hour = now.getHours();
                        var min = now.getMinutes();
                        return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) +
                            ' ' + ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2)
                    }
                }
            }
        ]
    )


;
