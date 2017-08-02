var CategoryPanel = function(){

	//	Incoming Page
	this.ileftButton = element.all(by.css(".button.button-icon.icon.ion-navicon.disable-user-behavior")).get(1);
	this.iHeader = element(by.cssContaingText('.ng-binding.higher-text','Incoming spam messages'));
	this.iName = element.all(by.css('[ng-if="searchDomain"]')).get(0); 
	this.iemptyContent = element.all(by.cssContaingText('.text-center.item','No entries. Pull to refresh...')).get(0);
	this.itimeDate = element.all(by.css('.col.col-30.col-center.text-right.top-date.ng-binding')).get(0);
	this.isearchButton = element.all(by.css('[on-tap="toggleRightMenu($event)"]')).get(0);

	//	Outgoing Page
	this.oleftButton = element.all(by.css(".button.button-icon.icon.ion-navicon.disable-user-behavior")).get(2);
	this.oHeader = element(by.cssContaingText('.ng-binding.higher-text','Outgoing spam messages'));
	this.oName = element.all(by.css('[ng-if="searchDomain"]')).get(1); 
	this.oemptyContent = element.all(by.cssContaingText('.text-center.item','No entries. Pull to refresh...')).get(1);
	this.otimeDate = element.all(by.css('.col.col-30.col-center.text-right.top-date.ng-binding')).get(1);
	this.osearchButton = element.all(by.css('[on-tap="toggleRightMenu($event)"]')).get(1);

}