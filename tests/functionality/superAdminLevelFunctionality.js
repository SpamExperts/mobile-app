var LoginPage = require('.././dependencies/LoginPageObject.js');
var iSearchPanel = require('.././dependencies/SearchPanelObject.js');
var AlertPop_up = require('.././dependencies/AlertLogPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');

var imailButtons = require('.././dependencies/IncomingPageWithEmails.js');
var imailLayout = require('.././dependencies/InsideIncomingEmail.js');
var omailButtons = require('.././dependencies/OutgoingPageWithEmails.js');
var omailLayout = require('.././dependencies/InsideOutgoingEmail.js');

function checkLayout(mailBtn, checkMail) {
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    browser.wait(EC.visibilityOf(mailBtn.releaseButton), 5000)
        .then(function() {
            expect(mailBtn.releaseButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.removeButton), 5000)
        .then(function() {
            expect(mailBtn.removeButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.moreActButton), 5000)
        .then(function() {
            expect(mailBtn.moreActButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.mabUnselect), 5000)
        .then(function() {
            expect(mailBtn.mabUnselect.isPresent()).toBeTruthy();
        });
    mailBtn.moreActButton.click();
    browser.wait(EC.visibilityOf(mailBtn.mabRelease), 5000)
        .then(function() {
            expect(mailBtn.mabRelease.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.mabRelAndTrain), 5000)
        .then(function() {
            expect(mailBtn.mabRelAndTrain.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.mabRemove), 5000)
        .then(function() {
            expect(mailBtn.mabRemove.isPresent()).toBeTruthy();
        });
    browser.actions().click().perform();

    browser.wait(EC.visibilityOf(mailBtn.category), 5000)
        .then(function() {
            expect(mailBtn.category.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.mailDate), 5000)
        .then(function() {
            expect(mailBtn.mailDate.isPresent()).toBeTruthy();
        });
    browser.ignoreSynchronization = false;
    mailBtn.selectButton.click();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    browser.wait(EC.visibilityOf(checkMail.sentLabel), 5000)
        .then(function() {
            expect(checkMail.sentLabel.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.fromLabel), 5000)
        .then(function() {
            expect(checkMail.fromLabel.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.toLabel), 5000)
        .then(function() {
            expect(checkMail.toLabel.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.plainType), 5000)
        .then(function() {
            expect(checkMail.plainType.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.normalType), 5000)
        .then(function() {
            expect(checkMail.normalType.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.rawType), 5000)
        .then(function() {
            expect(checkMail.rawType.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.mailContent), 5000)
        .then(function() {
            expect(checkMail.mailContent.isPresent()).toBeTruthy();
            expect(checkMail.mailContent.getText())
                .toEqual('XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X');
        });

    browser.wait(EC.visibilityOf(checkMail.moreActButton), 5000)
        .then(function() {
            expect(checkMail.moreActButton.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.releaseBtn), 5000)
        .then(function() {
            expect(checkMail.releaseBtn.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.removeBtn), 5000)
        .then(function() {
            expect(checkMail.removeBtn.isPresent()).toBeTruthy();
        });
    checkMail.moreActButton.click();

    browser.wait(EC.visibilityOf(checkMail.mabRelease), 5000)
        .then(function() {
            expect(checkMail.mabRelease.isPresent()).toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.mabRelAndTrain), 5000)
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
describe('Mobile app email page superAdminLevel', function() {

    var data = require(".././dependencies/dataForUserRestrictedLogin");
    var Obj = new LoginPage(); // initialize an object//
    var logged = new dashPage();
    var search = new iSearchPanel();
    var mailBtn = new imailButtons();
    var checkMail = new imailLayout();

    var EC = protractor.ExpectedConditions;
    var omailBtn = new omailButtons();
    var ocheckMail = new omailLayout();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    it('should check functionality and presence of the buttons', function() {
        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password
        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);
        Obj.logbutton.click();


        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent()).toBeTruthy();

            });
        browser.wait(EC.visibilityOf(logged.bigIncoming), 5000)
            .then(function() {
                logged.bigIncoming.click();
            });
        browser.ignoreSynchronization = false;
        browser.wait(EC.visibilityOf(search.isearchButton), 5000)
            .then(function() {
                search.isearchButton.click();
            });
        browser.wait(EC.visibilityOf(search.idomainSearch), 5000)
            .then(function() {
                search.idomainSearch.sendKeys(data.theDomain);
            });

        browser.wait(EC.visibilityOf(search.istartSearch), 5000)
            .then(function() {
                search.istartSearch.click();

            });

        checkLayout(mailBtn, checkMail);
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent()).toBeTruthy();

            });
        browser.wait(EC.visibilityOf(logged.bigOutgoing), 5000)
            .then(function() {
                logged.bigOutgoing.click();
            });
        browser.wait(EC.visibilityOf(search.osearchButton), 5000)
            .then(function() {
                search.osearchButton.click();

            });

        browser.wait(EC.visibilityOf(search.idomainSearch), 5000)
            .then(function() {
                search.idomainSearch.sendKeys(data.theDomain);
            });
        browser.wait(EC.visibilityOf(search.istartSearch), 5000)
            .then(function() {
                search.istartSearch.click();
            });
        checkLayout(omailBtn, ocheckMail);
        browser.refresh();




    });
});