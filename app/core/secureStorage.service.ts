import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Injectable()
export class SecureStorageService {

    public storage: SecureStorageObject;

    constructor(public secureStorage: SecureStorage) {

    }

    public CreateStorage() {
        this.secureStorage.create('mobileSecureStorage')
            .then((storageObject: SecureStorageObject) => {
                this.storage = storageObject;
                this.setStorageItem('token', '');
                this.setStorageItem('rememberMe', 'false');
            })
    }

    public getStorageItem(item) {
        let result ='';
        this.storage.get(item)
            .then(
                data => {
                    result = data;
                },
                error => {}
            );

        return result;
    }

    public setStorageItem(item, value) {

        this.storage.set(item, value).then();
    }

    public checkLockScreen() {
        this.storage.secureDevice().then();
    }

    public bringUpLockSettings() {
        this.storage.secureDevice().then(() => {}, () => {});
    }

    public clearSecureStorage() {
        this.storage.clear().then();
    }
}