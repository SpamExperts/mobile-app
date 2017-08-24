import { Injectable } from '@angular/core';
import { Api } from './api.service';
import { Headers } from  '@angular/http';

@Injectable()
export class IncomingService {

    constructor( public api: Api ) {}

    public incomingMessages: any ;
    public plain: string;
    public raw: string;
    public normal: string;
    public selectedItem: any;
    public url: string;
    public currentQuery: any;
    public encodedQueryUrl: string;
    public countFirst: number;
    public totalpagesFirst: number;
    public selectedInterval: any;

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

    //for the view
    public dateConvert(date: string): string {
        let d = new Date(date);
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let datee = d.getDate();
        return days[d.getDay()-1] + ', ' +  datee + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    //for the view
    public timeConvert(date: any) {
        let d = new Date(date);
        let minutes = '';
        if(d.getMinutes()<10)
            minutes = '0';
        return d.getHours()+':'+minutes+d.getMinutes();
    }

    //for the server
    public formatDate(date: Date): string {

        //this is converted to Romania for testing
        date.setHours(date.getHours() - 3);

        let nowString = date.getFullYear() + "-" +
            (((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' +
            ((date.getDate() > 9) ? date.getDate()  : '0' + date.getDate() ) + "T" +
            date.getHours() + ":" + ((date.getMinutes() > 9) ? date.getMinutes()  : '0' + date.getMinutes());

        return nowString;
    }
}