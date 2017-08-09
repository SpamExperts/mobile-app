var LoginPage = require('.././dependencies/LoginPageObject.js');
var iSearchPanel = require('.././dependencies/SearchPanelObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');
var dataDifference = require('.././dependencies/DataIntervalFunction.js');
var data = require(".././dependencies/dataForUserRestrictedLogin.json");

function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}

function addCredentials(Obj, host, user, pwd) {
    //  The three fields should be provided with valid data
    Obj.hostname.sendKeys(host);
    Obj.user.sendKeys(user);
    Obj.password.sendKeys(pwd);
}

describe('Mobile app search page', function() {

    var Obj = new LoginPage();
    var logged = new dashPage();
    var search = new iSearchPanel();
    var EC = protractor.ExpectedConditions;


    it('Should return correct datetime depending on the button', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear login fields
        field_cleaner(Obj);

        var outputDate;

        //  Log in
        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.logbutton.click();

        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000).then(function() {
            expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Enter Incoming Page
        logged.bigIncoming.click();
        search.isearchButton.click();

        //  Clik "Past 24h" button
        browser.wait(EC.visibilityOf(search.hourSearch), 5000).then(function() {
            search.hourSearch.click();
        });
        outputDate = dataDifference(1);

        //  Check changes 
        expect(search.from.getText()).toEqual(outputDate);

        //  Click "Past week" button
        search.weekSearch.click();
        outputDate = dataDifference(2);

        //  Check changes
        expect(search.from.getText()).toEqual(outputDate);

        //  Chick "Past month" button
        search.monthSearch.click();
        outputDate = dataDifference(3);

        //  Check changes
        expect(search.from.getText()).toEqual(outputDate);

        browser.refresh();

        field_cleaner(Obj);

        browser.refresh();
    });
});