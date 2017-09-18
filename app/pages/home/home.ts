import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Platform } from 'ionic-angular';
import { Api } from '../../core/api.service';
import { IncomingService } from '../../core/incoming.service';
import { PermissionService } from '../../core/permissions.service';
import { StorageService } from '../../core/storage.service';
import { SecureStorageService } from '../../core/secureStorage.service';
import { IncomingPage } from '../list/list.incoming';
import { OutgoingPage } from '../list/list.outgoing';

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
        public incomingService: IncomingService,
        public menu: MenuController,
        public permissionsService: PermissionService,
        public storage: StorageService,
        public secureStorage: SecureStorageService,
        public platform: Platform
    ){

    }

    public getOutgoingMessages(): any {
        this.navCtrl.setRoot(OutgoingPage);
    }

    public getIncomingMessages(): any {
        this.navCtrl.setRoot(IncomingPage);
    }

    ngOnInit() {
        if (this.platform.is('cordova')) {
            this.incomingService.setLoginUserInfo(this.secureStorage.safeStorage['username'], this.permissionsService.permissions.userRole);
        } else {
            this.incomingService.setLoginUserInfo(this.storage.getUsername(), this.permissionsService.permissions.userRole);
        }
    }

    ionViewDidLeave() {
        this.menu.enable(true,'searchMenu');
    }

    ionViewDidEnter() {
        this.menu.enable(false,'searchMenu');
    }
}