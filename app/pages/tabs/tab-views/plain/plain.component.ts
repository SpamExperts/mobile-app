import { Component } from '@angular/core';
import { IncomingService } from '../../../../core/incoming.service';

@Component({
    selector:'app-plain',
    templateUrl:'./plain.component.html'
})
export class PlainPage {

    content: any = "";

    constructor( public incService: IncomingService ) {}

}