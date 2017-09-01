import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PopoverService } from './popover.service';
import { ActionService } from '../../../core/action.service';
import { IncomingService } from "../../../core/incoming.service";
import { PermissionService } from '../../../core/permissions.service';

@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html'
})
export class PopoverPage {

    constructor (
        public viewCtrl: ViewController,
        public popService: PopoverService,
        public actionService: ActionService,
        public incService: IncomingService,
        public permissionService: PermissionService
    ) {}

    close() {
        this.viewCtrl.dismiss();
        this.popService.messageListPop = false;
        this.popService.messageViewPop = false;
    }

    doAction(method: string) {

        if(this.popService.messageViewPop == true) {
            this.actionService.selectedMessages = [];
            this.actionService.selectedMessages.push(this.incService.selectedItem);
        }

        this.actionService.action(method);
        this.close();

    }

}