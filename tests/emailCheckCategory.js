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
    this.suggestionMessage = element(by.xpath("//div[contains(@ng-bind-html,'notice|trust')]"));
     this.copyRight=element(by.xpath("(//div[@class='col text-center ng-binding'])[1]"));
};

var AlertPop_up = function() {

    this.alertBody = element(by.xpath("//div[contains(@class,'popup-body')]"));
    this.alertButton = element(by.xpath("//button[contains(@ng-click,'event)')]"));
};
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
    this.backToResults=element(by.xpath("(//div[contains(.,'Back to results')])[1]"));
    this.fromdate = element(by.xpath("//span[@aria-label='From date']"));
    this.todate = element(by.xpath("//span[@aria-label='To date']"));
    this.calendarHead=element(by.xpath("//div[@class='popup-head']"));
    this.calendarOkButton=element(by.xpath("//button[@class='button ng-binding button-positive']"));
    this.calendarXButton=element(by.xpath("//button[contains(@class,'button ng-binding button-stable')]"));
    this.calendar=element(by.xpath("//div[contains(@class,'popup-body')]"));
};
var imailButtons= function(){
     this.selectButton      =element(by.xpath("(//label[@ng-model='message.isChecked'])[1]"));
     this.releaseButton     =element(by.xpath("(//div[@ng-repeat='action in barActions'])[1]"));
     this.removeButton      =element(by.xpath("(//div[@ng-repeat='action in barActions'])[2]"));
     this.moreActButton     =element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[1]"));
     this.mabUnselect       =element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
     this.mabRelease        =element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
     this.mabRelAndTrain    =element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
     this.mabRemove         =element(by.xpath("(//li[@on-tap='processAction(action)'])[3]"));
     this.mailBody          =element(by.xpath("(//div[contains(@class,'col col-85')])[1]"));
     this.category          =element(by.xpath("(//span[@class='metallic-border main-class ng-binding'])[1]"));
     this.mailDate          =element(by.xpath("(//div[@class='col col-80 message-title ng-binding'])[1]"));
};
var imailLayout=function(){
    this.sentLabel=element(by.xpath("//td[contains(.,'sent: ')]"));
    this.fromLabel=element(by.xpath("//td[contains(.,'from: ')]"));
    this.toLabel=element(by.xpath("//td[contains(.,'to:  ')]"));
    this.releaseBtn=element(by.xpath("(//button[contains(@class,'button button-clear')])[2]"));
    this.removeBtn=element(by.xpath("(//button[contains(@class,'button button-clear')])[3]"));
    this.moreActButton=element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease=element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain=element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.plainType=element(by.xpath("//div[contains(@class,'user') and contains(.,'Plain')]"));
    this.normalType=element(by.xpath("//div[contains(@class,'user') and contains(.,'Normal')]"));
    this.rawType=element(by.xpath("//div[contains(@class,'user') and contains(.,'Raw')]"));
    this.date=element(by.xpath("//h5[@class='ng-binding']"));

    this.mailContent=element(by.xpath("//ion-scroll[contains(@class,'scroll-view ionic-scroll scroll-y')]"));
};
var omailButtons= function(){
     this.selectButton      =element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[2]/div[2]/label"));
     this.releaseButton     =element(by.xpath("(//div[@ng-repeat='action in barActions'])[1]"));
     this.removeButton      =element(by.xpath("(//div[@ng-repeat='action in barActions'])[2]"));
     this.moreActButton     =element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[1]"));
     this.mabUnselect       =element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
     this.mabRelease        =element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
     this.mabRelAndTrain    =element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
     this.mabRemove         =element(by.xpath("(//li[@on-tap='processAction(action)'])[3]"));
     this.mailBody          =element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]"));
     this.category          =element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]/div[1]/div[2]/span"));
     this.mailDate          =element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]/div[1]/div[1]"));
};
var omailLayout=function(){
    this.sentLabel=element(by.xpath("//td[contains(.,'sent: ')]"));
    this.fromLabel=element(by.xpath("//td[contains(.,'from: ')]"));
    this.toLabel=element(by.xpath("//td[contains(.,'to:  ')]"));
    this.releaseBtn=element(by.xpath("(//button[contains(@class,'button button-clear')])[2]"));
    this.removeBtn=element(by.xpath("(//button[contains(@class,'button button-clear')])[3]"));
    this.moreActButton=element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease=element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain=element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.plainType=element(by.xpath("//div[contains(@class,'user') and contains(.,'Plain')]"));
    this.normalType=element(by.xpath("//div[contains(@class,'user') and contains(.,'Normal')]"));
    this.rawType=element(by.xpath("//div[contains(@class,'user') and contains(.,'Raw')]"));
    this.date=element(by.xpath("//h5[@class='ng-binding']"));

    this.mailContent=element(by.xpath("//ion-scroll[contains(@class,'scroll-view ionic-scroll scroll-y')]"));
};
function log_check_close(Obj, alert) {

    Obj.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 20000)
        .then(function() {
            expect(alert.alertBody.getText()).toEqual('Oops! Something went wrong! Please try again later!');
            alert.alertButton.click(); //close the alert
        });
}
function checkLayout(mailBtn,checkMail){
    var EC = protractor.ExpectedConditions;
     browser.wait(EC.visibilityOf(mailBtn.selectButton ), 20000)
            .then(function() {
                mailBtn.selectButton.click();
            });
               browser.wait(EC.visibilityOf(mailBtn.releaseButton), 20000)
            .then(function() {
               expect( mailBtn.releaseButton.isPresent()).toBeTruthy();
            });
                 browser.wait(EC.visibilityOf(mailBtn.removeButton), 20000)
            .then(function() {
               expect( mailBtn.removeButton.isPresent()).toBeTruthy();
            });
                   browser.wait(EC.visibilityOf( mailBtn.moreActButton), 20000)
            .then(function() {
               expect(  mailBtn.moreActButton.isPresent()).toBeTruthy();
            });
                   browser.wait(EC.visibilityOf(mailBtn.mabUnselect), 20000)
            .then(function() {
               expect( mailBtn.mabUnselect.isPresent()).toBeTruthy();
            });
            mailBtn.moreActButton.click();
                   browser.wait(EC.visibilityOf(mailBtn.mabRelease), 20000)
            .then(function() {
               expect( mailBtn.mabRelease.isPresent()).toBeTruthy();
            });
                   browser.wait(EC.visibilityOf(mailBtn.mabRelAndTrain), 20000)
            .then(function() {
               expect(mailBtn.mabRelAndTrain.isPresent()).toBeTruthy();
            });
                   browser.wait(EC.visibilityOf(mailBtn.mabRemove), 20000)
            .then(function() {
               expect(mailBtn.mabRemove.isPresent()).toBeTruthy();
            });
            browser.actions().click().perform();
                  
                   browser.wait(EC.visibilityOf(mailBtn.category), 20000)
            .then(function() {
               expect(mailBtn.category.isPresent()).toBeTruthy();
            });
                  browser.wait(EC.visibilityOf(mailBtn.mailDate ), 20000)
            .then(function() {
               expect(mailBtn.mailDate.isPresent()).toBeTruthy();
            });
            browser.ignoreSynchronization=false;
            mailBtn.selectButton.click();
               browser.wait(EC.visibilityOf(mailBtn.mailBody), 20000)
            .then(function() {
               mailBtn.mailBody.click();
            });
                  browser.wait(EC.visibilityOf(checkMail.sentLabel), 20000)
            .then(function() {
               expect(checkMail.sentLabel.isPresent()).toBeTruthy();
            });
            //       browser.wait(EC.visibilityOf(checkMail.fromLabel), 20000)
            // .then(function() {
            //    expect(checkMail.fromLabel.isPresent()).toBeTruthy();
            // });
            //   browser.wait(EC.visibilityOf(checkMail.toLabel), 20000)
            // .then(function() {
            //    expect(checkMail.toLabel.isPresent()).toBeTruthy();
            // });
                   browser.wait(EC.visibilityOf(checkMail.plainType), 20000)
            .then(function() {
               expect(checkMail.plainType.isPresent()).toBeTruthy();
            });
                  browser.wait(EC.visibilityOf(checkMail.normalType), 20000)
            .then(function() {
               expect(checkMail.normalType.isPresent()).toBeTruthy();
            });
              browser.wait(EC.visibilityOf(checkMail.rawType), 20000)
            .then(function() {
               expect(checkMail.rawType.isPresent()).toBeTruthy();
            });
            //      browser.wait(EC.visibilityOf(checkMail.mailContent), 20000)
            // .then(function() {
            //    expect(checkMail.mailContent.isPresent()).toBeTruthy();
            // });
                  browser.wait(EC.visibilityOf(checkMail.date), 20000)
            .then(function() {
               expect(checkMail.date.isPresent()).toBeTruthy();
            });
              browser.wait(EC.visibilityOf(checkMail.moreActButton), 20000)
            .then(function() {
               expect(checkMail.moreActButton.isPresent()).toBeTruthy();
            });
              browser.wait(EC.visibilityOf(checkMail.releaseBtn), 20000)
            .then(function() {
               expect(checkMail.releaseBtn.isPresent()).toBeTruthy();
            });
              browser.wait(EC.visibilityOf(checkMail.removeBtn), 20000)
            .then(function() {
               expect(checkMail.removeBtn.isPresent()).toBeTruthy();
            });
            checkMail.moreActButton.click();

             browser.wait(EC.visibilityOf(checkMail.mabRelease), 20000)
            .then(function() {
               expect(checkMail.mabRelease.isPresent()).toBeTruthy();
            });
              browser.wait(EC.visibilityOf(checkMail.mabRelAndTrain), 20000)
            .then(function() {
               expect(checkMail.mabRelAndTrain.isPresent()).toBeTruthy();
            });
               browser.actions().click().perform();
               browser.navigate().back();
                browser.navigate().back();
}   
var dashAlert = function() {
    this.alertButtonOk = element(by.xpath("//button[contains(@class,'button ng-binding button-positive')]"));
};
function addCredentials(Obj, host, user, pwd) {
    //The three fields should be provided with valid data
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);
}

function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}
describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    var logged = new dashPage();
    var dashA = new dashAlert();
    var search = new iSearchPanel();
    var mailBtn=new imailButtons();
    var checkMail=new imailLayout();
    var data = require("./dataForUserRestrictedLogin");
    var EC = protractor.ExpectedConditions;
    var omailBtn=new omailButtons();
    var ocheckMail=new omailLayout();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    it('should keep the user logged if the button is checked and not logged otherwise', function() {
    browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password on the second element of the arrays.
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
        browser.wait(EC.visibilityOf(search.isearchButton), 20000)
            .then(function() {
               search.isearchButton.click();
            });
        browser.wait(EC.visibilityOf(search.idomainSearch), 20000)
            .then(function() {
               search.idomainSearch.sendKeys(data.theDomain);
            });
            browser.ignoreSynchronization=true;
        browser.wait(EC.visibilityOf(search.istartSearch), 20000)
            .then(function() {
               search.istartSearch.click();
         
            });
             
       checkLayout(mailBtn,checkMail);
           browser.wait(EC.visibilityOf(logged.loginCheck), 20000)
            .then(function() {
                expect(logged.loginCheck.isPresent()).toBeTruthy();

            });
        browser.wait(EC.visibilityOf(logged.bigOutgoing), 20000)
            .then(function() {
                logged.bigOutgoing.click();
            });
         
        browser.wait(EC.visibilityOf(search.osearchButton), 20000)
            .then(function() {
               search.osearchButton.click();
         
            });

        browser.wait(EC.visibilityOf(search.idomainSearch), 20000)
            .then(function() {
               search.idomainSearch.sendKeys(data.theDomain);
            });
        browser.wait(EC.visibilityOf(search.istartSearch), 20000)
            .then(function() {
               search.istartSearch.click();
            });
         checkLayout(omailBtn,ocheckMail);
         
                     
                      
                     
                     

    });
});