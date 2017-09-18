import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, NavController, PopoverController } from 'ionic-angular';
import { IncomingService } from '../../core/incoming.service';
import { Api } from '../../core/api.service';
import { ActionService } from '../../core/action.service';
import { BaseListComponent } from './list.base.component';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class IncomingPage extends BaseListComponent {

    @ViewChild('list') list: any;

    constructor(
        public navCtrl: NavController,
        public listService: IncomingService,
        public api: Api,
        public menu: MenuController,
        public events: Events,
        public popoverCtrl: PopoverController,
        public actionService: ActionService,
    ) {
        super(navCtrl, listService, api, menu, events, popoverCtrl, actionService);
        this.messageType = 'Incoming';
    }

    ionViewDidEnter() {
        this.actionService.type = 'incomingMessages';
    }

}