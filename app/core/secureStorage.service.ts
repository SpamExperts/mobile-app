import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { PermissionService } from './permissions.service';

@Injectable()
export class SecureStorageService {

    public storage: SecureStorageObject;
    public result: string;
    public localstorage = localStorage;
    public rememberMe: boolean;
    public token: string;
    public safeStorage: {} = {};
    public movetoHome: boolean;

    constructor(
        public secureStorage: SecureStorage,
        public permissionsService: PermissionService
    ) {

    }

    public CreateStorage() {

        this.secureStorage.create('mobileSecureStorage')
            .then(
                (storageObject: SecureStorageObject) => {
                    this.storage = storageObject;
                    this.storage.get('token').then(
                        (data) => {
                            console.log('token data: ', data);
                            this.storage.get('rememberMe').then(
                                (data) => {
                                    console.log('remembermME, ', data);
                                    if(data == 'true') {
                                        console.log('rememberMe in app: ', data);
                                        this.movetoHome = true;
                                        this.storage.get('role').then(
                                            (data) => {
                                                this.permissionsService.setPermissions(data);
                                                console.log('role after reload: ', data);
                                            }
                                        );
                                        this.storage.get('username').then(
                                            (data) => {
                                                this.permissionsService.setUsername(data);
                                            }
                                        );
                                    } else {
                                        localStorage.setItem('movetoHome', 'false');
                                    }
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        },
                        (error) => {

                        }
                    );
                },
                (error) => console.log(error)
            );
    }

    // public getItem(item) {
    //     let currentItem = this.getStorageItem(item, (data) => {
    //         return data;
    //     });
    //     let jsonObj = JSON.stringify(currentItem);
    //
    //     console.log('current item: ', currentItem);
    // }

    public getStorageItem(item, callback) {
        console.log('storage object', this.storage);
        return this.storage.get(item)
            .then(
                (data) => {
                    if (callback && callback instanceof Function) {
                        return callback(data);
                    }

                },
                (error) => {
                    console.log(error);
                }
            );
    }

    public setStorageItem(item, value) {
        this.storage.set(item, value).then(
            (data) => {
                console.log('set', data);
                this.safeStorage[item] = value
            },
            (error) => {

            }
        );
    }

    public bringUpLockSettings() {
        this.storage.secureDevice().then(() => {}, () => {});
    }


    public clearSecureStorage() {
        this.storage.clear().then();
        this.safeStorage = {};
    }
}