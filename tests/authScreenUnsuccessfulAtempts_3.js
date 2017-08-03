var LoginPage=require('./dependencies/LoginPageObject.js');     
var data = require("./dependencies/dataForUserRestrictedLogin.json");
var AlertPop_up=require('./dependencies/AlertLogPageObject.js');

function log_check_close(Obj, alert) {
    Obj.logbutton.click();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(alert.alertButton), 20000)
        .then(function() {
            expect(alert.alertBody.getText()).toEqual('A record with the supplied identity could not be found.');
            alert.alertButton.click(); //close the alert
        });

}

function field_cleaner(Obj) {

    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}

function addCredentials(Obj, host, user, pwd) {
    //The three fields should be provided with valid data
    field_cleaner(Obj);
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);

}
describe('mobile app login page', function() {
    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//

    it('should not be able to login with an inexisting user', function() {

        browser.get('http://localhost:8100/#/login');

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(Obj.hostname), 20000)
            .then(function() {
                addCredentials(Obj, data.domainH, data.domainH, data.domainH);
                browser.ignoreSynchronization = true;
                log_check_close(Obj, alert);
            });
            field_cleaner(Obj);
            browser.refresh();
    });
});
