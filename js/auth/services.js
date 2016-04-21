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
                login: function(hostname, username, password, remember) {

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