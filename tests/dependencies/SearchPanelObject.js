var SearchPanel = function() {

    this.isearchButton = element.all(by.css('[on-tap="toggleRightMenu($event)"]')).get(0);
    this.osearchButton = element.all(by.css('[on-tap="toggleRightMenu($event)"]')).get(1);
    this.backButton = element(by.css('.button.button-icon.icon.ion-ios-arrow-left'));
    this.idomainSearch = element(by.css('[placeholder="Domain"]'));
    this.isenderSearch = element(by.css('[placeholder="Sender"]'));
    this.irecipientSearch = element(by.css('[placeholder="Recipient"]'));

    this.dateTitle = element(by.css('[aria-label="Sent"]'));
    this.ihourSearch = element(by.css('[on-tap="past24Hours()"]'));
    this.iweekSearch = element(by.css('[on-tap="pastWeek()"]'));
    this.imonthSearch = element(by.css('[on-tap="pastMonth()"]'));
    this.iclearSearch = element(by.css('[on-tap="clearSearch()"]'));
    this.istartSearch = element(by.css('[on-tap="doSearch()"]'));
    this.searchTitle = element(by.css('.scroll>h4'));
    this.backToResults = element.all(by.cssContainingText('.title', 'Back to results')).get(0);
    this.requirements = element.all(by.css('[ng-if="isSuperAdmin()"]')).get(0);

    this.customTitle = element(by.css('[aria-label="Custom timeframe"]'));
    this.fromdate = element(by.css('[aria-label="From date"]'));
    this.todate = element(by.css('[aria-label="To date"]'));
    this.from = element.all(by.css('.time.ng-binding')).get(0);
    this.to = element.all(by.css('.time.ng-binding')).get(1);

    this.calendarHead = element(by.css('.popup-title.ng-binding'));
    this.calendarOkButton = element(by.css('.button.ng-binding.button-positive'));
    this.calendarXButton = element(by.css('.button.ng-binding.button-stable'));
    this.calendar = element(by.css('.popup-body'));
    this.calendaryearField = element(by.css('[ng-model="bind.year"]'));
    this.calendarmonthButton = element(by.css('[ng-model="bind.month"]')); 
    this.calendarhourField = element(by.css('[ng-model="bind.hour"]'));
    this.calendarminuteField = element(by.css('[ng-model="bind.minute"]'));
};

module.exports = SearchPanel;