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
                    console.log('secure storage created');
                    this.setStorageItem('token', '');
                    this.setStorageItem('rememberMe', 'false');
                    this.getItem('rememberMe');
                    this.getItem('token');
                },
                (error) => {
                    this.storage.secureDevice().then(() => {}, () => {})
                    console.log('error ' + error );
                }
            )
    }

    public getItem(item) {
        this.getStorageItem(item, (data) => {
            this.safeStorage[item] = data;
        })
    }

    public getStorageItem(item, callback) {
        this.storage.get(item)
            .then(
                (data) => {
                    // console.log('getting ' + data);
                    if (callback && callback instanceof Function) {
                        return callback(data);
                    }
                },
                (error) => {
                    console.log('item error' + item);
                }
            );

    }

    public setStorageItem(item, value) {
        this.storage.set(item, value).then(
            data =>  console.log(item + " -- " + value)
        );
    }

    public bringUpLockSettings() {
        this.storage.secureDevice().then(() => {}, () => {});
    }

    public clearSecureStorage() {
        this.storage.clear().then();
    }
}