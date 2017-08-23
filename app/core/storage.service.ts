import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    private storage = localStorage;

    constructor() {

    }

    public setToken(token: string) {
        this.storage.setItem('token', token);
    }

    public setRememberMe(rememberMeString: string) {
        this.storage.setItem('rememberMe', rememberMeString);
    }

    public getToken() {
        return this.storage.getItem('token');
    }

    public getRememberMe() {
        return this.storage.getItem('rememberMe');
    }
}