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
            state: 'main.dash'
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
                name: 'remove',
                text: 'Remove',
                confirmText: 'Are you sure you want to remove the selected messages?',
                icon: 'ion-minus-circled'
            },
            {
                name: 'releaseandtrain',
                text: 'Release and train',
                confirmText: 'Are you sure you want to release and train the selected messages?',
                icon: 'ion-funnel'
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
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/restlog/releaseandtrain/delivery'
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/delivery'
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
                releaseandtrain: {
                    method: 'PUT',
                    endpoint: '/restlog/releaseandtrain/submission'
                },
                remove: {
                    method: 'DELETE',
                    endpoint: '/rest/log/remove/submission'
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