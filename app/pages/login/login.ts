import { Component } from '@angular/core';
import { AlertController, MenuController, NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { isUndefined } from 'ionic-angular/util/util';

import { HomePage } from '../home/home';
import { Env } from '../../core/env';
import { Alert } from '../common/alert';
import { StorageService } from '../../core/storage.service';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    readonly endpoint = '/rest/auth/api/token';

    private hostname: string = '';
    private username: string = 'intern';
    private password: string = 'qwe123';
    public alert: Alert = new Alert(this.alertCtrl);
    private rememberMe: boolean = false;

    constructor(public navCtrl: NavController,
                private api: Api,
                public menu: MenuController,
                public alertCtrl: AlertController,
                public storageService: StorageService) {

        this.menu.enable(false, 'searchMenu');
        this.menu.enable(false, 'primaryMenu');

    }

    login() {
        // this should be applied somewhere globally
        let url = Env.DEV_PROXY
            ? this.endpoint
            : this.hostname + this.endpoint;
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
                let userRole = body.userData.role;

                if (isUndefined(token)) {
                    this.alert.showConfirm('Login failed!', ' Please check your credentials!');
                } else if(userRole == 'reseller'){
                    this.alert.showConfirm('Error logging in!', ' Sorry, admin users are not able to use this app yet. Please log in as a domain or email user.');
                } else {
                    this.storageService.setToken(token);
                    this.storageService.setUserRole(body.userData.role);
                    this.storageService.setUsername(body.userData.username);
                    this.storageService.setRememberMe(this.rememberMe.toString());
                    this.navCtrl.setRoot(HomePage);
                }

            }, (error:any) => {
                    this.alert.showConfirm('Login failed!','Please enter your credentials!');
            });
    }

    ionViewDidLeave() {
        this.menu.enable(true,'primaryMenu');
    }
}
