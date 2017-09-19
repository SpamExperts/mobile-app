import { ElementRef, ViewChild } from '@angular/core';
import { Events, MenuController, NavController, PopoverController } from 'ionic-angular';
import { InfiniteScroll } from 'ionic-angular';
import { IncomingService } from '../../core/incoming.service';
import { MessageDetailsPage } from '../message-details/message-details.component';
import { Api } from '../../core/api.service';
import { Headers } from '@angular/http';
import { PopoverPage } from '../common/popover/popover.component';
import { ActionService } from '../../core/action.service';
import { PermissionService } from '../../core/permissions.service';

export class BaseListComponent {

    @ViewChild('list') list: any;
    @ViewChild('alertButton') alertButton: ElementRef;

    selectedItem: any;
    items: {}[] = [];
    slice: number = 20;
    page: number;
    infiniteScroll: any = null;
    refresher: any = null ;
    count: number;
    last_count: number;
    total_pages: number;
    allowActionRefresh: boolean = false;
    noItems: boolean = true;
    minItems: number = 4;
    messageType: string = '';

    constructor(
        public navCtrl: NavController,
        public listService: IncomingService ,
        public api: Api,
        public menu: MenuController,
        public events: Events,
        public popoverCtrl: PopoverController,
        public actionService: ActionService,
        public permissionService: PermissionService,
    ) {

        setTimeout(function () {
            listService.requiredMessageShown = false;
        }, 15000);

        //the items on the page do not refresh
        if(this.listService.listLeft == true) {
            this.items = this.listService.allItems;
        }

        else {
            //refreshes after 2 seconds
            this.events.subscribe('refresh', () => {
                let thisList = this;
                setTimeout(function () {
                    thisList.actionRefresh();
                }, 2000);
            });

            this.events.subscribe('incomingMessages', (data) => {

                this.handleMessages(data);

                //initialize with the number of pages and messages at the first search
                this.count = this.listService.count;
                this.total_pages = this.listService.totalPages;
                //this has to be set this way because the first request already took place (for page -1)
                this.page = -2;

                this.enableInfinite();

                if (data.length < this.minItems && this.count >= this.minItems) {
                    this.getMoreMessages();
                }
            });
        }
    };

    handleMessages(messages: {}[] = []): void {
        if(messages.length == 0) {
            this.noItems = true;
            this.items = [];
        } else {
            this.noItems = false;
            this.items = messages.reverse();
        }
    };

    //when the first (-1) page doesn't have enough messages
    getMoreMessages(): void {

        let url = this.listService.createUrl('get', this.listService.encodedQueryUrl, this.page);
        let headers = new Headers();

        if(this.listService.encodedQueryUrl) {
            this.api.get(url, headers).subscribe((data: any) => {

                let body: any = JSON.parse(data._body);
                this.items = this.items.concat(body.objects.reverse());
                this.page--;

            });
        }

    }

    refresh(refresher) {

        this.listService.requiredMessageShown = true;
        var thisRoot = this;

        setTimeout(function () {
            thisRoot.listService.requiredMessageShown = false;
        }, 15000);
        //not allowed when items are checked
        if(this.listService.checkedNumber > 0 ) {
            refresher.complete();
            return;
        }

        this.allowActionRefresh = false;

        this.actionRefresh();

        setTimeout( function() {
            refresher.complete();
        }, 1000);
    }

    //this is the automatically made refresh and it is used in the manual refresh,too
    actionRefresh() {

        this.refreshDate();

        let url = this.listService.createUrl('get', this.listService.encodedQueryUrl, -1);
        let headers = new Headers();

        //if there is a query
        if(this.listService.encodedQueryUrl ) {
            this.api.get(url, headers).subscribe((data: any) => {
                let body = JSON.parse(data._body);
                let messages: any = body.objects;

                //last_count remembers the number of the messages when the last search or refresh was done
                this.last_count = this.count;
                this.count = body.num_results;
                this.total_pages = body.total_pages;

                if(this.count != this.last_count) {

                    this.enableInfinite();
                    this.page = -2;
                    this.handleMessages(messages);
                    if (messages.length < this.minItems && this.count >= this.minItems) {
                        this.getMoreMessages();
                    }
                }
            });
        }

    }

    doInfinite(infiniteScroll: InfiniteScroll) {

        this.infiniteScroll = infiniteScroll;

        //if there are pages to be requested
        if(this.listService.listLeft == true && this.listService.runInfinite == true) {
            this.total_pages = this.listService.totalPages;
            this.page = this.listService.page;
            this.listService.runInfinite = false;
        }

        if(this.total_pages >= -this.page ) {

            let url = this.listService.createUrl('get', this.listService.encodedQueryUrl, this.page);
            let headers = new Headers();

            this.api.get(url, headers).subscribe((data: any) => {

                let messages: any = JSON.parse(data._body);
                this.items = this.items.concat(messages.objects.reverse());
                this.page--;

                infiniteScroll.complete();

            });
        }
        else {

            infiniteScroll.complete();
            infiniteScroll.enable(false);

        }
    }

    enableInfinite() {

        if(this.infiniteScroll!= null) {
            if(this.infiniteScroll.state == 'disabled') {
                this.infiniteScroll.enable(true);
            }
        }
    }

    refreshDate() {

        if(this.listService.currentQuery != undefined && this.listService.currentQuery != null) {
            let query = this.listService.currentQuery;
            let date = new Date();
            for (let item of query.filters[0].and) {
                if (item.name == 'datetime' && item.op == '<=') {
                    item.val = this.listService.formatDate(date);
                    break;
                }
            }
            this.listService.currentQuery = query;
            this.listService.encodedQueryUrl = encodeURI(JSON.stringify(query));

        }

    }

    itemTapped(event, item) {
        this.navCtrl.push(MessageDetailsPage, {
            item: item
        });
    }

    changeCheckedItems(item, $event): void {
        $event.stopPropagation();
        item.checked = !item.checked;

        if(item.checked) {
            this.listService.checkedNumber ++;
        }
        else {
            this.listService.checkedNumber --;
        }

        this.listService.allItems = this.items;

    }

    openPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

    ionViewWillLeave() {
        this.listService.allItems = this.items;
        this.listService.listLeft = true;
        this.listService.totalPages = this.total_pages;
        this.listService.page = this.page;
        this.listService.runInfinite = true;
    }

    closeAlert() {
        this.listService.requiredMessageShown = false;
    }

}