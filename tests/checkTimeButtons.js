var LoginPage=require('./dependencies/LoginPageObject.js');
var iSearchPanel=require('./dependencies/SearchPanelObject.js')
var dashPage=require('./dependencies/DashPageObject.js');
// var dashPage = function() {
//     this.leftButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-navicon')]"));
//     this.logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
//     this.loginCheck = element.all(by.xpath("//h4[contains(.,'Your available products')]")).get(0);
//     this.incoming = element(by.xpath("//ion-list//a[contains(.,'Incoming Filtering Quarantine')]"));
//     this.outgoing = element(by.xpath("//ion-list//a[contains(.,'Outgoing Filtering Quarantine')]"));
//     this.bigIncoming = element(by.xpath("//a[@ui-sref='main.incomingLogSearch']"));
//     this.bigOutgoing = element(by.xpath("//a[@ui-sref='main.outgoingLogSearch']"));
//     this.right_arrow = element(by.xpath("//button[@class='button button-icon icon ion-ios-arrow-right']"));
//     this.left_arrow = element(by.xpath("//button[@class='button button-icon icon ion-ios-arrow-left']"));
//     this.ioleftButton = element(by.xpath("//button[@class='button button-icon icon ion-navicon disable-user-behavior']"));
//     this.ibuttonMessage = element(by.xpath("//div/div/div/div[contains(.,'Incoming spam messages')]"));
//     this.obuttonMessage = element(by.xpath("//div/div/div/div[contains(.,'Outgoing spam messages')]"));
//     this.iRefresher = element(by.xpath("(//ion-item[@ng-if='!loadingEntries && !messageEntries.length'])[1]"));
//     this.oRefresher = element(by.xpath("(//ion-item[@ng-if='!loadingEntries && !messageEntries.length'])[2]"));
//     this.isearchdate = element(by.xpath("(//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')])[1]"));
//     this.osearchdate = element(by.xpath("(//div[@class='col col-30 col-center text-right top-date ng-binding'])[2]"));
//     this.suggestionMessageClose = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/ion-content/div[1]/div[1]/div/div/div[1]/ion-slide/i"));
//     this.copyRight = element(by.xpath("(//div[@class='col text-center ng-binding'])[1]"));
// };

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
                    {
                    	currentDay = 31;
                    	currentMonth-=1;
                    			}
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
                    {currentDay = 31 + currentDay - 7;
                    currentMonth-=1;}
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
                currentYear--;
            } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                currentMonth == 9 || currentMonth == 11) {
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
           browser.sleep(1000);
        // browser.wait(EC.visibilityOf(logged.bigIncoming), 20000)
        //     .then(function() {
                logged.bigIncoming.click();
            // });
        //logged.suggestionMessageClose.click();
       browser.sleep(1000);
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
