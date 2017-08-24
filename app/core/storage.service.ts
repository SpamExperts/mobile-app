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

    public setUserRole(role: string) {
        this.storage.setItem('role', role);
    }

    setUsername(username) {
        this.storage.setItem('username', username);
    }

    public getToken() {
        return this.storage.getItem('token');
    }

    public getRememberMe() {
        return this.storage.getItem('rememberMe');
    }

    public getUserRole() {
        return this.storage.getItem('role');
    }

    public getUsername() {
        return this.storage.getItem('username');
    }

    public clearStorage() {
        this.storage.clear();
    }
}