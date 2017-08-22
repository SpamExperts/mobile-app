import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { HomePage } from '../home/home';
import { Env } from '../../core/env';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    readonly endpoint = '/rest/auth/api/token';

    private hostname: string = '';
    private username: string = '';
    private password: string = '';

    constructor(public navCtrl: NavController, private api: Api, public menu: MenuController) {

        this.menu.enable(false, 'menu2');
        this.menu.enable(false, 'menu1');

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
                console.log(token);
                localStorage.setItem('token', token);
                if(token != null) {
                   // this.navCtrl.push(HomePage);
                    //this way the arrow disappears and HomePage becomes the new root
                  //  this.menu.enable(true);
                    this.navCtrl.setRoot(HomePage);
                }
            });
    }

    ionViewDidLeave(){
        this.menu.enable(true,'menu1');
    }
}
