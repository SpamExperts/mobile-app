import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { ListPage } from "../list/list";
import { IncomingService } from '../../core/incoming.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, public api: Api, public incService: IncomingService) {

    }

    // readonly endpoint = '/master/log/delivery';
    url_messages =  encodeURI('{ "filters": [ { "and": [ { "name": "datetime", "op": ">=", "val": "2017-08-03+07:45" } ] } ], "fields": [ { "field": "message_id" }, { "field": "domain" }, { "field": "datetime" }, { "field": "sender" }, { "field": "recipient" }, { "field": "main_class" }, { "field": "subject_header" }, { "field": "status" }, { "field": "filtering_host" }, { "field": "delivery_fqdn" } ], "order_by": [ { "field": "message_id", "direction": "asc" } ], "count": false }');
    readonly endpoint = '/master/log/delivery/?client_username=intern&page=1&page_size=50&q=' + this.url_messages ;

    public getIncomingMessages() {

        let url = this.endpoint;
        let headers = new Headers();

        return this.api.get(url, headers)
            .subscribe((data: any) => {
                let messages: any = JSON.parse(data._body);
                this.navCtrl.push(ListPage);
                this.incService.incomingMessages = messages.objects;
            })
    }

}
