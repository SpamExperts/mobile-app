angular.module('SpamExpertsApp')

    .constant('DEV_PROXY', 'DEV_PROXY_FALSE')

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