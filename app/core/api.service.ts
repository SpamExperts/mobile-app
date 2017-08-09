import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';

@Injectable()
export class Api {

    // static readonly PROTOCOL = 'https://';


    constructor(private http: Http) {

    }

    public get(url: string, headers: Headers = null) {

        let options = new RequestOptions(<RequestOptionsArgs>{
            headers: headers
        });

        console.log(options);

        return this.http.get(url, options);
    }

    public post(url: string, params: {}, headers: Headers = null) {

        let options = new RequestOptions(<RequestOptionsArgs>{
            params: params,
            headers: headers
        });
        return this.http.post(url, params, options);
    }
}