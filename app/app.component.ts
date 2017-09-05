import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { StorageService } from './core/storage.service';
import { Alert } from './pages/common/alert';
import { PermissionService } from './core/permissions.service';
import { SecureStorageService } from './core/secureStorage.service';
import { ListPage } from './pages/list/list';
declare var cordova: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app.html'
})
export class MyApp implements OnInit {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;
    userRole: string = '';
    username: string = '';
    public alert: Alert = new Alert(this.alertCtrl);
    incomingButton: boolean = false;
    outgoingButton: boolean = false;
    public secure: any;

    pages: Array<{title: string, component: any}>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public storageService: StorageService,
        public alertCtrl: AlertController,
        public permissionService: PermissionService,
        public secureStorageService: SecureStorageService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {

            this.statusBar.styleDefault();
            this.splashScreen.hide();


            if(this.platform.is('cordova')) {
                this.platform.ready().then(
                    () => {
                        this.secureStorageService.CreateStorage();
                        this.secure = new cordova.plugins.SecureStorage(
                            () => {
                                // console.log(this.secureStorageService.getStorageItem('rememberMe'));

                            },
                            () => {
                                // bring up Lock settings because secure storage doesn't work if the phone is not secure
                                this.secureStorageService.bringUpLockSettings();
                            },
                            'mobileSecureStorage'
                        );
                    }

                );

                if(this.secureStorageService.safeStorage['token'] != null && this.secureStorageService.safeStorage['rememberMe'] == 'true') {
                    this.rootPage = HomePage;
                }
            } else {
                this.userRole = this.storageService.getUserRole();
                this.username = this.storageService.getUsername();
                if (this.storageService.getToken() != null && this.storageService.getRememberMe() == 'true') {
                    this.rootPage = HomePage;
                }
            }


        });
    }


    ngOnInit() {
        this.userRole = this.secureStorageService.safeStorage['role'];
        this.username = this.secureStorageService.safeStorage['username'];
    }

    ngAfterViewInit() {
    }

    openPage(page) {
        if (page == 'ListPage') {
            this.nav.setRoot(ListPage);
        } else if (page == 'HomePage') {
            this.nav.setRoot(HomePage);
        }

    }


    logout() {
        this.alert.logoutAlert('Confirm logout!', 'Are you sure you want to log out?', () => {
            this.storageService.clearStorage();
            this.nav.setRoot(LoginPage);
        });
    }
}
