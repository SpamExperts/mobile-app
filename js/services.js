angular.module('starter.services', [])

    .factory('Messages', function(Base64, Settings, $http) {
        var messages = {'/incoming': [], '/outgoing': []};
        var message = null;
        var last_count = {'/incoming': 0, '/outgoing': 0};
        var direction = '/incoming';

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
                var endpoint = Settings.getEndpoint();
                endpoint += '/api/log/search/action/get_rows_json/searchCriteria/' + JSON.stringify(searchCriteria);
                if (direction == '/outgoing') endpoint += '/outgoing/1';

                return $http.get(endpoint).
                success(function(resp) {

                    if (resp.new_entries) {
                        messages[direction] = resp.new_entries.concat(messages[direction]);
                    } else {
                        messages[direction] = messages[direction].concat(resp.entries);
                    }
                    last_count[direction] = resp.last_count;
                }).
                error(function(err) {
                    console.log('ERR', err);
                }).
                finally(function() {

                });
            },
            bulkAction: function (action, selection) {
                var endpoint = Settings.getEndpoint();

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
            get: function(endpoint, message_id) {
                for (var i = 0; i < messages[direction].length; i++) {
                    if (messages[direction][i].message_id === message_id) {
                        message = messages[direction][i];
                    }
                }
                if (message) {

                    var spamMessages = [
                        (direction == '/outgoing'
                                ? message.user
                                : message.recipient
                        ),
                        message.message_id,
                        message.host,
                        message.datestamp
                    ];

                    spamMessages = JSON.stringify([spamMessages.join('|')]);
                    //console.log(spamMessages);
                    endpoint += '/api/log/search/action/view/spam_messages/' + spamMessages;
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

    .factory('Settings',
        ['Base64', '$http', '$localstorage',
            function (Base64, $http, $localstorage) {
                var service = {};

                service.saveSettings = function (settings) {
                    //console.log('save settings');
                    if (settings.username && settings.password) {
                        settings.authdata = Base64.encode(settings.username + ':' + settings.password);
                        //console.log(settings.authdata);
                        delete settings.username;
                        delete settings.password;
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + settings.authdata;
                        $localstorage.setObject('settings', settings);
                    }
                };

                service.getSettings = function () {
                    var settings = $localstorage.getObject('settings');
                    if (settings.authdata) {
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + settings.authdata;
                        var authdata = Base64.decode(settings.authdata).split(':');
                        settings.username = authdata[0];
                        settings.password = authdata[1];
                    }
                    return settings;
                };

                service.clearAuth = function () {
                    $http.defaults.headers.common.Authorization = 'Basic ';
                };

                service.getEndpoint = function() {
                    var settings = $localstorage.getObject('settings');
                    var protocol = "http://";
                    var hostname = settings.hostname;
                    return protocol + hostname;
                };

                return service;
            }
        ]
    )

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
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    })

    .service('AuthService', function($q, $http, USER_ROLES) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var username = '';
        var isAuthenticated = false;
        var role = '';
        var authToken;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            username = token.split('.')[0];
            isAuthenticated = true;
            authToken = token;

            if (username == 'admin') {
                role = USER_ROLES.admin
            }
            if (username == 'user') {
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
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var login = function(hostname, name, pw) {


            //service.saveSettings = function (settings) {
            //    //console.log('save settings');
            //    if (settings.username && settings.password) {
            //        settings.authdata = Base64.encode(settings.username + ':' + settings.password);
            //        //console.log(settings.authdata);
            //        delete settings.username;
            //        delete settings.password;
            //        $http.defaults.headers.common['Authorization'] = 'Basic ' + settings.authdata;
            //        $localstorage.setObject('settings', settings);
            //    }
            //}

            var authData = Base64.encode(settings.username + ':' + settings.password);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + settings.authdata;

            return $http()
                .success(function (response) {
                    if (response) {
                        storeUserCredentials(name + '.' + response);
                        resolve('Login success.');
                    }
                    $http.defaults.headers.common['Authorization'] = 'Basic '
                })
                .error(error, function () {
                    $http.defaults.headers.common['Authorization'] = 'Basic '
                    reject('Login Failed.');
                });

            //$q(function(resolve, reject) {
            //    if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
            //        // Make a request and receive your auth token from your server
            //        storeUserCredentials(name + '.yourServerToken');
            //        resolve('Login success.');
            //    } else {
            //        reject('Login Failed.');
            //    }
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

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });
