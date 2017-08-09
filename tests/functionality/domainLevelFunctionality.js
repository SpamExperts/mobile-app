var LoginPage = require('.././dependencies/LoginPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');
var imailButtons = require('.././dependencies/IncomingPageWithEmails.js');
var imailLayout = require('.././dependencies/InsideIncomingEmail.js');
var omailButtons = require('.././dependencies/OutgoingPageWithEmails.js');
var emailAlert = require('.././dependencies/EmailAlertObject.js');

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
            expect(emailPopup.alertBody.getText()).toEqual("The email(s) that you have selected previously will be released.");
        });

        //  Close pop-up
        emailPopup.cancelButton.click();
    });

    //  Try remove an email
    browser.wait(EC.visibilityOf(mailBtn.removeButton), 5000).then(function() {

        //  Check remove button and click
        expect(mailBtn.removeButton.isPresent()).toBeTruthy();
        mailBtn.removeButton.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual('The email(s) that you have selected will be removed.');
        });

        //  Close pop-up
        emailPopup.cancelButton.click();
    });

    //  Check visibility of more Actions button
    browser.wait(EC.visibilityOf(mailBtn.moreActButton), 5000).then(function() {
        expect(mailBtn.moreActButton.isPresent()).toBeTruthy();
    });

    //  Check countSelectedMessage/Unselect button
    browser.wait(EC.visibilityOf(mailBtn.mabUnselect), 5000).then(function() {
        expect(mailBtn.mabUnselect.isPresent()).toBeTruthy();
    });

    //  Enter moreActions menu
    mailBtn.moreActButton.click();

    //  Check presence of release button
    browser.wait(EC.visibilityOf(mailBtn.mabRelease), 5000).then(function() {
        expect(mailBtn.mabRelease.isPresent()).toBeTruthy();
    });

    //  Check presence of Release and Train button
    browser.wait(EC.visibilityOf(mailBtn.mabRelAndTrain), 5000).then(function() {
        expect(mailBtn.mabRelAndTrain.isPresent()).toBeTruthy();
    });

    //  Check presence of remove button
    browser.wait(EC.visibilityOf(mailBtn.mabRemove), 5000).then(function() {
        expect(mailBtn.mabRemove.isPresent()).toBeTruthy();
    });

    //  Check presence of White and Release button
    browser.wait(EC.visibilityOf(mailBtn.mabWhiteAndRelease), 5000).then(function() {
        expect(mailBtn.mabWhiteAndRelease.isPresent()).toBeTruthy();
    });

    //  Check presence of Black and Release button
    browser.wait(EC.visibilityOf(mailBtn.mabBlackAndRemove), 5000).then(function() {
        expect(mailBtn.mabBlackAndRemove.isPresent()).toBeTruthy();
    });

    //  Check presence of purge button
    browser.wait(EC.visibilityOf(mailBtn.mabPurgeQtn), 5000).then(function() {
        expect(mailBtn.mabPurgeQtn.isPresent()).toBeTruthy();
    });

    //  Close moreActions menu
    browser.actions().click().perform();

    //  Check category label
    browser.wait(EC.visibilityOf(mailBtn.category), 5000).then(function() {
        expect(mailBtn.category.isPresent()).toBeTruthy();
    });

    //  check presence of mail time date 
    browser.wait(EC.visibilityOf(mailBtn.mailDate), 5000).then(function() {
        expect(mailBtn.mailDate.isPresent()).toBeTruthy();
    });

    browser.ignoreSynchronization = false;

    //  Unselect email
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

    //  Check plain button
    browser.wait(EC.visibilityOf(checkMail.plainType), 5000).then(function() {
        expect(checkMail.plainType.isPresent()).toBeTruthy();
    });

    //  Check normal button
    browser.wait(EC.visibilityOf(checkMail.normalType), 5000).then(function() {
        expect(checkMail.normalType.isPresent()).toBeTruthy();
    });

    //  Check raw type
    browser.wait(EC.visibilityOf(checkMail.rawType), 5000).then(function() {
        expect(checkMail.rawType.isPresent()).toBeTruthy();
    });

    //  Check mail content
    browser.wait(EC.visibilityOf(checkMail.mailContent), 5000).then(function() {
        expect(checkMail.mailContent.isPresent()).toBeTruthy();
        expect(checkMail.mailContent.getText()).toEqual(spamMessage);
    });

    //  Check moreActions button
    browser.wait(EC.visibilityOf(checkMail.moreActButton), 5000).then(function() {
        expect(checkMail.moreActButton.isPresent()).toBeTruthy();
    });

    //  Check release button
    browser.wait(EC.visibilityOf(checkMail.releaseBtn), 5000).then(function() {
        expect(checkMail.releaseBtn.isPresent()).toBeTruthy();
    });

    //  Check remove button
    browser.wait(EC.visibilityOf(checkMail.removeBtn), 5000).then(function() {
        expect(checkMail.removeBtn.isPresent()).toBeTruthy();
    });

    //  Enter moreActions button
    checkMail.moreActButton.click();

    //  Check release button
    browser.wait(EC.visibilityOf(checkMail.mabRelease), 5000).then(function() {
        expect(checkMail.mabRelease.isPresent()).toBeTruthy();
    });

    //  Check Release and Train button
    browser.wait(EC.visibilityOf(checkMail.mabRelAndTrain), 5000).then(function() {
        expect(checkMail.mabRelAndTrain.isPresent()).toBeTruthy();
    });

    //  Check White and Release button 
    browser.wait(EC.visibilityOf(checkMail.mabWhiteAndRelease), 5000).then(function() {
        expect(checkMail.mabWhiteAndRelease.isPresent()).toBeTruthy();
    });

    //  Check BLack and Remove button
    browser.wait(EC.visibilityOf(checkMail.mabBlackAndRemove), 5000).then(function() {
        expect(checkMail.mabBlackAndRemove.isPresent()).toBeTruthy();
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

describe('Mobile app email page domainLevel', function() {

    // Initialize an object
    var Obj = new LoginPage();

    //  Initialize the Popup
    var logged = new dashPage();

    var mailBtn = new imailButtons();
    var checkMail = new imailLayout();
    var omailBtn = new omailButtons();
    var EC = protractor.ExpectedConditions;

    //  Load user data
    var data = require(".././dependencies/dataForUserRestrictedLogin");

    spamMessage = "XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X";

    it('should check functionality and presence of the buttons', function() {

        // Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear log in fields
        field_cleaner(Obj);


        //  For being able to login, the .json file must have valid user, and password
        addCredentials(Obj, data.domainH, data.domainU, data.domainP);

        //  Log in
        Obj.logbutton.click();

        //  Check dashboard is visible
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000).then(function() {
            expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Enter Incoming page 
        browser.wait(EC.visibilityOf(logged.bigIncoming), 5000).then(function() {
            logged.bigIncoming.click();
        });

        browser.ignoreSynchronization = true;

        //  Check layout for Incoming Mail page
        checkLayout(mailBtn, checkMail);

        //  Check dashboard is visible
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000).then(function() {
            expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Enter Outgoing page
        browser.wait(EC.visibilityOf(logged.bigOutgoing), 5000).then(function() {
            logged.bigOutgoing.click();
        });

        //  Check mailBody is visible but not clickable
        browser.wait(EC.visibilityOf(omailBtn.mailBody), 5000).then(function() {
            omailBtn.mailBody.click();
        });

        browser.refresh();

    });

});