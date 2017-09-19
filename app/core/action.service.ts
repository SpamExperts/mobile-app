import { Injectable } from '@angular/core';
import { Query } from '../pages/common/query';
import { Api } from './api.service';
import { Headers } from '@angular/http';
import { AlertController, Events } from 'ionic-angular';
import { IncomingService } from './incoming.service';
import { Alert } from '../pages/common/alert';
import { OutgoingService } from './outgoing.service';

@Injectable()
export class ActionService {

    public selectedMessages: any = [];
    public alert: Alert = new Alert(this.alertCtrl);
    public actionName: string;
    public type: string = '';

    constructor (
        public api: Api,
        public events: Events,
        public incomingService: IncomingService,
        public alertCtrl: AlertController,
        public outgoingService: OutgoingService
    ) {}

    public action(method: string) {

        let typeService: any = null;
        if (this.type == 'incomingMessages') {
            typeService = this.incomingService;
        } else if (this.type == 'outgoingMessages') {
            typeService = this.outgoingService;
        }

        this.alert.actionAlert("Confirm action", this.alert.alertMessage[method] , () => {

            this.actionName = method;

            if (typeService.selectedItem != undefined) {
                this.selectedMessages[0] = typeService.selectedItem;
            }
            else {
                for (let item of typeService.allItems) {
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
            let url = typeService.createUrl("post", filters);
            let headers = new Headers();

            this.api.post(url, headers, {"method": this.actionName })
                .subscribe(() => {
                    this.selectedMessages = [];
                    typeService.checkedNumber = 0;
                    this.events.publish('refresh', "");
                    if (typeService.selectedItem)
                        this.events.publish('move', "");
                });

        });
    }
}