import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Injectable()
export class SecureStorageService {

    public storage: SecureStorageObject;
    public result: string;

    public safeStorage: {} = {};

    constructor(public secureStorage: SecureStorage) {

    }

    public CreateStorage() {
        this.secureStorage.create('mobileSecureStorage')
            .then(
                (storageObject: SecureStorageObject) => {
                    this.storage = storageObject;
                    console.log(this.safeStorage['rememberMe']);
                    if (this.safeStorage['rememberMe'] == null ) {
                        this.setStorageItem('token', '');
                        this.setStorageItem('rememberMe', 'false');
                    }
                },
                (error) => {
                    this.storage.secureDevice().then(() => {}, () => {})
                }
            )
    }

    public getItem(item) {
        this.getStorageItem(item, (data) => {
            return this.safeStorage[item];
        })
    }

    public getStorageItem(item, callback) {
        this.storage.get(item)
            .then(
                (data) => {
                    if (callback && callback instanceof Function) {
                        return callback(data);
                    }
                }
            );

    }

    public setStorageItem(item, value) {
        this.storage.set(item, value).then(
            this.safeStorage[item] = value
        );
    }

    public bringUpLockSettings() {
        this.storage.secureDevice().then(() => {}, () => {});
    }

    public clearSecureStorage() {
        this.storage.clear().then();
    }
}