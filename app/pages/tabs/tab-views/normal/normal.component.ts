import { Component } from '@angular/core';
import { IncomingService } from '../../../../core/incoming.service';

@Component({
    selector:'app-normal',
    templateUrl:'./normal.component.html'
})
export class NormalPage {

    content: any ="none";

    constructor( public incService: IncomingService ) {
        this.content = this.incService.getNormal();
    }

}