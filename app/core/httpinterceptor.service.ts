import { Injectable } from '@angular/core';
import { ConnectionBackend, Http, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpInterceptor extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions){
        super(backend, defaultOptions);
    }

    public getRequestOptionsArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        let token = localStorage.getItem('token');
        if(token != null) {
            options.headers.append('HTTP-X-AUTH-TOKEN', token);
          //  options.headers.append('Authorization', 'Bearer ' + token);
        }

        return options;
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<any>{
        return super.get(url, this.getRequestOptionsArgs(options));
    }

    public post(url: string, params?: {},  options?: RequestOptionsArgs): Observable<any>{
        return super.post(url, {}, this.getRequestOptionsArgs(options));
    }



}