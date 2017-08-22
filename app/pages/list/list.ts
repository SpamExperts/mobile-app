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
    slice: number = 15;
    page: number = 1;


  url_messages =  encodeURI('{ "filters": [ { "and": [ { "name": "datetime", "op": ">=", "val": "2017-08-03+07:45" } ] } ], "fields": [ { "field": "message_id" }, { "field": "domain" }, { "field": "datetime" }, { "field": "sender" }, { "field": "recipient" }, { "field": "main_class" }, { "field": "subject_header" }, { "field": "status" }, { "field": "filtering_host" }, { "field": "delivery_fqdn" } ], "order_by": [ { "field": "message_id", "direction": "asc" } ], "count": false }');
  readonly endpoint = '/master/log/delivery/?client_username=intern&page=1&page_size=50&q=' + this.url_messages ;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public incService: IncomingService,
                public api: Api,
                public menu: MenuController,
                public events: Events) {

        this.events.subscribe('incomingMessages', (data) => {
            this.getMessages(data);
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
            let k = 0;
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].status == "quarantined") {
                    this.items.push(messages[i]);
                    this.items[k].date = this.incService.dateConvert(this.items[k].datetime);
                    this.items[k].time = this.incService.timeConvert(this.items[k].datetime);
                    k++;
                }
            }
          }
          this.page=1;
  };

    refresh(refresher){
        this.getMessages(this.incService.getMessages());

    setTimeout( function() {
      refresher.complete();
    }, 1000);
  }

    doInfinite(infiniteScroll: InfiniteScroll) {

        this.page ++;
        let url = '/master/log/delivery/?client_username=intern&page='+this.page+'&page_size=' + this.slice + '&q=' + this.url_messages;
        let headers = new Headers();

        this.api.get(url).subscribe((data: any) => {
            let messages: any = JSON.parse(data._body);
            let current_page = messages.total_pages;

                this.items = this.items.concat(messages.objects);


            infiniteScroll.complete();

            if (this.page == current_page) {
                infiniteScroll.enable(false);
            }

            infiniteScroll.enable(true);
        });
    }

}
