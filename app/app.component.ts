import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { StorageService } from './core/storage.service';
import { Alert } from './pages/common/alert';
import { PermissionService } from './core/permissions.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;
    userRole: string = '';
    username: string = '';
    public alert: Alert = new Alert(this.alertCtrl);
    incomingButton: boolean = false;
    outgoingButton: boolean = false;

    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                public storageService: StorageService,
                public alertCtrl: AlertController,
                public permissionService: PermissionService) {

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {

            this.statusBar.styleDefault();
            this.splashScreen.hide();

            console.log(this.username);

            if (this.storageService.getToken() != null && this.storageService.getRememberMe() == 'true') {
                this.rootPage = HomePage;
            }
        });
    }

    openPage(page) {
        this.nav.setRoot(page);
    }


    logout() {
        this.alert.logoutAlert('Confirm logout!', 'Are you sure you want to log out?', () => {
            this.storageService.clearStorage();
            this.nav.setRoot(LoginPage);
        });
    }
}
