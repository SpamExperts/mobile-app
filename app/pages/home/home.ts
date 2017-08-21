import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { ListPage } from "../list/list";
import { IncomingService } from '../../core/incoming.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, public api: Api, public incService: IncomingService, public menu: MenuController) {



    }

    public getIncomingMessages(): any {
        //this.navCtrl.push(ListPage);
        this.navCtrl.setRoot(ListPage);
    }

    ionViewDidLeave(){
        this.menu.enable(true,'menu2');
    }

    ionViewDidLoad(){
        this.menu.enable(false,'menu2');
    }
}