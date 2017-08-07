
var LoginPage=require('.././dependencies/LoginPageObject.js');
var dashPage=require('.././dependencies/DashPageObject.js');
var AlertPop_up=require('.././dependencies/AlertLogPageObject.js');

function log_check_close(Obj, alert) {

    Obj.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 20000)
        .then(function() {
            expect(alert.alertBody.getText()).toEqual('Oops! Something went wrong! Please try again later!');
            alert.alertButton.click(); //close the alert
        });
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
var data = require(".././dependencies/dataForUserRestrictedLogin");

//The error message that is checked it's the one the application returns at the moment the test are written. 
//If there will be an update the error message could be changed depending on the
//case it envolves.
//Here should be a feature allowing the soft to detect an inexisting user

describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    var alreadyLogged = new dashPage();
//    var dashA = new dashAlert();

    it('should keep the user logged if the button is checked and not logged otherwise', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password on the second element of the arrays.
        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);
        Obj.reminder.click();
        Obj.logbutton.click();
        var EC = protractor.ExpectedConditions;

        browser.wait(EC.visibilityOf(alreadyLogged.bigLoginCheck), 20000)
            .then(function() {
                expect(alreadyLogged.bigLoginCheck.isPresent()).toBeTruthy();

            });

        browser.refresh();
        browser.wait(EC.visibilityOf(alreadyLogged.bigLoginCheck), 20000)
            .then(function() {
                expect(alreadyLogged.bigLoginCheck.isPresent()).toBeTruthy();
            });
        alreadyLogged.leftButton.click();

        alreadyLogged.logoutButton.click();
        alreadyLogged.cancelButton.click();

        alreadyLogged.logoutButton.click();
        alreadyLogged.okButton.click();

        browser.wait(EC.visibilityOf(Obj.logbutton), 20000)
            .then(function() {
                field_cleaner(Obj);
            });
        Obj.reminder.click();
        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);

        Obj.logbutton.click();
        browser.wait(EC.visibilityOf(alreadyLogged.bigLoginCheck), 20000)
            .then(function() {
                expect(alreadyLogged.bigLoginCheck.isPresent()).toBeTruthy();
            });
        browser.refresh();
        field_cleaner(Obj);
        expect(alreadyLogged.bigLoginCheck.isPresent()).toBeFalsy();
    });
});
