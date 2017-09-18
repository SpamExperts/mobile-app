import { Headers } from  '@angular/http';
import { Env } from './env';
import { Api } from './api.service';
import { PermissionService } from './permissions.service';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class BaseService {

    abstract endpoint: string = '';

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
    public listLeft: boolean = false;
    public page: number ;
    public runInfinite: boolean = false;
    public hostname: string ;
    public requiredMessage: string = 'Please filter the search using a domain';
    public requiredMessageShown: boolean = true;

    constructor(
        public api: Api,
        public permissionService: PermissionService
    ) {}

    public getRequiredMessage() {
        return this.requiredMessage;
    }

    public createUrl(method: any, filters : any, page?: number) {

        let url = Env.DEV_PROXY
            ? ''
            : 'https://' + this.hostname ;

        if(method == 'post') {
            if (this.permissionService.isAdmin()) {
                url = url + this.replaceUrlParts() +'?client_username=' + this.permissionService.username + '&q=' + filters;
            }
            else if (this.permissionService.isDomain()) {
                url = url + this.replaceUrlParts() + '/?q=' + filters;
            }
            else if (this.permissionService.isEmail()) {
                url = url + this.replaceUrlParts() + '/?q=' + filters;
            }
        }

        else if (method == 'get') {
            if (this.permissionService.isAdmin()) {
                url = url + this.replaceUrlParts() + '?client_username=' + this.permissionService.username + '&page=' + page + '&page_size=20&q=' + filters;
            }
            else if (this.permissionService.isDomain()) {
                url = url + this.replaceUrlParts() + '?page=' + page + '&page_size=20&q=' + filters;
            }
            else if (this.permissionService.isEmail()) {
                url = url + this.replaceUrlParts() + '?page=' + page + '&page_size=20&q=' + filters;
            }
        }

        return url;
    }

    replaceUrlParts() {
        if (this.permissionService.isAdmin()) {
            return this.endpoint.replace('<domain>/<local>/', '');
        }
        else if (this.permissionService.isDomain()) {
            return this.endpoint.replace('<domain>/<local>', this.username);
        }
        else if (this.permissionService.isEmail()) {
            let sign = this.username.search('@');
            return this.endpoint.replace('<domain>/<local>', this.username.slice(sign+1,this.username.length) + '/' + this.username.slice(0,sign));
        }
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

    public refreshData() {
        this.incomingMessages = null ;
        this.plain ='';
        this.raw='';
        this.selectedItem = undefined;
        this.url ='';
        this.currentQuery = null;
        this.encodedQueryUrl = '';
        this.count = 0;
        this.totalPages = 0;
        this.selectedInterval = null;
        this.allItems = null;
        this.checkedNumber = 0;
        this.listLeft = false ;
    }

}