import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PopoverService } from './popover.service';

@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html'
})
export class PopoverPage {

    constructor (
        public viewCtrl: ViewController,
        public popService: PopoverService
    ) {}

    close() {
        this.viewCtrl.dismiss();
        this.popService.messageListPop = false;
        this.popService.messageViewPop = false;
    }

    release_train() {
        this.close();
    }

    whitelist_release() {
        this.close();
    }

    remove() {
        this.close();
    }

    blacklist_remove() {
        this.close();
    }

}