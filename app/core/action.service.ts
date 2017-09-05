import { Injectable } from '@angular/core';
import { Query } from '../pages/common/query';
import { Api } from './api.service';
import { Headers } from '@angular/http';
import { AlertController, Events } from 'ionic-angular';
import { IncomingService } from './incoming.service';
import { Alert } from '../pages/common/alert';

@Injectable()
export class ActionService {

    public selectedMessages: any = [];
    public alert: Alert = new Alert(this.alertCtrl);

    constructor (
        public api: Api,
        public events: Events,
        public incService: IncomingService,
        public alertCtrl: AlertController
    ) {}

    action(method: string) {

        this.alert.actionAlert("Confirm action", this.alert.alertMessage[method] , () => {

            this.api.action = method;

            if (this.incService.selectedItem != undefined) {
                this.selectedMessages[0] = this.incService.selectedItem;
            }
            else {
                for (let item of this.incService.allItems) {
                    if (item.checked == true) {
                        this.selectedMessages.push(item);
                    }
                }
            }

            let query = new Query();
            let or = [];

            for (let i = 0; i < this.selectedMessages.length; i++) {

                let object = {and: []};

                object.and.push({
                    "name": "message_id",
                    "op": "==",
                    "val": this.selectedMessages[i].message_id
                });

                object.and.push({
                    "name": "filtering_host",
                    "op": "==",
                    "val": this.selectedMessages[i].filtering_host
                });

                object.and.push({
                    "name": "recipient",
                    "op": "==",
                    "val": this.selectedMessages[i].recipient
                });

                object.and.push({
                    "name": "delivery_fqdn",
                    "op": "==",
                    "val": this.selectedMessages[i].delivery_fqdn
                });

                or.push(object);
            }

            let filters = encodeURI(JSON.stringify(query.createRemoveQuery(or)));
            let url = '/master/bulk/delivery/?client_username=intern&q=' + filters;
            let headers = new Headers();

            this.api.post(url, headers)
                .subscribe(() => {
                    this.selectedMessages = [];
                    this.incService.checkedNumber = 0;
                    this.events.publish('refresh', "");
                    if (this.incService.selectedItem)
                        this.events.publish('move', "");
                });

        });
    }
}