import { AlertController } from 'ionic-angular';

export class Alert {
    constructor(public alertCtrl: AlertController) {
    }

    public alertMessage = {
        'remove_from_quarantine' : 'The email(s) that you have selected will be removed.        Are you sure you want to continue?',
        'release' : 'The email(s) that you have selected previously will e released.      Are you sure you want to continue?',
        'release_and_train' : "Choosing 'Release and Train' for one or several messages, might adversely affect the quality of filtering for " +
                              "all the existing users. Please avoid any mistakes in your selection!      Are you sure you want to continue? ",
        'whitelist_and_release' : " You have chosen to release the email and whitelist their senders. Please note, spammers generally use" +
                                  " fake 'from' addresses trying to match whitelisted senders so their spam emails bypass the checks. Are you" +
                                  " sure you wish to whitelist these senders? ",
        'blackkist_and_remove' : 'You have chosen to remove the email and blacklist the sender. Please note, emails from blacklisted senders are' +
                                 ' immediately discarded. Are you sure you wish to blacklist these senders ?',
        'remove' : " You are going to empty your spam quarantine folder. ALL its messages will be removed. Please keep in mind that the messages" +
                   " might still appear in the list while we're processing this action. Are you sure you want to to "
    };

    showConfirm(title: string, message: string) {
        let confirm = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => { }
                },
                {
                    text: 'Ok',
                    handler: () => { }
                }
            ]
        });
        confirm.present();
    }

    logoutAlert(title: string, message: string, func: () => void) {
        let confirm = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => { }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        func();
                    }
                }
            ]
        });
        confirm.present();
    }

    actionAlert(title: string, message: string, func: () => void) {
        let confirm = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => { }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        func();
                    }
                }
            ]
        });
        confirm.present();
    }
}