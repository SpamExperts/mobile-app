import { Component, ViewChild } from '@angular/core';
import { MenuController, Navbar, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Headers } from '@angular/http';
import { Api } from '../../core/api.service';
import { IncomingService } from '../../core/incoming.service';
import { PopoverPage } from '../common/popover/popover.component';

@Component({
    selector: 'app-message-details',
    templateUrl: './message-details.html'
})
export class MessageDetailsPage {

    @ViewChild(Navbar) navBar: Navbar;

    selectedItem: any;
    sender: any;
    date: any;
    time: any;

    constructor( public navCtrl: NavController, public navParams: NavParams, public api: Api,
                 public incService: IncomingService, public popoverCtrl: PopoverController,
                 public menu: MenuController ) {

        this.menu.enable(false, 'menu1');
        this.menu.enable(false, 'menu2');

        this.selectedItem = navParams.get('item');
        this.incService.selectedItem = this.selectedItem;

        let user_id = this.selectedItem.message_id;
        let filtering_host = this.selectedItem.filtering_host;
        let account = this.selectedItem.recipient+'@'+this.selectedItem.domain;
        let url= '/master/quarantine/delivery/view/'+account+ '/' + filtering_host + '/' + user_id + '/';

        let headers = new Headers();

        this.incService.plain = '';

        this.api.get(url+'?message_format=parsed',headers)
            .subscribe((data: any) => {
                let result = JSON.parse(data._body).result;
                this.incService.plain = result.plain_body;
            });

        //makes the sender fit to the page
        this.sender = this.shorter(this.selectedItem.sender);

        this.date = this.incService.dateConvert(this.selectedItem.datetime);
        this.time = this.incService.timeConvert(this.selectedItem.datetime);
    }

    //if an item is too long, this function makes it shorter and adds ...
     public shorter(item: any): any {
         let item1 = item;
         if(item1.length > 18) {
             item1 = item1.slice(0,18);
             item1 += '...';
         }
         return item1;
     }

    openPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

    ionViewDidLeave(){
        this.menu.enable(true,'menu1');
        this.menu.enable(true,'menu2');
    }
}


