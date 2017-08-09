var LoginPage = require('.././dependencies/LoginPageObject.js');
var AlertPop_up = require('.././dependencies/AlertLogPageObject.js');

/**
 *  At the moment the app returns just 1 type of message when the fields are empty
 *  or inappropriate
 */
 
function field_cleaner(page) {
    page.hostname.clear();
    page.password.clear();
    page.user.clear();
}

function log_check_close(page, alert, message) {

    page.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 10000).then(function() {
        expect(alert.alertBody.getText()).toEqual(message);
        alert.alertButton.click(); //close the alert
    });

    //  Clear log in fields
    field_cleaner(page);
}

function test_error_messages(page, alert, msg) {

    //  Clear log in fields
    field_cleaner(page);

    //  Check error popup
    log_check_close(page, alert, msg);

    //  Click the log in button just with the hostname field, filled
    page.hostname.sendKeys('example.com');

    //  Check error popup
    log_check_close(page, alert, msg);

    //  Click the log in button just with the user field, filled
    page.user.sendKeys('adminTest');

    //  Check error popup
    log_check_close(page, alert, msg);

    //  Click the log in button just with the password field, filled
    page.password.sendKeys('qwertyuiop');

    //  Check error popup    
    log_check_close(page, alert, msg);

    //  Click the log in button just with the hostname and user field, filled
    page.hostname.sendKeys('example.com');
    page.user.sendKeys('adminTest');

    //  Check error popup
    log_check_close(page, alert, msg);

    //  Click the log in button just with the password and user field, filled
    page.password.sendKeys('12345678');
    page.user.sendKeys('adminTest');

    //  Check error popup
    log_check_close(page, alert, msg);

    //  Click the log in button just with the hostname and password field, filled
    page.hostname.sendKeys('example.com');
    page.password.sendKeys('12345678');

    //  Check error popup
    log_check_close(page, alert, msg);

}

/**
 *  The error message that is checked it's the one the application returns at the moment the test are written.
 *  If there will be an update the error message could be changed depending on the
 *  case it envolves.
 */

describe('Try log in with incomplete credentials', function() {

    var page = new LoginPage();
    var alert = new AlertPop_up();
    var msg = 'Please check your credentials!';

    it('should display sugestive error messages', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        test_error_messages(page, alert, msg);
    });
});