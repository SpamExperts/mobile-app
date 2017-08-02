var LoginPage=require('./dependencies/LoginPageObject.js');
var iSearchPanel=require('./dependencies/SearchPanelObject.js');
var AlertPop_up=require('./dependencies/AlertLogPageObject.js');
var dashPage=require('./dependencies/DashPageObject.js');

var imailButtons = function() {
    this.selectButton = element(by.xpath("(//label[@ng-model='message.isChecked'])[1]"));
    this.releaseButton = element(by.xpath("(//div[@ng-repeat='action in barActions'])[1]"));
    this.removeButton = element(by.xpath("(//div[@ng-repeat='action in barActions'])[2]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[1]"));
    this.mabUnselect = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.mabRemove = element(by.xpath("(//li[@on-tap='processAction(action)'])[3]"));
    this.mailBody = element(by.xpath("(//div[contains(@class,'col col-85')])[1]"));
    this.category = element(by.xpath("(//span[@class='metallic-border main-class ng-binding'])[1]"));
    this.mailDate = element(by.xpath("(//div[@class='col col-80 message-title ng-binding'])[1]"));
};
var imailLayout = function() {
    this.sentLabel = element(by.xpath("(//td[contains(@class,'header-name')])[1]"));
    this.fromLabel = element(by.xpath("(//td[contains(@class,'header-name')])[2]"));
    this.toLabel = element(by.xpath("(//td[contains(@class,'header-name')])[3]"));
    this.releaseBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[2]"));
    this.removeBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[3]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.plainType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Plain')]"));
    this.normalType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Normal')]"));
    this.rawType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Raw')]"));
    this.date = element(by.xpath("//h5[@class='ng-binding']"));

    this.mailContent = element(by.xpath("//ion-scroll[contains(@direction,'y')]"));
};
var omailButtons = function() {
    this.selectButton = element(by.xpath("//ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[2]/div[2]/label"));
    this.releaseButton = element(by.xpath("(//div[@ng-repeat='action in barActions'])[1]"));
    this.removeButton = element(by.xpath("(//div[@ng-repeat='action in barActions'])[2]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[1]"));
    this.mabUnselect = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.mabRemove = element(by.xpath("(//li[@on-tap='processAction(action)'])[3]"));
    this.mailBody = element(by.xpath("//ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]"));
    this.category = element(by.xpath("(//ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]/div[1]/div[2]/span)[2]"));
    this.mailDate = element(by.xpath("(//ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]/div[1]/div[1])[2]"));
};
var omailLayout = function() {
    this.sentLabel = element(by.xpath("(//td[contains(@class,'header-name')])[1]"));
    this.fromLabel = element(by.xpath("(//td[contains(@class,'header-name')])[2]"));
    this.toLabel = element(by.xpath("(//td[contains(@class,'header-name')])[3]"));
    this.releaseBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[2]"));
    this.removeBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[3]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.plainType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Plain')]"));
    this.normalType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Normal')]"));
    this.rawType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Raw')]"));
    this.date = element(by.xpath("//h5[@class='ng-binding']"));

    this.mailContent = element(by.xpath("//ion-scroll[contains(@direction,'y')]"));
};

function checkLayout(mailBtn, checkMail) {
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 20000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    browser.wait(EC.visibilityOf(mailBtn.releaseButton), 20000)
        .then(function() {
            expect(mailBtn.releaseButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.removeButton), 20000)
        .then(function() {
            expect(mailBtn.removeButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.moreActButton), 20000)
        .then(function() {
            expect(mailBtn.moreActButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.mabUnselect), 20000)
        .then(function() {
            expect(mailBtn.mabUnselect.isPresent()).toBeTruthy();
        });
    mailBtn.moreActButton.click();
    browser.wait(EC.visibilityOf(mailBtn.mabRelease), 20000)
        .then(function() {
            expect(mailBtn.mabRelease.isPresent()).toBeTruthy();
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
    browser.wait(EC.visibilityOf(mailBtn.mailDate), 20000)
        .then(function() {
            expect(mailBtn.mailDate.isPresent()).toBeTruthy();
        });
    browser.ignoreSynchronization = false;
    mailBtn.selectButton.click();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 20000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    browser.wait(EC.visibilityOf(checkMail.sentLabel), 20000)
        .then(function() {
            expect(checkMail.sentLabel.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.fromLabel), 20000)
        .then(function() {
            expect(checkMail.fromLabel.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.toLabel), 20000)
        .then(function() {
            expect(checkMail.toLabel.isPresent()).toBeTruthy();
        });
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
    browser.wait(EC.visibilityOf(checkMail.mailContent), 20000)
        .then(function() {
            expect(checkMail.mailContent.isPresent()).toBeTruthy();
            expect(checkMail.mailContent.getText()).toEqual('XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X');
        });
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

    var data = require("./dataForUserRestrictedLogin");
    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    var logged = new dashPage();
    var search = new iSearchPanel();
    var mailBtn = new imailButtons();
    var checkMail = new imailLayout();
    
    var EC = protractor.ExpectedConditions;
    var omailBtn = new omailButtons();
    var ocheckMail = new omailLayout();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    it('should check email page layout', function() {
        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password
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
        browser.ignoreSynchronization = true;
        browser.wait(EC.visibilityOf(search.istartSearch), 20000)
            .then(function() {
                search.istartSearch.click();

            });

        checkLayout(mailBtn, checkMail);
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
        checkLayout(omailBtn, ocheckMail);
        browser.refresh();




    });
});
