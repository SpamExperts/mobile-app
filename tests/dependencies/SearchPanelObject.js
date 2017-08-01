var iSearchPanel = function() {

    this.isearchButton = element(by.xpath("(//button[@on-tap='toggleRightMenu($event)'])[1]"));
    this.osearchButton = element(by.xpath("(//button[@on-tap='toggleRightMenu($event)'])[2]"));
    this.idomainSearch = element(by.xpath("//input[contains(@placeholder,'Domain')]"));
    this.isenderSearch = element(by.xpath("//input[contains(@placeholder,'Sender')]"));
    this.irecipientSearch = element(by.xpath("//input[contains(@placeholder,'Recipient')]"));
    this.ihourSearch = element(by.xpath("//button[contains(@on-tap,'past24Hours()')]"));
    this.iweekSearch = element(by.xpath("//button[contains(@on-tap,'pastWeek()')]"));
    this.imonthSearch = element(by.xpath("//button[contains(@on-tap,'pastMonth()')]"));
    this.iclearSearch = element(by.xpath("//button[contains(@on-tap,'clearSearch()')]"));
    this.istartSearch = element(by.xpath("//button[contains(@on-tap,'doSearch()')]"));
    this.backToResults = element(by.xpath("(//div[contains(.,'Back to results')])[1]"));
    this.fromdate = element(by.xpath("//span[@aria-label='From date']"));
    this.todate = element(by.xpath("//span[@aria-label='To date']"));
    this.from = element(by.xpath("(//div[@class='time ng-binding'])[1]"));
    this.to = element(by.xpath("(//div[@class='time ng-binding'])[2]"));
    this.calendarHead = element(by.xpath("//div[@class='popup-head']"));
    this.calendarOkButton = element(by.xpath("//button[@class='button ng-binding button-positive']"));
    this.calendarXButton = element(by.xpath("//button[contains(@class,'button ng-binding button-stable')]"));
    this.calendar = element(by.xpath("//div[contains(@class,'popup-body')]"));
    this.requirements=element(by.xpath("(//div[@ng-if='isSuperAdmin()'])[1]"));
};

module.exports=iSearchPanel;