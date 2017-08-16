import { Injectable } from '@angular/core';

@Injectable()
export class IncomingService {

    public incomingMessages: any ;

    public getMessages(): any {
        return this.incomingMessages;
    }

}