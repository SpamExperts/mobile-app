import { Component } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { IncomingService } from '../../core/incoming.service';
import { MessageDetailsPage } from '../message-details/message-details.component';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { SearchPage } from '../search/search.component';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {

    selectedItem: any;
    messages: any;
    items: any;

    url_messages =  encodeURI('{ "filters": [ { "and": [ { "name": "datetime", "op": ">=", "val": "2017-08-03+07:45" } ] } ], "fields": [ { "field": "message_id" }, { "field": "domain" }, { "field": "datetime" }, { "field": "sender" }, { "field": "recipient" }, { "field": "main_class" }, { "field": "subject_header" }, { "field": "status" }, { "field": "filtering_host" }, { "field": "delivery_fqdn" } ], "order_by": [ { "field": "message_id", "direction": "asc" } ], "count": false }');
    readonly endpoint = '/master/log/delivery/?client_username=intern&page=1&page_size=50&q=' + this.url_messages ;

    constructor(public navCtrl: NavController, public navParams: NavParams, public incService: IncomingService, public api: Api, public menu: MenuController) {
        // If we navigated to this page, we will have an item available as a nav param
        //this.selectedItem = navParams.get('item');

        this.getMessages();

    };


    itemTapped(event, item) {
        this.navCtrl.push(MessageDetailsPage, {
            item: item
        });
    }

    getMessages():any {
        let url = this.endpoint;
        let headers = new Headers();

        this.api.get(url, headers)
            .subscribe((data: any) => {
                let messages: any = JSON.parse(data._body);

                this.messages = messages.objects;

                this.items = [];
                let k=0;
                for (let i = 0; i < this.messages.length; i++) {
                    if(this.messages[i].status == "quarantined") {
                        this.items.push(this.messages[i]);
                        this.items[k].date = this.incService.dateConvert(this.items[k].datetime);
                        this.items[k].time = this.incService.timeConvert(this.items[k].datetime);
                        k++;
                    }
                }
            });
    };

    refresh(refresher){
        this.getMessages();

        setTimeout( function() {
            refresher.complete();
        }, 1000);
    }

    //
    // public searchMessages() {
    //     this.navCtrl.push(SearchPage);
    // }

    public doInfiniteScrolling(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (var i = 0; i < 10; i++) {
                    this.items.push( this.items.length );
                }
                resolve();
            }, 500);
        })
    }

}
