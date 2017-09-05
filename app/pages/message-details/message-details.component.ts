import { Component, ViewChild } from '@angular/core';
import { MenuController, Navbar, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { Headers } from '@angular/http';
import { Api } from '../../core/api.service';
import { IncomingService } from '../../core/incoming.service';
import { PopoverPage } from '../common/popover/popover.component';
import { ActionService } from '../../core/action.service';
import { PermissionService } from '../../core/permissions.service';
import { ListPage } from '../list/list';

@Component({
    selector: 'app-message-details',
    templateUrl: './message-details.html'
})
export class MessageDetailsPage {

    @ViewChild(Navbar) navBar: Navbar;

    selectedItem: any;

    constructor(
        public navParams: NavParams,
        public api: Api,
        public incService: IncomingService,
        public popoverCtrl: PopoverController,
        public menu: MenuController,
        public actionService: ActionService,
        public permissionService: PermissionService,
        public navCtrl: NavController,
        public events: Events
    ) {

        let self = this;
        this.events.subscribe('move', function() {
            self.navCtrl.setRoot(ListPage);
            setTimeout(function() {
                self.events.publish('refresh', "");
            }, 2000);
        })

        this.menu.enable(false, 'primaryMenu');
        this.menu.enable(false, 'searchMenu');

        this.selectedItem = navParams.get('item');
        this.incService.selectedItem = this.selectedItem;

        let user_id = this.selectedItem.message_id;
        let filtering_host = this.selectedItem.filtering_host;
        let account = this.selectedItem.recipient + '@' + this.selectedItem.domain;
        let url = '/master/quarantine/delivery/view/' + account + '/' + filtering_host + '/' + user_id + '/';

        let headers = new Headers();

        this.incService.plain = '';

        this.api.get(url + '?message_format=parsed', headers)
            .subscribe((data: any) => {
                let result = JSON.parse(data._body).result;
                this.incService.plain = result.plain_body;
                if (!result.html_body) {
                    this.incService.normal = "This view is not available.";
                }
                else {
                    this.incService.normal = result.html_body;
                }
            });
    }

    //if an item is too long, this function makes it shorter and adds ...
    public shorter(item: any): any {

        return item.length<=18 ? item : item.slice(0,18) + '...';
    }

    openPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

    doAction(method:string) {

        // this.actionService.selectedMessages = [];
        // this.actionService.selectedMessages.push(this.incService.selectedItem);

        this.actionService.action(method);
    }

    ionViewDidLeave(){
        this.menu.enable(true,'primaryMenu');
        this.menu.enable(true,'searchMenu');
        this.incService.selectedItem = undefined;
    }

}


