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

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        HomePage,
        ListPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        LoginPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Api,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions]
        }
    ]
})
export class AppModule {}
