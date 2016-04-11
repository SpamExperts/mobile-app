SpamExpertsApp
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin:  'admin_role',
        domain: 'domain_role',
        email:  'email_role',
        public: 'public_role'
    })

    .constant('GROUPS', {
        incoming: 'incoming',
        outgoing: 'outgoing'
    })

    .constant('MENU_ITEMS', [
        {
            title: 'Dashboard',
            icon: 'ion-ios-gear-outline',
            state: 'main.dash'
        },
        {
            title: 'Incoming',
            icon: 'ion-log-in',
            state: 'main.incoming'
        },
        {
            title: 'Outgoing',
            icon: 'ion-log-out',
            state: 'main.outgoing'
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
                icon: 'ion-trash-a'
            },
            {
                name: 'remove',
                text: 'Remove',
                confirmText: 'Are you sure you want to remove the selected messages?',
                icon: 'ion-ios-checkmark-outline'
            },
            {
                name: 'releaseandtrain',
                text: 'Release and train',
                confirmText: 'Are you sure you want to release and train the selected messages?',
                icon: 'ion-share'
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
                }
            }
        }
    })
;
