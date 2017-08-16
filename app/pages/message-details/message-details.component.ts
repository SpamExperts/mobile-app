import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'app-message-details',
    templateUrl: './message-details.html'
})
export class MessageDetailsPage {

    selectedItem: any;

    constructor( public navCtrl: NavController, public navParams: NavParams ) {
        this.selectedItem = navParams.get('item');
    }

}