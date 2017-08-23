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
    messages: any;
    items: any = [];
    slice: number = 7;
    page: number = 1;
    infiniteScroll: any;
    count: number;
    last_count: number;
    total_pages: number;
    last_total_pages: number;

    url_messages =  encodeURI('{ "filters": [ { "and": [ { "name": "datetime", "op": ">=", "val": "2017-08-03+07:45" } ] } ], "fields": [ { "field": "message_id" }, { "field": "domain" }, { "field": "datetime" }, { "field": "sender" }, { "field": "recipient" }, { "field": "main_class" }, { "field": "subject_header" }, { "field": "status" }, { "field": "filtering_host" }, { "field": "delivery_fqdn" } ], "order_by": [ { "field": "message_id", "direction": "asc" } ], "count": false }');

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public incService: IncomingService,
                public api: Api,
                public menu: MenuController,
                public events: Events) {

        this.events.subscribe('incomingMessages', (data) => {
            this.getMessages(data);

            this.count = this.incService.countFirst;
            this.last_count = this.count;
            this.total_pages = this.incService.totalpagesFirst;
            this.last_total_pages = this.total_pages;
        })
    };

    itemTapped(event, item) {
        this.navCtrl.push(MessageDetailsPage, {
            item: item
        });
    }

    getMessages(messages):any {
        if(messages != null) {
            this.items = [];
            for (let i = 0; i < messages.length; i++) {
                this.items.push(messages[i]);
            }

            this.items.reverse();
        }

        this.page = -1;

        if( messages.length < 4 ) {

            this.page = -2;

            let url = '/master/log/delivery/?client_username=intern&page=-2&page_size=' + this.slice + '&q=' + this.incService.encodedqueryurl;
            let headers = new Headers();

            if(this.incService.encodedqueryurl) {
                this.api.get(url, headers).subscribe((data: any) => {
                    let messages: any = JSON.parse(data._body).objects.reverse();
                    console.log(messages);
                    this.items = this.items.concat(messages);

                });
            }
        }
    };

    refresh(refresher){

        this.page = -1;
        if(this.infiniteScroll)
            this.infiniteScroll.enable(true);

        let url = '/master/log/delivery/?client_username=intern&page='+this.page+'&page_size=' + this.slice + '&q=' + this.incService.encodedqueryurl;
        let headers = new Headers();

        if(this.incService.encodedqueryurl) {
            this.api.get(url, headers).subscribe((data: any) => {
                let messages: any = JSON.parse(data._body).objects;
                this.getMessages(messages);

            });
        }

        setTimeout( function() {
            refresher.complete();
        }, 1000);
    }

    doInfinite(infiniteScroll: InfiniteScroll) {

        console.log('scrolling');

        this.infiniteScroll = infiniteScroll;

        this.page --;
        let url = '/master/log/delivery/?client_username=intern&page=' + this.page + '&page_size=' + this.slice + '&q=' + this.incService.encodedqueryurl;
        let headers = new Headers();

        this.api.get(url,headers).subscribe((data: any) => {
            let messages: any = JSON.parse(data._body);

            this.last_count =  this.count;
            this.count = messages.num_results;
            this.last_total_pages = this.total_pages;
            this.total_pages = messages.total_pages;

            if(this.last_count == this.count || this.total_pages == this.last_total_pages ) {

                this.items = this.items.concat(messages.objects.reverse());

            }
            else if( this.last_count < this.count && this.last_total_pages < this.total_pages ) {

                let pagediff = this.total_pages - this.last_total_pages;
                if( pagediff > 1 ) {
                    this.page = this.page - pagediff + 1;
                }

            }

            infiniteScroll.complete();

            if (this.page == -this.total_pages) {
                infiniteScroll.enable(false);
            }
        });
    }

}