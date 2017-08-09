import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    readonly endpoint = '/rest/auth/token';

    // private hostname: string = 'server1.test39.simplyspamfree.com';
    private username: string = 'example.com';
    private password: string = 'qwe123';

    constructor(public navCtrl: NavController, private api: Api) {

    }

    login() {
        let url = this.endpoint;
        let headers = new Headers();

        headers.append('X-Requested-With','XMLHttpRequest');
        headers.append('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));

        console.log(headers);

        this.api.get(url, headers)
            .subscribe((data: any) => {
                console.log(data);
            });

    }

}
