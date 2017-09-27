import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { Api } from './core/api.service';
import { httpFactory } from './core/http.factory';
import { IncomingService } from './core/incoming.service';
import { MessageDetailsPage } from './pages/message-details/message-details.component';
import { TabsPage } from './pages/tabs/tabs.component';
import { PlainPage } from './pages/tabs/tab-views/plain/plain.component';
import { RawPage } from './pages/tabs/tab-views/raw/raw.component';
import { NormalPage } from './pages/tabs/tab-views/normal/normal.component';
import { PopoverPage } from './pages/common/popover/popover.component';
import { SearchPage } from './pages/search/search.component';
import { StorageService } from './core/storage.service';
import { PermissionService } from './core/permissions.service';
import { ActionService } from './core/action.service';
import { SecureStorageService } from './core/secureStorage.service';
import { SecureStorage } from '@ionic-native/secure-storage';
import { OutgoingPage } from './pages/list/list.outgoing';
import { IncomingPage } from './pages/list/list.incoming';
import { OutgoingService } from './core/outgoing.service';

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        HomePage,
        OutgoingPage,
        IncomingPage,
        MessageDetailsPage,
        PlainPage,
        TabsPage,
        RawPage,
        NormalPage,
        PopoverPage,
        SearchPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp, {
            tabsPlacement: 'top',
            backButtonText: '',
            backButtonIcon: 'ios-arrow-back',
        }),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        OutgoingPage,
        IncomingPage,
        LoginPage,
        MessageDetailsPage,
        TabsPage,
        PlainPage,
        RawPage,
        NormalPage,
        PopoverPage,
        SearchPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Api,
        IncomingService,
        OutgoingService,
        StorageService,
        PermissionService,
        ActionService,
        SecureStorageService,
        SecureStorage,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions]
        }
    ]
})
export class AppModule {}
