var LoginPage = require('.././dependencies/LoginPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');
var imailButtons = require('.././dependencies/IncomingPageWithEmails.js');
var imailLayout = require('.././dependencies/InsideIncomingEmail.js');
var omailButtons = require('.././dependencies/OutgoingPageWithEmails.js');
var emailAlert = require('.././dependencies/EmailAlertObject.js');
var msg1 = "Choosing 'Release and Train', for one or several messages, might adversely affect the ";
var msg2 = "quality of filtering for all the existing users.Please avoid any mistakes in your selection!";
var Rel_msg = msg1.concat(msg2);
var msg3 = 'You have chosen to release the email and whitelist their senders.';
var msg4 = " Please note, spammers generally use fake 'from' addresses trying to match whitelisted senders so their spam emails bypass the checks.";
var White_msg = msg3.concat(msg4);
var msg5 = 'You have chosen to remove the email and blacklist the sender.';
var msg6 = 'Please note, emails from blacklisted senders are immediately discarded.';
var Black_msg = msg5.concat(msg6);

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
        emailPopup.okButton.click();
    });

    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
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
        emailPopup.okButton.click();
    });

    browser.sleep(1500);

    browser.refresh();

    //  Select an email
    browser.wait(EC.visibilityOf(mailBtn.selectButton), 5000).then(function() {
        mailBtn.selectButton.click();
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

    //  Try release an email
    browser.wait(EC.visibilityOf(mailBtn.mabRelease), 5000).then(function() {

        //  Check release button is present and click
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

    //  Try Release and Train an email
    browser.wait(EC.visibilityOf(mailBtn.mabRelAndTrain), 5000).then(function() {

        //  Check presence of Release and Train button and click
        expect(mailBtn.mabRelAndTrain.isPresent()).toBeTruthy();
        mailBtn.mabRelAndTrain.click();

        //  Check the pop-up message
        expect(emailPopup.alertBody.getText()).toEqual(Rel_msg);

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

        //  Check presence of remove button and click
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

    //  Try White and Release an email
    browser.wait(EC.visibilityOf(mailBtn.mabWhiteAndRelease), 5000).then(function() {

        //  Check presence of white and release button and click
        expect(mailBtn.mabWhiteAndRelease.isPresent()).toBeTruthy();
        mailBtn.mabWhiteAndRelease.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual(White_msg);
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

    //  Try Black and Release an email
    browser.wait(EC.visibilityOf(mailBtn.mabBlackAndRemove), 5000).then(function() {

        //  Check presence of black and remove button and click
        expect(mailBtn.mabBlackAndRemove.isPresent()).toBeTruthy();
        mailBtn.mabBlackAndRemove.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual(Black_msg);
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

    //  Try purge
    browser.wait(EC.visibilityOf(mailBtn.mabPurgeQtn), 5000).then(function() {

        //  Check presence of purge button and click
        expect(mailBtn.mabPurgeQtn.isPresent()).toBeTruthy();
        mailBtn.mabPurgeQtn.click();

        //  Check the pop-up message
        expect(emailPopup.alertBody.getText()).toEqual('You are going to empty your spam quarantine folder.');

        //  Close pop-up
        emailPopup.cancelButton.click();
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

    //  Try release an email
    browser.wait(EC.visibilityOf(checkMail.releaseBtn), 5000).then(function() {

        //  Check presence of release button and click
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

        //  Check presence of remove button and click
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

    //  Enter moreActions button
    checkMail.moreActButton.click();

    //  Try release an email
    browser.wait(EC.visibilityOf(checkMail.mabRelease), 5000).then(function() {

        //  Check presence of release button and click
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

    //  Try Release and Train an email
    browser.wait(EC.visibilityOf(checkMail.mabRelAndTrain), 5000).then(function() {

        //  Check presence of release and train button and click
        expect(checkMail.mabRelAndTrain.isPresent()).toBeTruthy();
        checkMail.mabRelAndTrain.click();

        //  Check the pop-up message        
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual(Rel_msg);
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

    //  Try White and Release an email
    browser.wait(EC.visibilityOf(checkMail.mabWhiteAndRelease), 5000).then(function() {

        //  Check presence of white and release button and click
        expect(checkMail.mabWhiteAndRelease.isPresent()).toBeTruthy();
        checkMail.mabWhiteAndRelease.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual(White_msg);
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

    //  Try BLack and Remove email
    browser.wait(EC.visibilityOf(checkMail.mabBlackAndRemove), 5000).then(function() {

        //  Check presence of black and remove button and click
        expect(checkMail.mabBlackAndRemove.isPresent()).toBeTruthy();
        checkMail.mabBlackAndRemove.click();

        //  Check the pop-up message
        browser.wait(EC.visibilityOf(emailPopup.alertBody), 5000).then(function() {
            expect(emailPopup.alertBody.getText()).toEqual(Black_msg);
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;

    it('should check functionality and presence of the buttons', function() {

        // Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear log in fields
        field_cleaner(Obj);

        //  For being able to login, the .json file must have valid user, and password
        addCredentials(Obj, data.domainH, data.domainU, data.domainP);

        //  Log in
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

        browser.navigate().back();
        browser.refresh();

        //  Log out
        browser.wait(EC.visibilityOf(logged.leftButton), 5000).then(function() {
            logged.leftButton.click();
            logged.logoutButton.click();
            logged.okButton.click();
        });
        Obj.reminder.click();
        browser.refresh();
    });
});