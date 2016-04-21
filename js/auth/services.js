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

            function destroyUserCredentials() {
                authenticatedUsername = '';
                isAuthenticated = false;

                var settings = $localstorage.get('settings');

                if (settings.remember == 'disabled') {
                    Api.clearAuth();
                    $localstorage.set('settings', defaultSettings);
                }
                $localstorage.cleanup();
            }

            var login = function(hostname, username, password, remember) {

                if (isEmpty(token) ||
                    settings.hostname != hostname ||
                    settings.username != username ||
                    settings.password != password
                ) {
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
                                role    : response.role || '',
                                password: password,
                                remember: remember
                            });

                        useCredentials(response.username, response.role);
                    })
                    .error(function (error) {
                        Api.clearAuth();
                    });
            };

            var logout = function() {
                destroyUserCredentials();
            };

            var isAuthorized = function(authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (isAuthenticated && authorizedRoles.indexOf(authenticatedUserRole) !== -1);
            };

            return {
                login: login,
                logout: logout,
                isAuthorized: isAuthorized,
                isAuthenticated: function() {return isAuthenticated;},
                username: function() {return authenticatedUsername;},
                role: function() {return authenticatedUserRole;},
                getUserCredentials: function() {
                    return $localstorage.get('settings', defaultSettings);
                }
            };
        }
    ]);