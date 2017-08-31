import { Injectable } from '@angular/core';

@Injectable()
export class PermissionService {

    userRoleString = '';
    messagesPages = {
        incoming: false,
        outgoing: false
    }
    actions = {
        release: false,
        whitelistAndRelease: false,
        releaseAndTrain: false,
        remove: false,
        blacklistAndRemove: false,
        purgeQuarantine: false
    }
    searchFilter = {
        domain: false,
        sender: false,
        recipient: false,
        dates: false // not sure if this is necessary, cause dates care available for all of them
    };

    constructor() {

    }

    public initializeUser(userType: string): boolean{

        if (userType == 'admin') {

            this.userRoleString = 'Super-Admin';

            this.messagesPages = {
                incoming: true,
                outgoing: true
            };

            this.searchFilter = {
                domain: true,
                sender: true,
                recipient: true,
                dates: true
            };

            this.actions = {
                release: true,
                whitelistAndRelease: false,
                releaseAndTrain: true,
                remove: true,
                blacklistAndRemove: false,
                purgeQuarantine: false
            };

        } else if (userType == 'domain'){

            this.userRoleString = 'Domain User';

            this.actions = {
                release: true,
                whitelistAndRelease: true,
                releaseAndTrain: true,
                remove: true,
                blacklistAndRemove: true,
                purgeQuarantine: true
            };

            this.messagesPages = {
                incoming: true,
                outgoing: true
            };

            this.searchFilter = {
                domain: false,
                sender: true,
                recipient: true,
                dates: true
            }

        } else if (userType == 'email') {

            this.userRoleString = 'Email User';

            this.actions = {
                release: true,
                whitelistAndRelease: false,
                releaseAndTrain: true,
                remove: true,
                blacklistAndRemove: false,
                purgeQuarantine: true
            };

            this.messagesPages = {
                incoming: true,
                outgoing: false
            }

            this.searchFilter = {
                domain: false,
                sender: true,
                recipient: false,
                dates: true
            }
        }
        return true;
    }

}