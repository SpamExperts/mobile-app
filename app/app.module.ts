import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { ListPage } from './pages/list/list';
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

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        HomePage,
        ListPage,
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
        IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
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
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions]
        }
    ]
})
export class AppModule {}
