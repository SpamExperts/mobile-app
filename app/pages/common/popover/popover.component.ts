import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
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
        public actionService: ActionService,
        public incService: IncomingService,
        public permissionService: PermissionService,
    ) {}

    close() {
        this.viewCtrl.dismiss();
    }

    doAction(method: string) {

        this.actionService.action(method);
        this.close();

    }

}