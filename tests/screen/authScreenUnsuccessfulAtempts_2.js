var LoginPage = require('.././dependencies/LoginPageObject.js');
var AlertPop_up = require('.././dependencies/AlertLogPageObject.js');

//At the moment the app returns just 1 type of message when the fields are empty
//or inappropriate
function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}

function test_error_messages(Obj, alert, msg) {
    field_cleaner(Obj);
    log_check_close(Obj, alert, msg);
    //click the log in button just with the hostname field, filled
    Obj.hostname.sendKeys('example.com');
    log_check_close(Obj, alert, msg);
    //click the log in button just with the user field, filled
    Obj.user.sendKeys('adminTest');
    log_check_close(Obj, alert, msg);
    //click the log in button just with the password field, filled
    Obj.password.sendKeys('qwertyuiop');

    log_check_close(Obj, alert, msg);

    field_cleaner(Obj);

    //click the log in button just with the hostname and user field, filled
    Obj.hostname.sendKeys('example.com');
    Obj.user.sendKeys('adminTest');
    log_check_close(Obj, alert, msg);


    field_cleaner(Obj);

    //click the log in button just with the password and user field, filled
    Obj.password.sendKeys('12345678');
    Obj.user.sendKeys('adminTest');
    log_check_close(Obj, alert, msg);


    field_cleaner(Obj);

    //click the log in button just with the hostname and password field, filled
    Obj.hostname.sendKeys('example.com');
    Obj.password.sendKeys('12345678');

    log_check_close(Obj, alert, msg);

    field_cleaner(Obj);
}

function log_check_close(Obj, alert, message) {

    Obj.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 20000)
        .then(function() {
            expect(alert.alertBody.getText()).toEqual(message);
            alert.alertButton.click(); //close the alert
        });
    field_cleaner(Obj);
}

//clear all the fields for assuring a clean and appropriate test


//The error message that is checked it's the one the application returns at the moment the test are written.
//If there will be an update the error message could be changed depending on the
//case it envolves.

describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    var msg = 'Please check your credentials!';
    it('should display sugestive error messages', function() {
        browser.get('http://localhost:8100/#/login');

        test_error_messages(Obj, alert, msg);
    });
});