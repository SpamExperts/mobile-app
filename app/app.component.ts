import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './pages/home/home';
import { ListPage } from './pages/list/list';
import { LoginPage } from './pages/login/login';
import { StorageService } from './core/storage.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;

    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                public storageService: StorageService) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'List', component: ListPage }
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            console.log(this.storageService.getRememberMe() == 'true');
            console.log(this.storageService.getToken() != null);
            if (this.storageService.getToken() != null && this.storageService.getRememberMe() == 'true') {
                this.rootPage = HomePage;
            }
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

    logout() {
        localStorage.clear();
        this.nav.setRoot(LoginPage);
    }
}
