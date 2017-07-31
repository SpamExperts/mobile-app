var LoginPage = function() { //create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.

    this.logo = element(by.xpath("//img[contains(@class,'se-icon')]"));
    this.hostname = element(by.xpath("//input[contains(@ng-model,'data.hostname')]"));
    this.user = element(by.xpath("//input[contains(@ng-model,'data.username')]"));
    this.password = element(by.xpath("//input[contains(@ng-model,'data.password')]"));
    this.reminder = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logbutton = element(by.xpath("//button[contains(@on-tap,'login(data)')]"));
};
var dashPage = function() {
    this.leftButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-navicon')]"));
    this.logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    this.loginCheck = element.all(by.xpath("//h4[contains(.,'Your available products')]")).get(0);
    this.incoming = element(by.xpath("//ion-list//a[contains(.,'Incoming Filtering Quarantine')]"));
    this.outgoing = element(by.xpath("//ion-list//a[contains(.,'Outgoing Filtering Quarantine')]"));
    this.bigIncoming = element(by.xpath("//a[@ui-sref='main.incomingLogSearch']"));
    this.bigOutgoing = element(by.xpath("//a[@ui-sref='main.outgoingLogSearch']"));
    this.right_arrow = element(by.xpath("//button[@class='button button-icon icon ion-ios-arrow-right']"));
    this.left_arrow = element(by.xpath("//button[@class='button button-icon icon ion-ios-arrow-left']"));
    this.ioleftButton = element(by.xpath("//button[@class='button button-icon icon ion-navicon disable-user-behavior']"));
    this.ibuttonMessage = element(by.xpath("//div/div/div/div[contains(.,'Incoming spam messages')]"));
    this.obuttonMessage = element(by.xpath("//div/div/div/div[contains(.,'Outgoing spam messages')]"));
    this.iRefresher = element(by.xpath("(//ion-item[@ng-if='!loadingEntries && !messageEntries.length'])[1]"));
    this.oRefresher = element(by.xpath("(//ion-item[@ng-if='!loadingEntries && !messageEntries.length'])[2]"));
    this.isearchdate = element(by.xpath("(//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')])[1]"));
    this.osearchdate = element(by.xpath("(//div[@class='col col-30 col-center text-right top-date ng-binding'])[2]"));
    this.suggestionMessageClose = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div[1]/div[1]/div/div/div[1]/ion-slide/i"));
    this.copyRight = element(by.xpath("(//div[@class='col text-center ng-binding'])[1]"));
};


var iSearchPanel = function() {

    this.isearchButton = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-header-bar/div[3]/button"));
    this.osearchButton = element(by.xpath("(//button[@on-tap='toggleRightMenu($event)'])[2]"));
    this.idomainSearch = element(by.xpath("//input[contains(@placeholder,'Domain')]"));
    this.isenderSearch = element(by.xpath("//input[contains(@placeholder,'Sender')]"));
    this.irecipientSearch = element(by.xpath("//input[contains(@placeholder,'Recipient')]"));
    this.ihourSearch = element(by.xpath("//button[contains(@on-tap,'past24Hours()')]"));
    this.iweekSearch = element(by.xpath("//button[contains(@on-tap,'pastWeek()')]"));
    this.imonthSearch = element(by.xpath("//button[contains(@on-tap,'pastMonth()')]"));
    this.iclearSearch = element(by.xpath("//button[contains(@on-tap,'clearSearch()')]"));
    this.istartSearch = element(by.xpath("//button[contains(@on-tap,'doSearch()')]"));
    this.requirements = element(by.xpath("(//div[@ng-if='isSuperAdmin()'])[1]"));
    this.fromdate = element(by.xpath("//span[@aria-label='From date']"));
    this.todate = element(by.xpath("//span[@aria-label='To date']"));
    this.from = element(by.xpath("(//div[@class='time ng-binding'])[1]"));
    this.to = element(by.xpath("(//div[@class='time ng-binding'])[2]"));
    this.backToResults = element(by.xpath("(//div[contains(.,'Back to results')])[1]"));
    this.calendarHead = element(by.xpath("//div[@class='popup-head']"));
    this.calendarOkButton = element(by.xpath("//button[@class='button ng-binding button-positive']"));
    this.calendarXButton = element(by.xpath("//button[contains(@class,'button ng-binding button-stable')]"));
    this.calendar = element(by.xpath("//div[contains(@class,'popup-body')]"));
};
var dashAlert = function() {
    this.alertButtonOk = element(by.xpath("//button[contains(@class,'button ng-binding button-positive')]"));
};

function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}

function dataDifference(interval) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentDay = currentDate.getDate();
    var currentMonth = currentDate.getMonth() + 1;
    var currentHour = currentDate.getHours();
    var currentMin = currentDate.getMinutes();


    var outputDate;
    switch (interval) {
        case 1:
            if (currentDay == 1) {
                if (currentMonth == 1) {
                    currentDay = 31;
                    currentYear--;
                    currentMonth = 12;
                } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                    currentMonth == 9 || currentMonth == 11)
                    currentDay = 31;
                else if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12)
                    currentDay = 30;
                else {
                    if (currentMonth == 3 && currentYear % 4 == 0)
                        currentDay = 29;
                    else
                        currentDay = 28;
                }

            } else
                currentDay -= 1;

            if (currentHour < 10)
                currentHour = "0".concat("", currentHour);
            if (currentMin < 10)
                currentMin = "0".concat("", currentMin);
            if (currentDay < 10)
                currentDay = "0".concat("", currentDay);
            if (currentMonth < 10)
                currentMonth = "0".concat("", currentMonth);
            outputDate = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMin;
            break;

        case 2:
            if (currentDay <= 7) {
                if (currentMonth == 1) {
                    currentMonth = 12;
                    currentDay = 31 + currentDay - 7;
                    currentYear--;
                } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                    currentMonth == 9 || currentMonth == 11)
                    currentDay = 31 + currentDay - 7;
                else if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12)
                    currentDay = 30 + currentDay - 7;
                else {
                    if (currentMonth == 3 && currentYear % 4 == 0)
                        currentDay = 29 + currentDay - 7;
                    else
                        currentDay = 28 + currentDay - 7;
                }

            } else
                currentDay -= 7;
            if (currentHour < 10)
                currentHour = "0".concat("", currentHour);
            if (currentMin < 10)
                currentMin = "0".concat("", currentMin);
            if (currentDay < 10)
                currentDay = "0".concat("", currentDay);
            if (currentMonth < 10)
                currentMonth = "0".concat("", currentMonth);
            outputDate = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMin;
            break;

        case 3:
            if (currentMonth == 1) {
                currentMonth = 12;
                currentDay = currentDay + 1;
                currentYear--;
            } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                currentMonth == 9 || currentMonth == 11) {
                currentDay = currentDay + 1;
                currentMonth -= 1;
            } else if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12) {
                if(currentDay==31)
                    currentDay=1;
                else
                    currentMonth -= 1;
            } else {
                if (currentMonth == 3 && currentYear % 4 == 0)
                    currentDay = currentDay - 1;
                else
                    currentDay = currentDay - 2;
                currentMonth -= 1;
            }
            if (currentHour < 10)
                currentHour = "0".concat("", currentHour);
            if (currentMin < 10)
                currentMin = "0".concat("", currentMin);
            if (currentDay < 10)
                currentDay = "0".concat("", currentDay);
            if (currentMonth < 10)
                currentMonth = "0".concat("", currentMonth);
            outputDate = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMin;
            break;
    }
    return outputDate;

}

function addCredentials(Obj, host, user, pwd) {
    //The three fields should be provided with valid data
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);
}
var data = require("./dataForUserRestrictedLogin.json");
describe('mobile app dash page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new dashAlert(); //initialize the Popup//
    var logged = new dashPage();
    var search = new iSearchPanel();
    var EC = protractor.ExpectedConditions;


    it('should return correct datetime depending on the button', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);

        var outputDate;
        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);
        Obj.logbutton.click();

        browser.wait(EC.visibilityOf(logged.loginCheck), 20000)
            .then(function() {
                expect(logged.loginCheck.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.bigIncoming), 20000)
            .then(function() {
                logged.bigIncoming.click();
            });
        //logged.suggestionMessageClose.click();
      
        search.isearchButton.click();
    
        browser.sleep(800);
        search.ihourSearch.click();
        browser.sleep(500);
        outputDate = dataDifference(1);
        expect(search.from.getText()).toEqual(outputDate);
        search.iweekSearch.click();
        browser.sleep(500);
        outputDate = dataDifference(2);
        expect(search.from.getText()).toEqual(outputDate);
        search.imonthSearch.click();
        browser.sleep(500);
        outputDate = dataDifference(3);
        expect(search.from.getText()).toEqual(outputDate);
        browser.refresh();
        field_cleaner(Obj);
        browser.refresh();
    });
});
