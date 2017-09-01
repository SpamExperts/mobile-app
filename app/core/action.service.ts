import { Injectable } from '@angular/core';
import { Query } from '../pages/common/query';
import { Api } from './api.service';
import { Headers } from '@angular/http';

@Injectable()
export class ActionService {

    public selectedMessages: any;

    constructor (
        public api: Api
    ) {}

    action(method: string) {

        this.api.action = method;

        let query = new Query();
        let or = [];

        for(let i=0; i<this.selectedMessages.length; i++) {

            let object = { and : [] };

            object.and.push({
                "name":"message_id",
                "op":"==",
                "val": this.selectedMessages[i].message_id
            });

            object.and.push({
                "name":"filtering_host",
                "op":"==",
                "val": this.selectedMessages[i].filtering_host
            });

            object.and.push({
                "name":"recipient",
                "op":"==",
                "val": this.selectedMessages[i].recipient
            });

            object.and.push({
                "name":"delivery_fqdn",
                "op":"==",
                "val": this.selectedMessages[i].delivery_fqdn
            });

            or.push(object);
        }

        let filters = encodeURI(JSON.stringify(query.createRemoveQuery(or)));
        let url= '/master/bulk/delivery/?client_username=intern&q=' + filters;
        let headers = new Headers();

        this.api.post(url, headers)
            .subscribe(() => {

            });

    }

}