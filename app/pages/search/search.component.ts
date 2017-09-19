import { Component, ViewChild } from '@angular/core';
import { Query } from '../common/query';
import { Api } from "../../core/api.service";
import { Headers } from '@angular/http';
import { IncomingService } from "../../core/incoming.service";
import { Events, Nav } from 'ionic-angular';
import { PermissionService } from '../../core/permissions.service';
import { SecureStorageService } from '../../core/secureStorage.service';
import { OutgoingService } from '../../core/outgoing.service';
import { ActionService } from '../../core/action.service';

@Component({
    selector: 'search-messages',
    templateUrl: 'search.component.html'
})
export class SearchPage {

    public domain: string;
    public sender: string;
    public recipient: string;
    public fromDate: string;
    public toDate: string;
    public username: string;
    public selectedInterval: string;
    public queryInstance: Query = new Query();
    readonly endpoint = '/master/log/delivery/?client_username=intern&page=-1&page_size=20&q=';
    public requiredMessage: string;


    @ViewChild(Nav) nav: Nav;

    constructor(
        public api: Api,
        public incomingService: IncomingService,
        public outgoingService: OutgoingService,
        public events: Events,
        public permissionService: PermissionService,
        public secureStorage: SecureStorageService,
        public actionService : ActionService,
        public listService: IncomingService
    ) {
        let now = new Date();
        let today = new Date();
        today.setSeconds(0);
        today.setHours(0,0,0);
        today.setHours(today.getHours() + 3);
        now.setHours(now.getHours() + 3);
        this.fromDate = today.toISOString();
        this.toDate = now.toISOString();
    }

    public setSearchFilters(field: string, value: string){
        let query = new Query();
        let filters = query.filterEquals(field, value);
        return filters.slice(0);
    }

    public setDateFilters(fromDate: string, toDate: string) {
        let query = new Query();
        let filters = query.filters;
        filters.push({
            name: 'datetime',
            op: '>=',
            val: fromDate
        });
        filters.push({
            name: 'datetime',
            op: '<=',
            val: toDate
        });

        return filters;
    }

    public makeactive(state: string) {
        this.selectedInterval = state;
        if (state == 'pastDay') {

            let now = new Date();
            let yesterday = new Date();
            yesterday.setSeconds(0);
            yesterday.setHours(yesterday.getHours() + 3);
            now.setHours(now.getHours() + 3);
            yesterday.setDate(now.getDate() - 1);
            this.fromDate = yesterday.toISOString();
            this.toDate = now.toISOString();

        } else if (state == 'pastWeek') {

            let now = new Date();
            let yesterday = new Date();
            yesterday.setSeconds(0);
            yesterday.setDate(now.getDate() - 7);
            yesterday.setHours(yesterday.getHours() + 3);
            now.setHours(now.getHours() + 3);
            this.fromDate = yesterday.toISOString();
            this.toDate = now.toISOString();

        } else if (state == 'pastMonth') {

            let now = new Date();
            let lastMonth = new Date();
            lastMonth.setSeconds(0);
            lastMonth.setMonth(now.getMonth() - 1);
            lastMonth.setHours(lastMonth.getHours() + 3);
            now.setHours(now.getHours() + 3);
            this.fromDate = lastMonth.toISOString();
            this.toDate = now.toISOString();

        } else {

            let now = new Date();
            let today = new Date();
            today.setSeconds(0);
            this.fromDate = this.incomingService.formatDate(today);
            this.toDate = this.incomingService.formatDate(now);

        }
    }

    public pastDays(days: number) {

        let now = new Date();
        let then = new Date();
        let today = now.getDate();
        then.setSeconds(0);
        then.setDate(today - days);
        return this.setDateFilters(this.incomingService.formatDate(then), this.incomingService.formatDate(now));
    }

    public pastMonths(months: number) {
        let now = new Date();
        let then = new Date();
        then.setSeconds(0);
        then.setMonth(now.getMonth() - months);
        return this.setDateFilters(this.incomingService.formatDate(then), this.incomingService.formatDate(now));
    }

    public populateFields(): any[] {

        return [
            "message_id",
            "domain",
            "datetime",
            "sender",
            "recipient",
            "main_class",
            "subject_header",
            "status",
            "filtering_host",
            "delivery_fqdn"
        ];

    }

    public searchMessages() {

        let typeService: any = null;
        if(this.actionService.type == "incomingMessages") {
            typeService = this.incomingService;
        } else if(this.actionService.type == "outgoingMessages") {
            typeService = this.outgoingService;
        }

        if(this.domain == null && this.permissionService.permissions.userType == 'admin'){
            typeService.requiredMessageShown = true;
            setTimeout(function () {
                typeService.requiredMessageShown = false;
            }, 15000);
        } else {
            this.requiredMessage = null;
            typeService.requiredMessageShown = false;

            let filterList = [];
            let headers = new Headers();
            let filterstring = [];
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            let fromDate = new Date(this.fromDate);
            let toDate = new Date(this.toDate);
            let fromDateString= fromDate.getDate() + " " + months[fromDate.getMonth()];
            let toDateString = toDate.getDate() + " " + months[toDate.getMonth()];
            this.listService.datesInterval = fromDateString + ' - ' + toDateString + ' ' +  toDate.getFullYear();

            if (this.domain != null && this.permissionService.permissions.userType == 'admin') {
                filterList.push(this.setSearchFilters('domain', this.domain));
            }
            if (this.sender != null) {
                filterList.push(this.setSearchFilters('sender', this.sender));
            }
            if (this.recipient != null) {
                filterList.push(this.setSearchFilters('recipient', this.recipient));
            }

            filterList.push(this.setSearchFilters('status', 'quarantined'));

            if (this.selectedInterval != null) {
                if (this.selectedInterval == 'pastDay'){
                    filterList.push(this.pastDays(1).slice(0));
                } else if (this.selectedInterval == 'pastWeek') {
                    filterList.push(this.pastDays(7).slice(0));
                } else if (this.selectedInterval == 'pastMonth') {
                    filterList.push(this.pastMonths(1).slice(0));
                }
            } else if (this.fromDate != null && this.toDate == null) {
                let date = new Date();
                this.toDate = typeService.formatDate(date);
                filterList.push(this.setDateFilters(this.fromDate, this.toDate).slice(0));
            } else if (this.fromDate != null && this.toDate != null) {
                filterList.push(this.setDateFilters(this.fromDate, this.toDate).slice(0));
            }

            for (let i = 0; i < filterList.length; i++) {
                for (let j = 0; j < filterList[i].length; j++){
                    filterstring.push(filterList[i][j]);
                }
            }

            typeService.currentQuery = this.queryInstance.createQuery(filterstring, this.populateFields(),'message_id', false);

            let query = JSON.stringify(this.queryInstance.createQuery(filterstring, this.populateFields(),'message_id', false));
            let encodedQuery = encodeURI(query);
            let url = typeService.createUrl("get", encodedQuery, -1);

            typeService.encodedQueryUrl = encodedQuery;

            typeService.selectedInterval = this.selectedInterval;

            return this.api.get(url, headers)
                .subscribe((data: any) => {
                    let messages: any = JSON.parse(data._body);

                    typeService.count = messages.num_results;
                    typeService.totalPages = messages.total_pages;
                    typeService.incomingMessages = messages.objects;

                    this.events.publish('incomingMessages', messages.objects);
                });
        }

    }

    public clearSearch() {
        this.domain = null;
        this.sender = null;
        this.recipient = null;
        this.fromDate = null;
        this.toDate = null;
        this.selectedInterval = null;
    }

}