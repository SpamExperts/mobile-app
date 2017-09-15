import {XHRBackend, Http, RequestOptions} from "@angular/http";
import { HttpInterceptor } from './httpinterceptor.service';
import { Platform } from 'ionic-angular';
import { SecureStorageService } from './secureStorage.service';

export function httpFactory(xhrBackend: XHRBackend,
                            requestOptions: RequestOptions): Http {
    return new HttpInterceptor(xhrBackend, requestOptions);
}