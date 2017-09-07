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
    public count: number;
    public totalPages: number;
    public selectedInterval: any;
    public allItems: any;
    public checkedNumber: any = 0;
    public username: string;
    public role: string;

    public getMessages(): any {
        return this.incomingMessages;
    }

    public getRaw(): void {

            let user_id = this.selectedItem.message_id;
            let filtering_host = this.selectedItem.filtering_host;
            let account = this.selectedItem.recipient+'@'+this.selectedItem.domain;
            let url= '/master/quarantine/delivery/view/'+ account + '/' + filtering_host + '/' + user_id + '/';

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

        return days[d.getDay()-1] + ', ' +  d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    //for the view
    public timeConvert(date: any): string {
        let d = new Date(date);
        let minutes = '';
        if (d.getMinutes() < 10) {
            minutes = '0';
        }
        return d.getHours() + ':' + minutes + d.getMinutes();
    }

    //for the server
    public formatDate(date: Date): string {
        let nowString = date.toISOString();
        return nowString;
    }

    public setLoginUserInfo(name, role) {
        this.username = name;
        this.role = role;
    }

}