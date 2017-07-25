var LoginPage = function() { //create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.

    this.logo = element(by.xpath("//img[contains(@class,'se-icon')]"));
    this.hostname = element(by.xpath("//input[contains(@ng-model,'data.hostname')]"));
    this.user = element(by.xpath("//input[contains(@ng-model,'data.username')]"));
    this.password = element(by.xpath("//input[contains(@ng-model,'data.password')]"));
    this.reminder = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logbutton = element(by.xpath("//button[contains(@on-tap,'login(data)')]"));
};
var data = require("./dataFor_iU_kL.json");
var AlertPop_up = function() {

    this.alertBody = element(by.xpath("//div[contains(@class,'popup-body')]"));
    this.alertButton = element(by.xpath("//button[contains(@ng-click,'event)')]"));
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
  //  field_cleaner(Obj);
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);

}
describe('mobile app login page', function() {
    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    
    it('should not be able to login with an inexisting user', function() {
       //   browser.ignoreSynchronization = true;
        browser.get('http://localhost:8100/#/login');
        //The three fields should be provided with valid but deprecated data
        addCredentials(Obj, data.domain[0], data.username[0], data.password[0]);
        log_check_close(Obj, alert);
            
    });
});