var LoginPage = require('./dependencies/LoginPageObject.js');
var SearchPanel = require('./dependencies/SearchPanelObject.js');
var dashPage = require('./dependencies/DashPageObject.js');
var CategoryPage = require('./dependencies/CategoryPageObject.js');

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
var data = require("./dependencies/dataForUserRestrictedLogin.json");

describe('Verify Email User Layout', function() {

    var Obj = new LoginPage(); // initialize an object//
    var logged = new dashPage();
    var search = new SearchPanel();
    var category=new CategoryPage();
    var EC = protractor.ExpectedConditions;


    it('should display sugestive error messages', function() {

        browser.get('http://localhost:8100/#/login');
        field_cleaner(Obj);

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var currentDate = new Date();
        var day = currentDate.getDate().toString();
        var month = months[currentDate.getMonth()];
        var year = currentDate.getFullYear().toString();

        var monthNumber = (currentDate.getMonth() + 1).toString();
        if (currentDate.getMonth() + 1 < 10)
            monthNumber = "0".concat("", monthNumber);
        var dayNumber = currentDate.getDate().toString();
        if (currentDate.getDate() < 10)
            dayNumber = "0".concat("", day);
        var hourNumber = currentDate.getHours().toString();
        if (currentDate.getHours() < 10)
            hourNumber = "0".concat("", hourNumber);

        var buildDate = (((dayNumber.concat(" ", month)).concat(" - ", dayNumber)).concat(" ", month)).concat(" ", year);

        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.logbutton.click();

        //Incoming Layout Check
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.bigIncoming), 5000)
            .then(function() {
                expect(logged.bigIncoming.isPresent()).toBeTruthy();
            });

        expect(logged.bigOutgoing.isPresent()).toBeFalsy();

        browser.wait(EC.visibilityOf(logged.leftButton), 5000)
            .then(function() {
                expect(logged.leftButton.isPresent()).toBeTruthy();
            });

        logged.leftButton.click();

        browser.wait(EC.visibilityOf(logged.right_arrow), 5000)
            .then(function() {
                expect(logged.right_arrow.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.incoming), 5000)
            .then(function() {
                expect(logged.incoming.isPresent()).toBeTruthy();
            });

        expect(logged.outgoing.isPresent()).toBeFalsy();

        browser.wait(EC.visibilityOf(logged.logoutButton), 5000)
            .then(function() {
                expect(logged.logoutButton.isPresent()).toBeTruthy();
            });

        logged.incoming.click();

        browser.ignoreSynchronization = false;

       
        expect(category.itimeDate.isPresent()).toBeTruthy();
        expect(category.itimeDate.getText()).toEqual(buildDate);

        browser.wait(EC.visibilityOf(search.isearchButton), 5000)
            .then(function() {
                expect(search.isearchButton.isPresent()).toBeTruthy();
                search.isearchButton.click();
            });

        expect(search.backButton.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.isenderSearch.isPresent()).toBeTruthy();
        expect(search.idomainSearch.isPresent()).toBeFalsy();
        expect(search.irecipientSearch.isPresent()).toBeFalsy();       
        expect(search.ihourSearch.isPresent()).toBeTruthy();
        expect(search.iweekSearch.isPresent()).toBeTruthy();
        expect(search.imonthSearch.isPresent()).toBeTruthy();
        expect(search.iclearSearch.isPresent()).toBeTruthy();
        expect(search.istartSearch.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();
        search.from.click();       
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 5000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.wait(EC.elementToBeClickable(search.todate), 5000)
            .then(function() {
                search.to.click();
            });

        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 5000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.refresh();
    });
});
