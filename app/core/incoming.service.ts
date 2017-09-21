import { Injectable } from '@angular/core';
import { Api } from './api.service';
import { PermissionService } from './permissions.service';
import { BaseService } from './base.service';

@Injectable()
export class IncomingService extends BaseService {

    endpoint = "/master/log/delivery/<domain>/<local>/";
    messageType = 'incomingMessages';

    constructor(
        public api: Api,
        public permissionService: PermissionService
    ) {
        super(api, permissionService);
    }

}