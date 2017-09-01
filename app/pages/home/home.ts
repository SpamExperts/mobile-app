import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { ListPage } from "../list/list";
import { IncomingService } from '../../core/incoming.service';
import { PermissionService } from '../../core/permissions.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    incomingButton: boolean = false;
    outgoingButton: boolean = false;

    constructor(
        public navCtrl: NavController,
        public api: Api,
        public incService: IncomingService,
        public menu: MenuController,
        public permissionsService: PermissionService
    ){
        this.incomingButton = this.permissionsService.permissions.messagesPages.incoming;
        this.outgoingButton = this.permissionsService.permissions.messagesPages.outgoing;

    }

    public getIncomingMessages(): any {
        this.navCtrl.setRoot(ListPage);
    }

    ionViewDidLeave() {
        this.menu.enable(true,'searchMenu');
    }

    ionViewDidEnter() {
        this.menu.enable(false,'searchMenu');
    }
}