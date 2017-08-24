import { AlertController } from 'ionic-angular';

export class Alert {
    constructor(public alertCtrl: AlertController) {
    }

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
}