import { Component, ViewChild } from '@angular/core';
import { Query } from '../common/query';
import { Api } from "../../core/api.service";
import { Headers } from '@angular/http';
import { IncomingService } from "../../core/incoming.service";
import { Events, Nav } from 'ionic-angular';
import { PermissionService } from '../../core/permissions.service';
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
    public selectedInterval: string;
    public clearButton : boolean = true;
    public queryInstance: Query = new Query();
    readonly endpoint = '/master/log/delivery/?client_username=intern&page=-1&page_size=20&q=';

    @ViewChild(Nav) nav: Nav;

    constructor(
        public api: Api,
        public incService: IncomingService,
        public events: Events,
        public permissionService: PermissionService
    ) {}

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
    }

    public pastDays(days: number) {

        let now = new Date();
        let then = new Date();
        let today = now.getDate();
        then.setSeconds(0);
        then.setDate(today - days);
        return this.setDateFilters(this.incService.formatDate(then), this.incService.formatDate(now));
    }

    public pastMonths(months: number) {
        let now = new Date();
        let then = new Date();
        then.setSeconds(0);
        then.setMonth(now.getMonth() - months);
        return this.setDateFilters(this.incService.formatDate(then), this.incService.formatDate(now));
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

        let filterList = [];
        let headers = new Headers();
        let filterstring = [];

        if (this.domain != null) {
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
                console.log(this.pastDays(7).slice(0));
            } else if (this.selectedInterval == 'pastMonth') {
                filterList.push(this.pastMonths(1).slice(0));
            }
        } else if (this.fromDate != null && this.toDate == null) {
            let date = new Date();
            this.toDate = this.incService.formatDate(date);
            console.log(this.fromDate);
            filterList.push(this.setDateFilters(this.fromDate, this.toDate).slice(0));
        } else if (this.fromDate != null && this.toDate != null) {
            filterList.push(this.setDateFilters(this.fromDate, this.toDate).slice(0));
        }

        for (let i = 0; i < filterList.length; i++) {
            for (let j = 0; j < filterList[i].length; j++){
                filterstring.push(filterList[i][j]);
            }
        }

        //this is the query used all the time
        this.incService.currentQuery = this.queryInstance.createQuery(filterstring, this.populateFields(),'message_id', false);

        let query = JSON.stringify(this.queryInstance.createQuery(filterstring, this.populateFields(),'message_id', false));
        let encodedQuery = encodeURI(query);
        let url = this.endpoint + encodedQuery;

        this.incService.encodedQueryUrl = encodedQuery;

        this.incService.selectedInterval = this.selectedInterval;

        return this.api.get(url, headers)
            .subscribe((data: any) => {
                let messages: any = JSON.parse(data._body);

                this.incService.count = messages.num_results;
                this.incService.totalPages = messages.total_pages;
                this.incService.incomingMessages = messages.objects;
                this.events.publish('incomingMessages', messages.objects);
            });
    }

    public clearSearch() {
        this.domain = '';
        this.sender = '';
        this.recipient = '';
        this.fromDate = '';
        this.toDate = '';
        this.selectedInterval = '';
    }

}