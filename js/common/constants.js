angular.module('SpamExpertsApp')
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin:  'Super-Admin',
        domain: 'Domain User',
        email:  'Email User',
        public: 'public_role'
    })

    .constant('GROUPS', {
        incoming: 'incoming',
        outgoing: 'outgoing'
    })

    .constant('MENU_ITEMS', [
        {
            name: 'Dashboard',
            icon: 'ion-ios-home',
            state: 'main.dash',
            noDash: true
        },
        {
            name: 'Incoming',
            icon: 'ion-log-in',
            items: [
                {
                    name: 'Quarantine',
                    icon: 'ion-email',
                    state: 'main.incomingLogSearch'
                }
            ]
        },
        {
            name: 'Outgoing',
            icon: 'ion-log-out',
            items: [
                {
                    name: 'Quarantine',
                    icon: 'ion-email',
                    state: 'main.outgoingLogSearch'
                }
            ]
        }
    ])

    .constant('OTHERS', {
        sliceLength: 10
    })

    .constant('BULK_ACTIONS', {
        logSearch: [
            {
                name: 'release',
                text: 'Release',
                confirmText: 'Are you sure you want to release the selected messages?',
                icon: 'ion-share'
            },
            {
                name: 'releaseandwhitelist',
                text: 'Release and whitelist',
                confirmText: 'Are you sure you want to release the selected messages and whitelist their recipients?',
                icon: 'ion-ios-list-outline'
            },
            {
                name: 'releaseandtrain',
                text: 'Release and train',
                confirmText: 'Are you sure you want to release and train the selected messages?',
                icon: 'ion-funnel'
            },
            {
                name: 'remove',
                text: 'Remove',
                confirmText: 'Are you sure you want to remove the selected messages?',
                icon: 'ion-minus-circled'
            },
            {
                name: 'removeandblacklist',
                text: 'Remove and blacklist',
                confirmText: 'Are you sure you want to remove the selected messages and blacklist their recipients?',
                icon: 'ion-ios-list'
            }
        ]
    })

    .constant('ENDPOINTS', {
        auth: {
            method: 'GET',
            endpoint: '/rest/auth/token'
        },
        incoming: {
            logSearch: {
                get: {
                    method: 'GET',
                    endpoint: '/rest/log/search/delivery'
                },
                release: {
                    method: 'PUT',
                    endpoint: '/rest/log/release/delivery'
                },
                releaseandwhitelist: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandwhitelist/delivery'
                },
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/restlog/releaseandtrain/delivery'
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/delivery'
                },
                removeandblacklist: {
                    method: 'DELETE',
                    endpoint: '/rest/log/removeandblacklist/delivery'
                },
                view: {
                    method: 'GET',
                    endpoint: '/rest/log/view/delivery'
                },
                purge: {
                    method: 'DELETE',
                    endpoint: 'log/quarantined/delivery'
                }
            }
        },
        outgoing: {
            logSearch: {
                get: {
                    method: 'GET',
                    endpoint: '/rest/log/search/submission'
                },
                release: {
                    method: 'PUT',
                    endpoint: '/rest/log/release/submission'
                },
                releaseandwhitelist: {
                    method: 'PUT',
                    endpoint: '/rest/log/releaseandwhitelist/submission'
                },
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/restlog/releaseandtrain/submission'
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/submission'
                },
                removeandblacklist: {
                    method: 'DELETE',
                    endpoint: '/rest/log/removeandblacklist/submission'
                },
                view: {
                    method: 'GET',
                    endpoint: '/rest/log/view/submission'
                },
                purge: {
                    method: 'DELETE',
                    endpoint: 'log/quarantined/submission'
                }
            }
        }
    });