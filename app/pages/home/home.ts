import { Component } from '@angular/core';
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
export class HomePage {

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



        if (this.platform.is('cordova')) {
            if(this.secureStorage.safeStorage['rememberMe'] == 'true') {
                this.permissionsService.setPermissions(this.secureStorage.safeStorage['role']);
            }
        } else {
            if (this.storage.getRememberMe()) {
                this.permissionsService.setPermissions(this.storage.getUserRole());
            }
        }

        this.incomingButton = this.permissionsService.permissions.messagesPages.incoming;
        this.outgoingButton = this.permissionsService.permissions.messagesPages.outgoing;
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
        console.log(this.secureStorage.safeStorage);
    }

    ionViewDidLeave() {
        this.menu.enable(true,'searchMenu');
    }

    ionViewDidEnter() {
        this.menu.enable(false,'searchMenu');
    }
}