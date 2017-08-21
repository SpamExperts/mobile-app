import { Component } from '@angular/core';
import { IncomingService } from '../../../../core/incoming.service';

@Component({
    selector:'app-raw',
    templateUrl:'./raw.component.html'
})
export class RawPage {

    content: any ="none";

    constructor( public incService: IncomingService ) {
        this.incService.getRaw();
    }
}