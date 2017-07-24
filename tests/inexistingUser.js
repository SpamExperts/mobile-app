var LoginPage = function() { //create an object with the 5 elements from the
    //log in page, extracting their position. Will be useful in the future.
    this.hostname = element(by.model('data.hostname'));
    this.user = element(by.model('data.username'));
    this.password = element(by.model('data.password'));
    this.reminder = element.all(by.model('data.remember')).get(0);
    this.logbutton = element(by.css('.button.button-block.button-dark.se-bold.disable-user-behavior'));
};
var data = require("./dataFor_iU_kL.json");
var AlertPop_up = function() {
    this.alertBody = element(by.css('.popup-body'));
    this.alertButton = element(by.css('button.ng-binding.button-positive'));
};

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
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);

}
describe('mobile app login page', function() {
    browser.ignoreSynchronization = true;
    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    it('should not be able to login with an inexisting user', function() {
        browser.get('http://localhost:8100/#/login');
        //The three fields should be provided with valid but deprecated data
        field_cleaner(Obj);
        addCredentials(Obj, data.domain[0], data.username[0], data.password[0]);
        log_check_close(Obj, alert);
       
    });
});