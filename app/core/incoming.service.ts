import { Injectable } from '@angular/core';
import { Api } from './api.service';
import { Headers } from  '@angular/http';

@Injectable()
export class IncomingService {

    constructor( public api: Api ) {}

    public incomingMessages: any ;
    public plain: any;
    public raw: any;
    public normal: any;
    public selectedItem: any;
    public url: string;

    public getMessages(): any {
        return this.incomingMessages;
    }

    public getRaw(): any {

            let user_id = this.selectedItem.message_id;
            let filtering_host = this.selectedItem.filtering_host;
            let account = this.selectedItem.recipient+'@'+this.selectedItem.domain;
            let url= '/master/quarantine/delivery/view/'+account+ '/' + filtering_host + '/' + user_id + '/';

            let headers = new Headers();

            this.raw = '';

            this.api.get(url,headers)
                .subscribe((data: any) => {
                    this.raw = JSON.parse(data._body).result;
                });
    }

    public dateConvert(date: any) {
        let d = new Date(date);
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let datee = d.getDate()+1;
        return days[d.getDay()] + ', ' +  datee + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    public timeConvert(date: any) {
        let d = new Date(date);
        return d.getHours()+':'+d.getMinutes();
    }
}