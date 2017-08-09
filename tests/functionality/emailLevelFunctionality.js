var LoginPage = require('.././dependencies/LoginPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');
var imailButtons = require('.././dependencies/IncomingPageWithEmails.js');
var imailLayout = require('.././dependencies/InsideIncomingEmail.js');
var emailAlert = require('.././dependencies/EmailAlertObject.js');
var msg1 = "Choosing 'Release and Train', for one or several messages, might adversely affect the ";
var msg2 = "quality of filtering for all the existing users.Please avoid any mistakes in your selection!";
var msg = msg1.concat(msg2);

function checkLayout(mailBtn, checkMail) {
    var EC = protractor.ExpectedConditions;
    var emailPopup = new emailAlert();
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    browser.wait(EC.visibilityOf(mailBtn.releaseButton), 5000)
        .then(function() {
            expect(mailBtn.releaseButton.isPresent())
                .toBeTruthy();
            mailBtn.releaseButton.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected previously will be released.');
                });
            emailPopup.okButton.click();
        });
    browser.sleep(1500);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });

    browser.wait(EC.visibilityOf(mailBtn.removeButton), 15000)
        .then(function() {
            expect(mailBtn.removeButton.isPresent())
                .toBeTruthy();
            mailBtn.removeButton.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected will be removed.');
                });
            emailPopup.okButton.click();

        });
    browser.sleep(1500);
    browser.refresh();

    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    browser.wait(EC.visibilityOf(mailBtn.moreActButton), 5000)
        .then(function() {
            expect(mailBtn.moreActButton.isPresent())
                .toBeTruthy();
            mailBtn.moreActButton.click();
        });


    browser.wait(EC.visibilityOf(mailBtn.mabRelease), 5000)
        .then(function() {
            expect(mailBtn.mabRelease.isPresent())
                .toBeTruthy();
            mailBtn.mabRelease.click();
            expect(emailPopup.alertBody.getText())
                .toEqual('The email(s) that you have selected previously will be released.');
            emailPopup.okButton.click();
        });
    browser.sleep(1500);
    browser.refresh();

    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    mailBtn.moreActButton.click();

    browser.wait(EC.visibilityOf(mailBtn.mabRelAndTrain), 5000)
        .then(function() {
            expect(mailBtn.mabRelAndTrain.isPresent())
                .toBeTruthy();
            mailBtn.mabRelAndTrain.click();
            expect(emailPopup.alertBody.getText())
                .toEqual(msg);
            emailPopup.okButton.click();
        });
    browser.sleep(1500);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    mailBtn.moreActButton.click();

    browser.wait(EC.visibilityOf(mailBtn.mabRemove), 5000)
        .then(function() {
            expect(mailBtn.mabRemove.isPresent())
                .toBeTruthy();
            mailBtn.mabRemove.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected will be removed.');
                });
            emailPopup.okButton.click();

        });
    browser.sleep(1500);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000)
        .then(function() {
            mailBtn.selectButton.click();
        });
    mailBtn.moreActButton.click();

    browser.wait(EC.visibilityOf(mailBtn.mabPurgeQtn), 5000)
        .then(function() {
            expect(mailBtn.mabPurgeQtn.isPresent())
                .toBeTruthy();
            mailBtn.mabPurgeQtn.click();
            expect(emailPopup.alertBody.getText())
                .toEqual('You are going to empty your spam quarantine folder.');
            emailPopup.cancelButton.click();
        });
    browser.wait(EC.visibilityOf(mailBtn.mabUnselect), 5000)
        .then(function() {
            expect(mailBtn.mabUnselect.isPresent())
                .toBeTruthy();

        });
    browser.wait(EC.visibilityOf(mailBtn.category), 5000)
        .then(function() {
            expect(mailBtn.category.isPresent())
                .toBeTruthy();
        });
    browser.wait(EC.visibilityOf(mailBtn.mailDate), 5000)
        .then(function() {
            expect(mailBtn.mailDate.isPresent())
                .toBeTruthy();
        });
    browser.ignoreSynchronization = false;
    mailBtn.selectButton.click();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    browser.wait(EC.visibilityOf(checkMail.sentLabel), 5000)
        .then(function() {
            expect(checkMail.sentLabel.isPresent())
                .toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.fromLabel), 5000)
        .then(function() {
            expect(checkMail.fromLabel.isPresent())
                .toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.toLabel), 5000)
        .then(function() {
            expect(checkMail.toLabel.isPresent())
                .toBeTruthy();
        });
    browser.wait(EC.visibilityOf(checkMail.mailContent), 5000)
        .then(function() {
            expect(checkMail.mailContent.isPresent())
                .toBeTruthy();
            expect(checkMail.mailContent.getText())
                .toEqual(spamMessage);
        });
    browser.wait(EC.visibilityOf(checkMail.plainType), 5000)
        .then(function() {
            expect(checkMail.plainType.isPresent())
                .toBeTruthy();
            checkMail.plainType.click();
        });
    browser.wait(EC.visibilityOf(checkMail.normalType), 5000)
        .then(function() {
            expect(checkMail.normalType.isPresent())
                .toBeTruthy();
            checkMail.normalType.click();
        });
    browser.wait(EC.visibilityOf(checkMail.rawType), 5000)
        .then(function() {
            expect(checkMail.rawType.isPresent())
                .toBeTruthy();
            checkMail.rawType.click();
        });

    browser.wait(EC.visibilityOf(checkMail.moreActButton), 5000)
        .then(function() {
            expect(checkMail.moreActButton.isPresent())
                .toBeTruthy();
        });

    browser.wait(EC.visibilityOf(checkMail.releaseBtn), 5000)
        .then(function() {
            expect(checkMail.releaseBtn.isPresent())
                .toBeTruthy();
            checkMail.releaseBtn.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected previously will be released.');
                });
            emailPopup.okButton.click();

        });
    browser.sleep(3000);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    browser.wait(EC.visibilityOf(checkMail.removeBtn), 5000)
        .then(function() {
            expect(checkMail.removeBtn.isPresent())
                .toBeTruthy();
            checkMail.removeBtn.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected will be removed.');
                });
            emailPopup.okButton.click();
        });
    browser.sleep(3000);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    checkMail.moreActButton.click();

    browser.wait(EC.visibilityOf(checkMail.mabRelease), 5000)
        .then(function() {
            expect(checkMail.mabRelease.isPresent())
                .toBeTruthy();
            checkMail.mabRelease.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected previously will be released.');
                });
            emailPopup.okButton.click();

        });
    browser.sleep(3000);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    checkMail.moreActButton.click();
    browser.wait(EC.visibilityOf(checkMail.mabRelAndTrain), 5000)
        .then(function() {
            expect(checkMail.mabRelAndTrain.isPresent())
                .toBeTruthy();
            checkMail.mabRelAndTrain.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual(msg);
                });
            emailPopup.okButton.click();

        });
    browser.sleep(3000);
    browser.refresh();
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000)
        .then(function() {
            mailBtn.mailBody.click();
        });
    checkMail.moreActButton.click();
    browser.wait(EC.visibilityOf(checkMail.mabRemove), 5000)
        .then(function() {
            expect(checkMail.mabRemove.isPresent())
                .toBeTruthy();
            checkMail.mabRemove.click();
            browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000)
                .then(function() {
                    expect(emailPopup.alertBody.getText())
                        .toEqual('The email(s) that you have selected will be removed.');
                });
            emailPopup.okButton.click();

        });

    browser.actions()
        .click()
        .perform();
    browser.navigate()
        .back();
    browser.navigate()
        .back();
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


describe('Mobile app email page emailLevel', function() {

    var Obj = new LoginPage(); // initialize an object//
    var logged = new dashPage();
    var mailBtn = new imailButtons();
    var checkMail = new imailLayout();

    var EC = protractor.ExpectedConditions;

    var data = require(".././dependencies/dataForUserRestrictedLogin");
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 75000;
    spamMessage = "XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X";

    it('should check functionality and presence of the buttons', function() {
        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password
        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.reminder.click();
        Obj.logbutton.click();


        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent())
                    .toBeTruthy();

            });
        browser.wait(EC.visibilityOf(logged.bigIncoming), 5000)
            .then(function() {
                logged.bigIncoming.click();
            });
        //browser.ignoreSynchronization = true;
        checkLayout(mailBtn, checkMail);
    });
});