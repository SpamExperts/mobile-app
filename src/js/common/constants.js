// Define constants
angular.module('SpamExpertsApp')

    /**
     *  Development constant that will be replaced by gulp tasks 'add-proxy', 'remove-proxy'
     *  when using ionic serve/ionic emulate
     */
    .constant('DEV_PROXY', 'DEV_PROXY_FALSE')

    /**
     * Different config constants
     *
     * sliceLength - slice of messages to be fetched
     * apiTimeout - display notification of API request taking too long (seconds)
     * notificationsTimeout - notification messages will be auto-removed after x seconds
     * dateFormat - date time format (be careful with this)
     */
    .constant('OTHERS', {
        sliceLength: 500,
        apiTimeout: 10,
        notificationsTimeout: 10,
        dateFormat: 'yyyy-MM-dd HH:mm'
    })

    /**
     * Groups constants
     */
    .constant('GROUPS', {
        incoming: 'incoming',
        outgoing: 'outgoing'
    })

    /**
     * Supported user roles
     */
    .constant('USER_ROLES', {
        admin:  'Super-Admin',
        domain: 'Domain User',
        email:  'Email User',
        public: 'public_role'
    })

    /**
     * API events constants - see $rootScope.$on(API_EVENTS.event)
     */
    .constant('API_EVENTS', {
        notAuthenticated: 'not-authenticated',
        notAuthorized: 'not-authorized',
        serverError: 'server-error',
        serviceUnavailable: 'server-unavailable',
        notFound: 'not-found'
    })

    /**
     * Routes descriptor, side menu and dash are also generated from this constant
     * (constants get injected for role permissions)
     * data: {
     *      state: 'state name',
     *      name: 'resource name',
     *      icon: 'css icon class'
     *      noDash: 'bool display on dash',
     *      noSide: 'bool display on side-menu',
     *      authorizedRoles: [authorized roles]
     *     }
     */
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
                    icon: 'ion-ios-home',
                    noDash: true,
                    authorizedRoles: [constant['USER_ROLES'].admin, constant['USER_ROLES'].domain, constant['USER_ROLES'].email]
                }
            },
            {

                name: 'Incoming',
                icon: 'ion-ios-cloud-upload',
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
                            name: 'Incoming Filtering Quarantine',
                            icon: 'ion-ios-cloud-upload-outline',
                            authorizedRoles: [constant['USER_ROLES'].admin, constant['USER_ROLES'].domain, constant['USER_ROLES'].email]
                        }
                    }
                ]
            },
            {
                name: 'Outgoing',
                icon: 'ion-ios-cloud-download',
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
                            name: 'Outgoing Filtering Quarantine',
                            icon: 'ion-ios-cloud-download-outline',
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

    /**
     * API ENDPOINTS constant
     * resource: {
     *     action: {
     *         method: GET/POST/PUT/DELETE,
     *         endpoint: 'rest endpoint without hostname',
     *         loading: bool - display screen loading for this action - see BusyService,
     *
     *
     *     }
     * }
     */
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
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                releaseandwhitelist: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandwhitelist/delivery',
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandtrain/delivery',
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/delivery',
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                removeandblacklist: {
                    method: 'DELETE',
                    endpoint: '/rest/log/removeandblacklist/delivery',
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                view: {
                    method: 'GET',
                    endpoint: '/rest/log/view/delivery',
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: false
                },
                purge: {
                    method: 'DELETE',
                    endpoint: '/rest/log/quarantined/delivery',
                    params: ['recipient', 'message_id', 'filtering_host', 'datetime', 'sender'],
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
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                releaseandwhitelist: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandwhitelist/submission',
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandtrain/submission',
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/submission',
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                removeandblacklist: {
                    method: 'DELETE',
                    endpoint: '/rest/log/removeandblacklist/submission',
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                },
                view: {
                    method: 'GET',
                    endpoint: '/rest/log/view/submission',
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: false
                },
                purge: {
                    method: 'DELETE',
                    endpoint: '/rest/log/quarantined/submission',
                    params: ['full_username', 'message_id', 'filtering_host', 'datetime', 'sender'],
                    loading: true
                }
            }
        }
    })

    /**
     * Right side menu search criteria form
     */
    .constant('SEARCH_CRITERIA', {
        logSearch: {
            fields: [
                {
                    label: 'Domain',
                    type: 'text',
                    model: 'domain',
                    required: true,
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].admin
                            ].indexOf(params['role']);
                    }
                },
                {
                    label: 'Sender',
                    type: 'email',
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
                    type: 'email',
                    model: 'recipient',
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].admin,
                                constant['USER_ROLES'].domain
                            ].indexOf(params['role'])
                            || params['direction'] == constant['GROUPS'].outgoing;
                    }
                }
            ],
            actions: [
                {
                    label: 'Search messages',
                    cssClass: 'button button-block button-dark icon-left ion-ios-search-strong se-bold',
                    action: 'doSearch()'
                },
                {
                    label: 'Clear search',
                    cssClass: 'button button-block button-light metallic-border',
                    action: 'doReset()'
                }
            ]
        }
    })

    /**
     * Actions that can be performed on selected messages
     */
    .constant('BULK_ACTIONS', {
        logSearch: {
            actionSheet: [
                {
                    name: 'release',
                    icon: 'ion-checkmark-round',
                    text: 'Release',
                    confirmText:
                        'The email(s) that you have selected previously will be released.%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                },
                {
                    name: 'releaseandwhitelist',
                    icon: 'ion-close-round',
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
                    icon: 'ion-funnel',
                    confirmText:
                    'Choosing \'Release and Train\', for one or several messages, might adversely' +
                    ' affect the quality of filtering for all the existing users.' +
                    'Please avoid any mistakes in your selection!%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                },
                {
                    name: 'remove',
                    icon: 'ion-minus-circled',
                    text: 'Remove',
                    confirmText: 'The email(s) that you have selected will be removed.%s Are you sure you want to continue?'
                    ,
                    isDivider: true,
                    condition: adminOrIncoming
                },
                {
                    name: 'removeandblacklist',
                    icon: 'ion-ios-list',
                    text: 'Blacklist and remove',
                    confirmText:
                    'You have chosen to remove the email and blacklist the sender.' +
                    'Please note, emails from blacklisted senders are immediately discarded.%s' +
                    'Are you sure you wish to blacklist these senders ?',
                    condition: domainAndIncoming
                },
                {
                    name: 'purge',
                    icon: 'ion-trash-a',
                    text: 'Purge Quarantine',
                    cssClass: 'se-purge-button',
                    confirmText:
                    'You are going to empty your spam quarantine folder.%s' +
                    'ALL its messages will be removed.%s' +
                    'Please keep in mind that messages might still appear in the list while we\'re processing this action.%s' +
                    'Are you sure you want to do this?',
                    isDivider: true,
                    condition: domainAndEmailAndIncoming
                }
            ],
            bar: [
                {
                    name: 'release',
                    icon: 'ion-checkmark-round',
                    text: 'Release',
                    confirmText:
                        'The email(s) that you have selected previously will be released.%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                },
                {
                    name: 'remove',
                    icon: 'ion-close-round',
                    text: 'Remove',
                    confirmText: 'The email(s) that you have selected will be removed.%s Are you sure you want to continue?'
                    ,
                    condition: adminOrIncoming
                }
            ],
            tapAction: [{
                condition: adminOrIncoming
            }]
        }
    });