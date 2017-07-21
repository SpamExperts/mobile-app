var LoginPage = function() { //create an object witrrasdh the 5 elements from the 
    //log in page, extracting their position. Will be useful in the future.
    this.logo = element(by.css('.se-icon'));
    this.hostname = element(by.model('data.hostname'));
    this.user = element(by.xpath('/html/body/ion-nav-view/ion-view/ion-content/div[1]/div/div/ion-list/div/ion-item[2]/input'));
    this.password = element(by.model('data.password'));
    this.reminder = element.all(by.model('data.remember')).get(0);
    this.logbutton = element(by.css('.button.button-block.button-dark.se-bold.disable-user-behavior'));
};
var dashPage = function() {
    this.leftButton = element(by.css('.button.button-icon.icon.ion-navicon'));
    this.logoutButton = element(by.css('button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior'));
    this.loginCheck = element(by.css('.dashboard'));
};
var dashAlert = function() {
    this.alertButtonOk = element(by.css('.button.ng-binding.button-positive'));
};
var AlertPop_up = function() {

    this.alertBody = element(by.css('.popup-body'));
    this.alertButton = element(by.css('.button.ng-binding.button-positive'));
};

function log_check_close(Obj, alert) {

    Obj.logbutton.click();
    expect(alert.alertBody.getText()).toEqual('Oops! Something went wrong! Please try again later!');
    alert.alertButton.click(); //close the alert
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
var data = require("./dataFor_iU_kL.json");

//The error message that is checked it's the one the application returns at the moment the test are written. 
//If there will be an update the error message could be changed depending on the
//case it envolves.
//Here should be a feature allowing the soft to detect an inexisting user

describe('mobile app login page', function() {


    var Obj = new LoginPage(); // initialize an object//
    var alert = new AlertPop_up(); //initialize the Popup//
    var alreadyLogged = new dashPage();
    var dashA = new dashAlert();

    it('should keep the user logged if the button is checked and not logged otherwise', function() {

        browser.get('http://localhost:8101/#/login');
        field_cleaner(Obj);
        //for being able to login, the .json file must have valid user, and password on the second element of the arrays.
        addCredentials(Obj, data.domain[1], data.username[1], data.password[1]);
        Obj.reminder.click();
        Obj.logbutton.click();
        browser.sleep(600);
        expect(alreadyLogged.loginCheck.isPresent()).toBeTruthy();

        browser.refresh();
        browser.sleep(600);
        expect(alreadyLogged.loginCheck.isPresent()).toBeTruthy();

        alreadyLogged.leftButton.click();

        alreadyLogged.logoutButton.click();
        dashA.alertButtonOk.click();
        browser.sleep(600);
        field_cleaner(Obj);
        Obj.reminder.click();
        addCredentials(Obj, data.domain[1], data.username[1], data.password[1]);

        Obj.logbutton.click();
        browser.sleep(600);
        expect(alreadyLogged.loginCheck.isPresent()).toBeTruthy();
        browser.refresh();
        field_cleaner(Obj);
        expect(alreadyLogged.loginCheck.isPresent()).toBeFalsy();

    });
});