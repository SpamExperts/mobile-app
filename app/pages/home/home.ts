import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { ListPage } from "../list/list";
import { IncomingService } from '../../core/incoming.service';
import { PermissionService } from '../../core/permissions.service';
import { StorageService } from '../../core/storage.service';
import { SecureStorageService } from '../../core/secureStorage.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit{

    incomingButton: boolean = false;
    outgoingButton: boolean = false;

    constructor(
        public navCtrl: NavController,
        public api: Api,
        public incService: IncomingService,
        public menu: MenuController,
        public permissionsService: PermissionService,
        public storage: StorageService,
        public secureStorage: SecureStorageService,
        public platform: Platform
    ){

    }

    public getIncomingMessages(): any {
        this.navCtrl.setRoot(ListPage);
    }

    ngOnInit() {
        if (this.platform.is('cordova')) {
            this.incService.setLoginUserInfo(this.secureStorage.safeStorage['username'], this.permissionsService.permissions.userRole);
        } else {
            this.incService.setLoginUserInfo(this.storage.getUsername(), this.permissionsService.permissions.userRole);
        }
    }

    ionViewDidLeave() {
        this.menu.enable(true,'searchMenu');
    }

    ionViewDidEnter() {
        this.menu.enable(false,'searchMenu');
    }
}