var LoginPage = require('.././dependencies/LoginPageObject.js');
var iSearchPanel = require('.././dependencies/SearchPanelObject.js')
var dashPage = require('.././dependencies/DashPageObject.js');
var dataDifference = require('.././dependencies/DataIntervalFunction.js');
var data = require(".././dependencies/dataForUserRestrictedLogin.json");

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

describe('Mobile app search page', function() {

    var Obj = new LoginPage();
    var logged = new dashPage();
    var search = new iSearchPanel();
    var EC = protractor.ExpectedConditions;


    it('should return correct datetime depending on the button', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);

        var outputDate;
        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.logbutton.click();

        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
            });
        logged.bigIncoming.click();
        search.isearchButton.click();
        search.ihourSearch.click();
        outputDate = dataDifference(1);
        expect(search.from.getText()).toEqual(outputDate);
        search.iweekSearch.click();
        outputDate = dataDifference(2);
        expect(search.from.getText()).toEqual(outputDate);
        search.imonthSearch.click();
        outputDate = dataDifference(3);
        expect(search.from.getText()).toEqual(outputDate);
        browser.refresh();
        field_cleaner(Obj);
        browser.refresh();
    });
});