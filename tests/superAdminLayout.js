var LoginPage=require('./dependencies/LoginPageObject.js');
var iSearchPanel=require('./dependencies/SearchPanelObject.js')
var dashPage = function() {
    this.leftButton = element(by.xpath("(//button[@class='button button-icon icon ion-navicon'])[1]"));
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
    this.suggestionMessage = element(by.xpath("//div[contains(@ng-bind-html,'notice|trust')]"));
    this.copyRight=element(by.xpath("(//div[@class='col text-center ng-binding'])[1]"));
    this.notification=element(by.xpath("//div[@ng-bind-html='notice|trust']"));
};
var dashAlert = function() {
    this.alertButtonOk = element(by.xpath("//button[contains(@class,'button ng-binding button-positive')]"));
};

function extract_data(formatedDate, currentDate) {
    formatedDate[0] = currentDate[8];
    formatedDate[1] = currentDate[9];
    formatedDate[2] = " ";
    formatedDate[3] = currentDate[4];
    formatedDate[4] = currentDate[5];
    formatedDate[5] = currentDate[6];
    formatedDate[6]=" ";
    formatedDate[7]="-";
    formatedDate[8]=" ";
    formatedDate[9] = currentDate[8];
    formatedDate[10] = currentDate[9];
    formatedDate[11] = " ";
    formatedDate[12] = currentDate[4];
    formatedDate[13] = currentDate[5];
    formatedDate[14] = currentDate[6];
    formatedDate[15]= " ";
    formatedDate[16]= currentDate[11];
    formatedDate[17]= currentDate[12];
    formatedDate[18]= currentDate[13];
    formatedDate[19]= currentDate[14];
}

function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}

function addCredentials(Obj, host, user, pwd) {
    //The three fields should be provided with valid data
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);
}
var data = require("./dataForUserRestrictedLogin.json");
describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new dashAlert(); //initialize the Popup//
    var logged = new dashPage();
    var search = new iSearchPanel();
    var EC = protractor.ExpectedConditions;


    it('should display sugestive error messages', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        var currentDate = Date();
        var formatedDate = new Array();
        extract_data(formatedDate, currentDate);
        formatedDate=formatedDate.join("");

        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);
        Obj.logbutton.click();
//Firstpage's buttons 
        browser.wait(EC.visibilityOf(logged.loginCheck), 20000)
            .then(function() {
                expect(logged.loginCheck.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.bigIncoming), 20000)
            .then(function() {
                expect(logged.bigIncoming.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.bigOutgoing), 20000)
            .then(function() {
                expect(logged.bigOutgoing.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.leftButton), 20000)
            .then(function() {
                expect(logged.leftButton.isPresent()).toBeTruthy();
            });
        logged.leftButton.click();

        browser.wait(EC.visibilityOf(logged.right_arrow), 20000)
            .then(function() {
                expect(logged.right_arrow.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.incoming), 20000)
            .then(function() {
                expect(logged.incoming.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.outgoing), 20000)
            .then(function() {
                expect(logged.outgoing.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.logoutButton), 20000)
            .then(function() {
                expect(logged.logoutButton.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.copyRight), 20000)
            .then(function() {
                expect(logged.copyRight.isPresent()).toBeTruthy();
            });
 //Incoming Layout Check
        logged.incoming.click();
        
        browser.ignoreSynchronization = true;
  //        browser.wait(EC.visibilityOf(logged.notification), 20000)
  //           .then(function() {
  //       expect(logged.notification.isPresent()).toBeTruthy();
  // });
        expect(logged.ibuttonMessage.isPresent()).toBeTruthy();


        expect(logged.isearchdate.isPresent()).toBeTruthy();
        expect(logged.isearchdate.getText()).toEqual(formatedDate);

        browser.wait(EC.visibilityOf(logged.iRefresher), 20000)
            .then(function() {
                expect(logged.iRefresher.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(search.isearchButton), 20000)
            .then(function() {
                expect(search.isearchButton.isPresent()).toBeTruthy();
            });

        search.isearchButton.click();

        expect(logged.left_arrow.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.idomainSearch.isPresent()).toBeTruthy();
        expect(search.isenderSearch.isPresent()).toBeTruthy();
        expect(search.irecipientSearch.isPresent()).toBeTruthy();


        expect(search.ihourSearch.isPresent()).toBeTruthy();
        expect(search.iweekSearch.isPresent()).toBeTruthy();
        expect(search.imonthSearch.isPresent()).toBeTruthy();
        expect(search.iclearSearch.isPresent()).toBeTruthy();
        expect(search.istartSearch.isPresent()).toBeTruthy();
        expect(search.requirements.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();

        search.fromdate.click();
        
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 20000)
            .then(function() {
                search.calendarXButton.click();
            });
            
        browser.sleep(800);
        browser.wait(EC.elementToBeClickable(search.todate), 20000)
            .then(function() {
        search.todate.click();
            });
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 20000)
            .then(function() {
                search.calendarXButton.click();
            });
        browser.navigate().back();
        browser.ignoreSynchronization = false;
//Outgoing Layout Check

 	   logged.leftButton.click();
       logged.outgoing.click();
       browser.ignoreSynchronization = true;
  //   browser.wait(EC.visibilityOf(logged.notification), 20000)
  //           .then(function() {
  //       expect(logged.notification.isPresent()).toBeTruthy();
  // });
        expect(logged.obuttonMessage.isPresent()).toBeTruthy();


        expect(logged.osearchdate.isPresent()).toBeTruthy();
        expect(logged.osearchdate.getText()).toEqual(formatedDate);
        browser.wait(EC.visibilityOf(logged.oRefresher), 20000)
            .then(function() {
                expect(logged.oRefresher.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(search.osearchButton), 20000)
            .then(function() {
                expect(search.osearchButton.isPresent()).toBeTruthy();
            });

        search.osearchButton.click();
        expect(logged.left_arrow.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.idomainSearch.isPresent()).toBeTruthy();
        expect(search.isenderSearch.isPresent()).toBeTruthy();
        expect(search.irecipientSearch.isPresent()).toBeTruthy();



        expect(search.ihourSearch.isPresent()).toBeTruthy();
        expect(search.iweekSearch.isPresent()).toBeTruthy();
        expect(search.imonthSearch.isPresent()).toBeTruthy();
        expect(search.iclearSearch.isPresent()).toBeTruthy();
        expect(search.istartSearch.isPresent()).toBeTruthy();
        expect(search.requirements.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();
        search.fromdate.click();
        
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 20000)
            .then(function() {
                search.calendarXButton.click();
            });
            
        browser.sleep(800);
        browser.wait(EC.elementToBeClickable(search.todate), 20000)
            .then(function() {
        search.todate.click();
            });
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 20000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.refresh();
    });
});
