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

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
    });

    //  Try release an email
    browser.wait(EC.visibilityOf(mailBtn.releaseButton), 5000).then(function() {

        //  Check release button is present and click
        expect(mailBtn.releaseButton.isPresent()).toBeTruthy();
        mailBtn.releaseButton.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected previously will be released.');
        });

        //  Close pop-up
        emailPopup.okButton.click();

    });

    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
    });

    //  Try remove an email
    browser.wait(EC.visibilityOf(mailBtn.removeButton), 15000).then(function() {

        //  Check remove button and click
        expect(mailBtn.removeButton.isPresent()).toBeTruthy();
        mailBtn.removeButton.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected will be removed.');
        });

        //  Close pop-up
        emailPopup.okButton.click();
    });


    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
    });

    //  Check visibility of more Actions button and click
    browser.wait(EC.visibilityOf(mailBtn.moreActButton), 5000).then(function() {
        expect(mailBtn.moreActButton.isPresent()).toBeTruthy();
        mailBtn.moreActButton.click();
    });

    //  Try release an email
    browser.wait(EC.visibilityOf(mailBtn.mabRelease), 5000).then(function() {

        //  Check release button and click
        expect(mailBtn.mabRelease.isPresent()).toBeTruthy();
        mailBtn.mabRelease.click();

        //  Check the pop-up message
        expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected previously will be released.');

        //  Close pop-up
        emailPopup.okButton.click();

    });

    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
    });

    //  Enter moreActions menu
    mailBtn.moreActButton.click();

    //  Try release and train an email
    browser.wait(EC.visibilityOf(mailBtn.mabRelAndTrain), 5000).then(function() {

        //  Check release and train button and click
        expect(mailBtn.mabRelAndTrain.isPresent()).toBeTruthy();
        mailBtn.mabRelAndTrain.click();

        //  Check the pop-up message
        expect(emailPopup.alertBody.getText()).toEqual(msg);

        //  Close pop-up
        emailPopup.okButton.click();
    });

    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
    });

    //  Enter moreActions menu
    mailBtn.moreActButton.click();

    //  Try remove an email
    browser.wait(EC.visibilityOf(mailBtn.mabRemove), 5000).then(function() {

        //  Check remove button and click
        expect(mailBtn.mabRemove.isPresent()).toBeTruthy();
        mailBtn.mabRemove.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected will be removed.');
        });

        //  Close pop-up
        emailPopup.okButton.click();

    });

    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
    });

    //  Enter moreActions menu
    mailBtn.moreActButton.click();

    //  Try purge button
    browser.wait(EC.visibilityOf(mailBtn.mabPurgeQtn), 5000).then(function() {

        //  Check purge button and click
        expect(mailBtn.mabPurgeQtn.isPresent()).toBeTruthy();
        mailBtn.mabPurgeQtn.click();

        //  Check the pop-up message
        expect(emailPopup.alertBody.getText()).toEqual('You are going to empty your spam quarantine folder.');

        //  Close pop-up
        emailPopup.cancelButton.click();
    });

    //  Check countSelectedMessage/Unselect button
    browser.wait(EC.visibilityOf(mailBtn.mabUnselect), 5000).then(function() {
        expect(mailBtn.mabUnselect.isPresent()).toBeTruthy();
    });

    //  Check category label
    browser.wait(EC.visibilityOf(mailBtn.category), 5000).then(function() {
        expect(mailBtn.category.isPresent()).toBeTruthy();
    });

    //  Check presence of mail time date
    browser.wait(EC.visibilityOf(mailBtn.mailDate), 5000).then(function() {
        expect(mailBtn.mailDate.isPresent()).toBeTruthy();
    });

    browser.ignoreSynchronization = false;

    //  Select an email
    mailBtn.selectButton.click();

    //  Enter mail content page
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000).then(function() {
        mailBtn.mailBody.click();
    });

    //  Check sent time date tag
    browser.wait(EC.visibilityOf(checkMail.sentLabel), 5000).then(function() {
        expect(checkMail.sentLabel.isPresent()).toBeTruthy();
    });

    //  Check from tag
    browser.wait(EC.visibilityOf(checkMail.fromLabel), 5000).then(function() {
        expect(checkMail.fromLabel.isPresent()).toBeTruthy();
    });

    //  Check to tag
    browser.wait(EC.visibilityOf(checkMail.toLabel), 5000).then(function() {
        expect(checkMail.toLabel.isPresent()).toBeTruthy();
    });

    //  Check mail content
    browser.wait(EC.visibilityOf(checkMail.mailContent), 5000).then(function() {
        expect(checkMail.mailContent.isPresent()).toBeTruthy();
        expect(checkMail.mailContent.getText()).toEqual(spamMessage);
    });

    //  Check plain button
    browser.wait(EC.visibilityOf(checkMail.plainType), 5000).then(function() {
        expect(checkMail.plainType.isPresent()).toBeTruthy();
        checkMail.plainType.click();
    });

    //  Check normal button
    browser.wait(EC.visibilityOf(checkMail.normalType), 5000).then(function() {
        expect(checkMail.normalType.isPresent()).toBeTruthy();
        checkMail.normalType.click();
    });

    //  Check raw type
    browser.wait(EC.visibilityOf(checkMail.rawType), 5000).then(function() {
        expect(checkMail.rawType.isPresent()).toBeTruthy();
        checkMail.rawType.click();
    });

    //  Check moreActions button
    browser.wait(EC.visibilityOf(checkMail.moreActButton), 5000).then(function() {
        expect(checkMail.moreActButton.isPresent()).toBeTruthy();
    });

    //  Try release an email
    browser.wait(EC.visibilityOf(checkMail.releaseBtn), 5000).then(function() {

        //  Check release button is present and click
        expect(checkMail.releaseBtn.isPresent()).toBeTruthy();
        checkMail.releaseBtn.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected previously will be released.');
        });

        //  Close pop-up
        emailPopup.okButton.click();

    });

    browser.sleep(3000);

    browser.refresh();

    //  Enter mail content page
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000).then(function() {
        mailBtn.mailBody.click();
    });

    //  Try remove an email
    browser.wait(EC.visibilityOf(checkMail.removeBtn), 5000).then(function() {

        //  Check remove button and click
        expect(checkMail.removeBtn.isPresent()).toBeTruthy();
        checkMail.removeBtn.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected will be removed.');
        });

        //  Close pop-up
        emailPopup.okButton.click();
    });

    browser.sleep(3000);

    browser.refresh();

    //  Enter mail content page
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000).then(function() {
        mailBtn.mailBody.click();
    });

    //  Enter moreActions menu
    checkMail.moreActButton.click();


    browser.wait(EC.visibilityOf(checkMail.mabRelease), 5000).then(function() {

        //  Try release an email
        expect(checkMail.mabRelease.isPresent()).toBeTruthy();
        checkMail.mabRelease.click();

        //  Check the pop-up message       
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected previously will be released.');
        });

        //  Close pop-up
        emailPopup.okButton.click();
    });

    browser.sleep(3000);

    browser.refresh();

    //  Enter mail content page
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000).then(function() {
        mailBtn.mailBody.click();
    });

    //  Enter moreActions menu
    checkMail.moreActButton.click();

    //  Try release and train an email
    browser.wait(EC.visibilityOf(checkMail.mabRelAndTrain), 5000).then(function() {

        //  Check release and train button is present and click
        expect(checkMail.mabRelAndTrain.isPresent()).toBeTruthy();
        checkMail.mabRelAndTrain.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual(msg);
        });

        //  Close pop-up
        emailPopup.okButton.click();
    });

    browser.sleep(3000);

    browser.refresh();

    //  Enter mail content page
    browser.wait(EC.visibilityOf(mailBtn.mailBody), 5000).then(function() {
        mailBtn.mailBody.click();
    });

    //  Enter moreActions menu
    checkMail.moreActButton.click();

    //  Try remove an email
    browser.wait(EC.visibilityOf(checkMail.mabRemove), 5000).then(function() {

        //  Check remove button and click
        expect(checkMail.mabRemove.isPresent()).toBeTruthy();
        checkMail.mabRemove.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected will be removed.');
        });

        //  Close pop-up
        emailPopup.okButton.click();
    });

    //  Close moreActions menu
    browser.actions().click().perform();

    //  Go back to dashboard
    browser.navigate().back();
    browser.navigate().back();
}


function addCredentials(Obj, host, user, pwd) {

    //  The three fields should be provided with valid data
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

    var Obj = new LoginPage();
    var logged = new dashPage();
    var mailBtn = new imailButtons();
    var checkMail = new imailLayout();

    var EC = protractor.ExpectedConditions;

    //  Load user data
    var data = require(".././dependencies/dataForUserRestrictedLogin");
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 75000;
    spamMessage = "XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X";

    it('should check functionality and presence of the buttons', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear login fields
        field_cleaner(Obj);

        //  For being able to login, the .json file must have valid user, and password
        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.reminder.click();
        Obj.logbutton.click();

        //  Check dashboard is visible
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000).then(function() {
            expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Enter Incoming page 
        browser.wait(EC.visibilityOf(logged.bigIncoming), 5000).then(function() {
            logged.bigIncoming.click();
        });

        //  Check layout for Incoming Mail page
        checkLayout(mailBtn, checkMail);

        //  Log out
        browser.wait(EC.visibilityOf(logged.leftButton), 5000).then(function() {
            logged.leftButton.click();
            logged.logoutButton.click();
            logged.okButton.click();
        });

        Obj.reminder.click();
    });
});