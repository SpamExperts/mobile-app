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
                        () => {
                            this.storage.get('rememberMe').then(
                                (data) => {
                                    if(data == 'true') {

                                        this.movetoHome = true;
                                        this.storage.get('role').then(
                                            (data) => {
                                                this.permissionsService.setPermissions(data);
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
                                () => {}
                            );
                        },
                        () => {}
                    );
                },
                () => {}
            );
    }

    public getStorageItem(item, callback) {
        return this.storage.get(item)
            .then(
                (data) => {
                    if (callback && callback instanceof Function) {
                        return callback(data);
                    }

                },
                () => {}
            );
    }

    public setStorageItem(item, value) {
        this.storage.set(item, value).then(
            () => {
                this.safeStorage[item] = value
            },
            () => {}
        );
    }

    public bringUpLockSettings() {
        this.storage.secureDevice().then(() => {}, () => {});
    }


    public clearSecureStorage() {
        this.storage.clear().then();
    }
}