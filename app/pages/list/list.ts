import { Component } from '@angular/core';
import { Events, MenuController, NavController, NavParams } from 'ionic-angular';
import { InfiniteScroll } from 'ionic-angular';
import { IncomingService } from '../../core/incoming.service';
import { MessageDetailsPage } from '../message-details/message-details.component';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {

    selectedItem: any;
    items: {}[] = [];
    slice: number = 20;
    page: number;
    infiniteScroll: any = null;
    count: number;
    last_count: number;
    total_pages: number;
    last_total_pages: number;
    last_refresh_count: number;
    refresh_count: number;

    readonly  endpoint = '/master/log/delivery/';

    constructor(
        public navCtrl: NavController,
                public navParams: NavParams,
                public incService: IncomingService,
                public api: Api,
                public menu: MenuController,
                public events: Events
    ) {

        this.events.subscribe('incomingMessages', (data) => {
            this.handleMessages(data);
            this.page = -2;
            if( data.length < 4 )
                this.getMoreMessages();

            this.count = this.incService.countFirst;
            this.total_pages = this.incService.totalpagesFirst;
            this.refresh_count  = this.count;
            if(this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }

        });
    };

    itemTapped(event, item) {
        this.navCtrl.push(MessageDetailsPage, {
            item: item
        });
    }

    handleMessages(messages: {}[] = []): void {
        this.items = messages.reverse();
    };

    //when the first (-1) page doesn't have enough messages
    getMoreMessages(): void {

        let url = this.endpoint + '?client_username=intern&page=-2&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;
        let headers = new Headers();

        if(this.incService.encodedQueryUrl) {
            this.api.get(url, headers).subscribe((data: any) => {
                let messages: any = JSON.parse(data._body).objects.reverse();
                this.items = this.items.concat(messages);
            });
        }

        this.page = -3;

    }

    refresh(refresher){

        let last_page = this.page;

        let url =  this.endpoint + '?client_username=intern&page=-1&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;;

        if (this.incService.selectedInterval != null) {
            let query =  this.incService.currentQuery;
            let date = new Date();

            for(let item of query.filters[0].and) {
                if(item.name == 'datetime' && item.op == '<=') {
                    item.val  = this.incService.formatDate(date);
                    break;
                }
            }

            query = encodeURI(JSON.stringify(query));
            url = this.endpoint + '?client_username=intern&page=-1&page_size=' + this.slice + '&q=' + query;
        }

        let headers = new Headers();

        if(this.incService.encodedQueryUrl) {
            this.api.get(url, headers).subscribe((data: any) => {
                let body = JSON.parse(data._body);
                let messages: any = body.objects;

                this.last_refresh_count = this.refresh_count;
                this.refresh_count = body.num_results;

                if(this.refresh_count != this.last_refresh_count) {
                    if(this.infiniteScroll) {
                        console.log('asa');
                        this.infiniteScroll.enable(true);
                    }
                    this.page = -2;
                    this.handleMessages(messages);
                    if (messages.length < 4)
                        this.getMoreMessages();
                }
                else {

                    this.page = last_page;

                }
            });
        }

        setTimeout( function() {
            refresher.complete();
        }, 1000);
    }

    doInfinite(infiniteScroll: InfiniteScroll) {

        this.infiniteScroll = infiniteScroll;

        let url = this.endpoint + '?client_username=intern&page=' + this.page + '&page_size=' + this.slice + '&q=' + this.incService.encodedQueryUrl;
        let headers = new Headers();

        this.api.get(url,headers).subscribe((data: any) => {
            let messages: any = JSON.parse(data._body);

            this.last_count =  this.count;
            this.count = messages.num_results;
            this.last_total_pages = this.total_pages;
            this.total_pages = messages.total_pages;

            if(this.last_count == this.count || this.total_pages == this.last_total_pages ) {

                this.items = this.items.concat(messages.objects.reverse());
                this.page -- ;

            }
            else if( this.last_count < this.count && this.last_total_pages < this.total_pages ) {

                let page_difference = this.total_pages - this.last_total_pages;
                if( page_difference > 1 ) {
                    this.page = this.page - page_difference;
                }

            }

            infiniteScroll.complete();

            if (this.page == -this.total_pages-1) {
                infiniteScroll.enable(false);
            }
        });
    }

}