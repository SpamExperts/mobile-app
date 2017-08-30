import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlainPage } from './tab-views/plain/plain.component';
import { RawPage } from './tab-views/raw/raw.component';
import { NormalPage } from './tab-views/normal/normal.component';

@Component({
    selector:'app-tabs',
    templateUrl:'./tabs.component.html'
})
export class TabsPage{

    tab1: any;
    tab2: any;
    tab3: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) {
        this.tab1 = PlainPage;
        this.tab2 = RawPage;
        this.tab3 = NormalPage;
    }

}