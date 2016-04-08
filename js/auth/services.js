SpamExpertsApp
    .service('AuthService', function($q, $http, $localstorage, Base64, USER_ROLES) {

        var username = '';
        var isAuthenticated = false;
        var role = '';
        var authToken;

        var defaultSettings = {
            hostname: window.location.hostname,
            username: 'nicolae',
            password: '',
            remember: 'disabled'
        };

        var settings = $localstorage.get('settings', defaultSettings, false);
        var token = $localstorage.get('token');

        if (settings.remember == 'enabled' && !angular.equals({}, token)) {
            useCredentials(settings.username, token);
        }

        function storeUserCredentials(hostname, username, password, token, remember) {
            $localstorage.set('settings', {
                hostname: hostname,
                username: username,
                password: (remember == 'enabled' ? password : ''),
                remember: remember
            });

            if (remember == 'enabled') {
                $localstorage.set('token', token);
            } else {
                $localstorage.set('token', {});
            }
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

            var settings = $localstorage.get('settings');

            if (settings.remember == 'disabled') {
                $localstorage.set('settings', defaultSettings);
            }
            $localstorage.cleanup();
        }

        var login = function(hostname, username, password, remember) {

            var token = $localstorage.get('token');

            if (angular.equals({}, token)) {
                $http.defaults.headers.common['X-Auth-Token'] = undefined;
                $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(username + ':' + password);
            } else {
                $http.defaults.headers.common['X-Auth-Token'] = token;
                $http.defaults.headers.common.Authorization = 'Basic ';
            }

            var protocol = 'http://';

            return $http
                .get(protocol + hostname + '/api/log/search/action/authenticate')
                .success(function(response) {
                    if (response.token) {
                        password = Array(password.length+1).join("•");
                        storeUserCredentials(hostname, username, password, response['token'], remember);
                        useCredentials(username, response['token']);
                    }
                    $http.defaults.headers.common.Authorization = 'Basic ';
                })
                .error(function (error) {
                    $http.defaults.headers.common['X-Auth-Token'] = undefined;
                    $http.defaults.headers.common.Authorization = 'Basic ';
                });
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

        return {
            login: login,
            logout: logout,
            isAuthorized: isAuthorized,
            isAuthenticated: function() {return isAuthenticated;},
            username: function() {return username;},
            role: function() {return role;},
            getUserCredentials: function() {
                return $localstorage.get('settings', defaultSettings);
            }
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
    });