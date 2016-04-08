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
            state: 'main.dash',
            route: '/dash'
        },
        {
            title: 'Incoming',
            icon: 'ion-log-in',
            state: 'main.incoming',
            route: '/incoming'
        },
        {
            title: 'Outgoing',
            icon: 'ion-log-out',
            state: 'main.outgoing',
            route: '/outgoing'
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
            endpoint: '/api/log/search/action/authenticate'
        },
        incoming: {
            logSearch: {
                get: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/get_rows_json/searchCriteria/%s'
                },
                release: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/%s/spam_messages/%s/'
                },
                releaseandtrain: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/%s/spam_messages/%s/'
                },
                remove: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/%s/spam_messages/%s/'
                },
                view: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/view/spam_messages/%s/'
                }
            }
        },
        outgoing: {
            logSearch: {
                get: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/get_rows_json/searchCriteria/%s/outgoing/1'
                },
                release: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/%s/spam_messages/%s/outgoing/1'
                },
                releaseandtrain: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/%s/spam_messages/%s/outgoing/1'
                },
                remove: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/%s/spam_messages/%s/outgoing/1'
                },
                view: {
                    method: 'GET',
                    endpoint: '/api/log/search/action/view/spam_messages/%s/outgoing/1'
                }
            }
        }
    })
;
