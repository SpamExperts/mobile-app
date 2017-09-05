import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, NavController, PopoverController } from 'ionic-angular';
import { InfiniteScroll } from 'ionic-angular';
import { IncomingService } from '../../core/incoming.service';
import { MessageDetailsPage } from '../message-details/message-details.component';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { PopoverPage } from '../common/popover/popover.component';
import { ActionService } from '../../core/action.service';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {

    @ViewChild('list') list: any;

    selectedItem: any;
    items: {}[] = [];
    slice: number = 20;
    page: number;
    infiniteScroll: any = null;
    refresher: any = null ;
    count: number;
    last_count: number;
    total_pages: number;
    allowActionRefresh: boolean = false;
    noItems: boolean = false;

    readonly  endpoint = '/master/log/delivery/';

    constructor(
        public navCtrl: NavController,
        public incService: IncomingService,
        public api: Api,
        public menu: MenuController,
        public events: Events,
        public popoverCtrl: PopoverController,
        public actionService: ActionService,
    ) {

        this.events.subscribe('refresh', () => {
            let thisList = this;
            setTimeout( function () {
                thisList.actionRefresh();
            },2000);
        });

        this.events.subscribe('incomingMessages', (data) => {

            this.handleMessages(data);

            //initialize with the number of pages and messages at the first search
            this.count = this.incService.count;
            this.total_pages = this.incService.totalPages;
            this.page = -2;

            if(this.infiniteScroll != null && this.infiniteScroll!=undefined && !this.infiniteScroll) {
                    this.infiniteScroll.enable(true);
            }

            if( data.length < 4 && this.count >= 4) {
                this.getMoreMessages();
            }
        });
    };

    handleMessages(messages: {}[] = []): void {
        if(messages.length == 0) {
            this.noItems = true;
            this.items = [];
        } else {
            this.noItems = false;
            this.items = messages.reverse();
        }
    };

    //when the first (-1) page doesn't have enough messages
    getMoreMessages(): void {

        let url = this.endpoint + '?client_username=intern&page=' + this.page + '&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;
        let headers = new Headers();

        if(this.incService.encodedQueryUrl) {
            this.api.get(url, headers).subscribe((data: any) => {

                let body: any = JSON.parse(data._body);
                this.items = this.items.concat(body.objects.reverse());
                this.page--;

            });
        }

    }

    refresh(refresher) {

        //not allowed when items are checked
        if(this.incService.checkedNumber > 0 ) {
            refresher.complete();
            return;
        }

        this.allowActionRefresh = false;
        this.refreshDate();

        let url = this.endpoint + '?client_username=intern&page=-1&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;
        let headers = new Headers();

        //if there is a query
        if(this.incService.encodedQueryUrl ) {
            this.api.get(url, headers).subscribe((data: any) => {
                let body = JSON.parse(data._body);
                let messages: any = body.objects;

                //last_count remembers the number of the messages when the last search or refresh was done
                this.last_count = this.count;
                this.count = body.num_results;
                this.total_pages = body.total_pages;

                if(this.count != this.last_count ) {
                    if(this.infiniteScroll!= undefined && this.infiniteScroll != null && !this.infiniteScroll) {
                        this.infiniteScroll.enable(true);
                    }
                    this.page = -2;
                    this.handleMessages(messages);
                    if (messages.length < 4 && this.count >= 4) {
                        this.getMoreMessages();
                    }
                }
            });
        }

        setTimeout( function() {
            refresher.complete();
        }, 1000);
    }

    actionRefresh() {

        this.refreshDate();

        let url = this.endpoint + '?client_username=intern&page=-1&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;
        let headers = new Headers();

        //if there is a query
        if(this.incService.encodedQueryUrl ) {
            this.api.get(url, headers).subscribe((data: any) => {
                let body = JSON.parse(data._body);
                let messages: any = body.objects;

                //last_count remembers the number of the messages when the last search or refresh was done
                this.last_count = this.count;
                this.count = body.num_results;
                this.total_pages = body.total_pages;

                if(this.count != this.last_count) {
                    if(this.infiniteScroll) {
                        this.infiniteScroll.enable(true);
                    }
                    this.page = -2;
                    this.handleMessages(messages);
                    if (messages.length < 4 && this.count >= 4) {
                        this.getMoreMessages();
                    }
                }
            });
        }

    }

    doInfinite(infiniteScroll: InfiniteScroll) {

        this.infiniteScroll = infiniteScroll;

        if(this.total_pages >= -this.page ) {

            let url = this.endpoint + '?client_username=intern&page=' + this.page + '&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;
            let headers = new Headers();

            this.api.get(url, headers).subscribe((data: any) => {

                let messages: any = JSON.parse(data._body);
                this.items = this.items.concat(messages.objects.reverse());
                this.page--;

                infiniteScroll.complete();

            });
        }
        else {

            infiniteScroll.complete();
            infiniteScroll.enable(false);

        }
    }

    refreshDate() {

        let query =  this.incService.currentQuery;
        let date = new Date();
        for(let item of query.filters[0].and) {
            if(item.name == 'datetime' && item.op == '<=') {
                item.val = this.incService.formatDate(date);
                break;
            }
        }
        this.incService.currentQuery = query;
        this.incService.encodedQueryUrl = encodeURI(JSON.stringify(query));

    }

    itemTapped(event, item) {
        this.navCtrl.push(MessageDetailsPage, {
            item: item
        });
    }

    changeCheckedItems(item): void {

        if(item.checked) {
            this.incService.checkedNumber ++;
        }
        else {
            this.incService.checkedNumber --;
        }
        this.incService.allItems = this.items;

    }

    openPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

    public itemIdentity (index, item) {
        return item;
    }
}