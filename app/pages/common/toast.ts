import { ToastController } from 'ionic-angular';

export class Toast {

    constructor(private toastCtrl: ToastController) {

    }

    public presentToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'top'
        });

        toast.present();
    }
}