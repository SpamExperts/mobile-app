import { Component } from '@angular/core';
import { MenuController, NavController, ToastController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { HomePage } from '../home/home';
import { Env } from '../../core/env';
import { isUndefined } from 'ionic-angular/util/util';
import { Toast } from '../common/toast';
import { StorageService } from '../../core/storage.service';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    readonly endpoint = '/rest/auth/api/token';

    private hostname: string = '';
    private username: string = '';
    private password: string = '';
    public toast: Toast = new Toast(this.toastCtrl);


    rememberMe: boolean = false;

    constructor(public navCtrl: NavController,
                private api: Api,
                public menu: MenuController,
                public toastCtrl: ToastController,
                public storageService: StorageService) {

        this.menu.enable(false, 'searchMenu');
        this.menu.enable(false, 'primaryMenu');

    }

    login() {
        // this should be applied somewhere globally
        let url = Env.DEV_PROXY
            ? this.endpoint
            : this.hostname + this.endpoint;

        console.log(Env.DEV_PROXY);

        let headers = new Headers();

        let auth = btoa(decodeURIComponent(
            encodeURIComponent(this.username + ':' + this.password))
        );
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', 'Basic ' + auth);
        let token: string = '';


        this.api.get(url, headers)
            .subscribe((data: any) => {
                let body = JSON.parse(data._body);
                token = body.token;
                if(isUndefined(token)) {
                    this.toast.presentToast('Login failed! Please check your credentials!');
                } else {
                    this.storageService.setToken(token);
                    this.storageService.setRememberMe(this.rememberMe.toString());
                    this.navCtrl.setRoot(HomePage);
                }

            }, (error:any) => {
                    this.toast.presentToast('Please enter your credentials!');
            });
    }

    ionViewDidLeave() {
        this.menu.enable(true,'primaryMenu');
    }
}
