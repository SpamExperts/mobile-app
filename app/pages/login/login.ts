import { Component } from '@angular/core';
import { AlertController, MenuController, NavController, Platform } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { isUndefined } from 'ionic-angular/util/util';

import { HomePage } from '../home/home';
import { Env } from '../../core/env';
import { Alert } from '../common/alert';
import { StorageService } from '../../core/storage.service';
import { PermissionService } from '../../core/permissions.service';
import { SecureStorageService } from '../../core/secureStorage.service';
import { UserPermissions } from '../permissions/userPermission';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    readonly endpoint = '/rest/auth/api/token';

    private hostname: string = '';
    private username: string = '';
    private password: string = '';
    public alert: Alert = new Alert(this.alertCtrl);
    private rememberMe: boolean = false;
    public permissions: UserPermissions;

    constructor(public navCtrl: NavController,
                private api: Api,
                public menu: MenuController,
                public alertCtrl: AlertController,
                public storageService: StorageService,
                public permissionsService: PermissionService,
                public platform: Platform,
                public secureStorage: SecureStorageService
                ) {

        this.menu.enable(false, 'searchMenu');
        this.menu.enable(false, 'primaryMenu');

    }

    login() {
        // this should be applied somewhere globally
        let url = Env.DEV_PROXY
            ? this.endpoint
            : 'https://' +  this.hostname + this.endpoint;
        let headers = new Headers();
        console.log(Env.DEV_PROXY);
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
                    if (this.platform.is('cordova')) {

                        this.secureStorage.setStorageItem('token', token);
                        this.secureStorage.setStorageItem('role', body.userData.role);
                        this.secureStorage.setStorageItem('username', body.userData.username);
                        this.secureStorage.setStorageItem('rememberMe', this.rememberMe.toString());
                        this.permissionsService.setPermissions(userRole);
                        this.navCtrl.setRoot(HomePage);

                    } else {
                    // // used to make things work on browser
                    this.storageService.setToken(token);
                    this.storageService.setUserRole(body.userData.role);
                    this.permissionsService.setPermissions(userRole);
                    this.storageService.setUsername(body.userData.username);
                    this.storageService.setRememberMe(this.rememberMe.toString());
                    this.navCtrl.setRoot(HomePage);
                    }
                }

            }, (error:any) => {
                    this.alert.showConfirm('Login failed!',error);
            });
    }

    ionViewDidLeave() {
        this.menu.enable(true,'primaryMenu');
    }
}
