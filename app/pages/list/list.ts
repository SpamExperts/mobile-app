import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IncomingService } from '../../core/incoming.service';
import { MessageDetailsPage } from '../message-details/message-details.component';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  selectedItem: any;
  icons: string[];
  items: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public incService: IncomingService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.icons = this.incService.getMessages();

    // Let's populate this page with some filler content for funzies
    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push(this.icons[i]);
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(MessageDetailsPage, {
      item: item
    });
  }
}
