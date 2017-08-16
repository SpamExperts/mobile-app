import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    readonly endpoint = '/rest/auth/token';

    //private hostname: string = 'server1.test25.simplyspamfree.com';
    private username: string = 'intern';
    private password: string = 'qwe123';

    constructor(public navCtrl: NavController, private api: Api) {

    }

    login() {
        let url = this.endpoint;

        let headers = new Headers();
        let auth = btoa(decodeURIComponent(
            encodeURIComponent(this.username + ':' + this.password))
        );

        headers.append('X-Requested-With','XMLHttpRequest');
        headers.append('Authorization', 'Basic ' + auth);

        console.log(headers);
        let token: string = '';

        this.api.get(url, headers)
            .subscribe((data: any) => {
                let body = JSON.parse(data._body);
                token = body.token;
                console.log(token);
                localStorage.setItem('token', token);
                if(token != null)
                    this.navCtrl.push(HomePage);

            });
    }

}
