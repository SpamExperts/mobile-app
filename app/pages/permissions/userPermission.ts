import { PermissionService } from '../../core/permissions.service';
export class UserPermissions {

    userPermissions = {
        admin: {
            userType: 'admin',
            userRole: 'Super-Admin',
            messagesPages: {
                incoming: true,
                outgoing: true
            },
            searchFilter: {
                domain: true,
                sender: true,
                recipient: true,
                dates: true
            },
            actions: {
                release: true,
                whitelistAndRelease: false,
                releaseAndTrain: true,
                remove: true,
                blacklistAndRemove: false,
                purgeQuarantine: false
            }
        },
        domain: {
            userType: 'domain',
            userRole: 'Domain User',
            messagesPages: {
                incoming: true,
                outgoing: true
            },
            searchFilter: {
                domain: false,
                sender: true,
                recipient: true,
                dates: true
            },
            actions: {
                release: true,
                whitelistAndRelease: true,
                releaseAndTrain: true,
                remove: true,
                blacklistAndRemove: true,
                purgeQuarantine: true
            }
        },
        email: {
            userType: 'email',
            userRole: 'Email User',
            messagesPages: {
                incoming: true,
                outgoing: false
            },
            searchFilter: {
                domain: false,
                sender: true,
                recipient: false,
                dates: true
            },
            actions: {
                release: true,
                whitelistAndRelease: false,
                releaseAndTrain: true,
                remove: true,
                blacklistAndRemove: false,
                purgeQuarantine: true
            }
        }
    }

    constructor(public permissionService: PermissionService) {}

}
