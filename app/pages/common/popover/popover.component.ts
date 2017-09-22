import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ActionService } from '../../../core/action.service';
import { PermissionService } from '../../../core/permissions.service';
import { OutgoingService } from '../../../core/outgoing.service';
import { IncomingService } from '../../../core/incoming.service';

@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html'
})
export class PopoverPage {

    constructor (
        public viewCtrl: ViewController,
        public actionService: ActionService,
        public permissionService: PermissionService,
        public incomingService: IncomingService,
        public outgoingService: OutgoingService
    ) {}

    close() {
        this.viewCtrl.dismiss();
    }

    doAction(method: string) {

        this.actionService.action(method);
        this.close();

    }
}