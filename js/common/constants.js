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
            icon: 'ion-ios-cloud-download',
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
            icon: 'ion-ios-cloud-upload',
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
        logSearch: {
            actionSheet: [
                {
                    name: 'release',
                    icon: 'ion-share',
                    text: 'Release',
                    confirmText: 'The email(s) that you have selected previously will be released.%s Are you sure you want to continue?'
                },
                {
                    name: 'releaseandwhitelist',
                    icon: 'ion-ios-list-outline',
                    text: 'Whitelist and release',
                    confirmText:
                        'You have chosen to release the email and whitelist their senders.' +
                        ' Please note, spammers generally use fake \'from\' addresses trying to match whitelisted ' +
                        'senders so their spam emails bypass the checks.%s Are you sure you wish to whitelist these senders?'
                    ,
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].domain,
                                constant['USER_ROLES'].email
                            ].indexOf(params['role']);
                    }
                },
                {
                    name: 'releaseandtrain',
                    text: 'Release and train',
                    icon: 'ion-funnel',
                    confirmText:
                        'Choosing \'Release and Train\', for one or several messages, might adversely' +
                        ' affect the quality of filtering for all the existing users.' +
                        'Please avoid any mistakes in your selection!%s Are you sure you want to continue?'

                },
                {
                    name: 'remove',
                    icon: 'ion-minus-circled',
                    text: 'Remove',
                    confirmText: 'The email(s) that you have selected will be removed.%s Are you sure you want to continue?'
                },
                {
                    name: 'removeandblacklist',
                    icon: 'ion-ios-list',
                    text: 'Blacklist and remove',
                    confirmText:
                        'You have chosen to remove the email and blacklist the sender.' +
                        'Please note, emails from blacklisted senders are immediately discarded.%s' +
                        'Are you sure you wish to blacklist these senders ?',
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].domain,
                                constant['USER_ROLES'].email
                            ].indexOf(params['role']);
                    }
                }
            ],
            bar: [
                {
                    name: 'purge',
                    icon: 'ion-trash-a',
                    text: 'Empty quarantine',
                    confirmText:
                        'You are going to empty your spam quarantine folder.%s' +
                        'ALL its messages will be removed.%s' +
                        'Please keep in mind that messages might still appear in the list while we\'re processing this action.%s' +
                        'Are you sure you want to do this?',
                    condition: function(params, constant) {
                        return -1 < [
                                constant['USER_ROLES'].domain,
                                constant['USER_ROLES'].email
                            ].indexOf(params['role']);
                    }
                }
            ]
        }
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
                    endpoint: '/rest/log/releaseandtrain/delivery'
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
                    endpoint: '/rest/log/quarantined/delivery'
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
                    endpoint: '/rest/log/releaseandtrain/submission'
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
                    endpoint: '/rest/log/quarantined/submission'
                }
            }
        }
    });