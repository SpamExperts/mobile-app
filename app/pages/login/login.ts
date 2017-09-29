import { Component } from '@angular/core';
import { AlertController, Events, MenuController, NavController, Platform } from 'ionic-angular';
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
import { IncomingService } from '../../core/incoming.service';
import { OutgoingService } from '../../core/outgoing.service';

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
    public auth: boolean;

    constructor(public navCtrl: NavController,
                private api: Api,
                public menu: MenuController,
                public alertCtrl: AlertController,
                public storageService: StorageService,
                public permissionsService: PermissionService,
                public platform: Platform,
                public secureStorage: SecureStorageService,
                public events: Events,
                public incomingService: IncomingService ,
                public outgoingService: OutgoingService
                ) {

        this.menu.enable(false, 'searchMenu');
        this.menu.enable(false, 'primaryMenu');

        console.log(this.incomingService.currentDomain);

    }

    login() {

        console.log(this.incomingService.currentDomain);

        this.incomingService.refreshData();
        this.outgoingService.refreshData();

        // this should be applied somewhere globally
        let url = Env.DEV_PROXY
            ? this.endpoint
            : 'https://' +  this.hostname + this.endpoint;

        this.incomingService.hostname = this.hostname;
        this.outgoingService.hostname = this.hostname;

        // let url = this.interceptor.getURL(this.endpoint, this.hostname);
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
                    if (this.platform.is('cordova')) {
                        this.secureStorage.setStorageItem('token', token);
                        this.secureStorage.setStorageItem('role', body.userData.role);
                        this.secureStorage.setStorageItem('username', body.userData.username);
                        this.secureStorage.setStorageItem('rememberMe', this.rememberMe.toString());
                        if(this.rememberMe == true) {
                            localStorage.setItem('movetoHome', 'true');
                        }
                        this.permissionsService.setPermissions(userRole);
                        this.permissionsService.setUsername(body.userData.username);
                        localStorage.setItem('token', token);  // this needs to be changed with http interceptor implementation for secure storage
                        localStorage.setItem('rememberMe', this.rememberMe.toString());
                        this.navCtrl.setRoot(HomePage);

                    } else {
                    // used to make things work on browser
                        this.storageService.setToken(token);
                        this.storageService.setUserRole(body.userData.role);
                        this.permissionsService.setPermissions(userRole);
                        this.permissionsService.setUsername(body.userData.username);
                        this.storageService.setUsername(body.userData.username);
                        this.storageService.setRememberMe(this.rememberMe.toString());
                        this.navCtrl.setRoot(HomePage);
                    }
                }

            }, (error:any) => {
                    this.alert.showConfirm('Login failed!', 'Please enter your credentials!');
            });

    }

    ionViewDidLeave() {
        this.menu.enable(true,'primaryMenu');
    }
}
