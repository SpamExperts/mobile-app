var LoginPage = require('.././dependencies/LoginPageObject.js');
var AlertPop_up = require('.././dependencies/AlertLogPageObject.js');

function log_check_close(page, alert) {

    page.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 10000).then(function() {
        expect(alert.alertBody.getText()).toEqual('A record with the supplied identity could not be found.');
        alert.alertButton.click();
    });

}

function field_cleaner(page) {

    page.hostname.clear();
    page.password.clear();
    page.user.clear();
}

function addCredentials(page, host, user, pwd) {

    //  The three fields should be provided with valid data
    field_cleaner(page);

    //  Log in
    page.hostname.sendKeys(host);
    page.user.sendKeys(user);
    page.password.sendKeys(pwd);

}
describe('Auth with valid hostname but invalid username & password', function() {

    var page = new LoginPage();
    var alert = new AlertPop_up();

    //  Load user data
    var data = require('.././dependencies/dataForUserRestrictedLogin.json');

    it('should not be able to login with an inexisting user', function() {

        //  Open App
        browser.get('http://localhost:8100/#/login');

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(page.hostname), 10000).then(function() {
            addCredentials(page, data.domainH, data.domainH, data.domainH);
            browser.ignoreSynchronization = true;
            log_check_close(page, alert);
        });

        //  Clear log in fields
        field_cleaner(page);
        browser.refresh();
    });
});