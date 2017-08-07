var LoginPage = require('.././dependencies/LoginPageObject.js');
var iSearchPanel = require('.././dependencies/SearchPanelObject.js')
var CategoryPage = require('.././dependencies/CategoryPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');
var extract_data = require('.././dependencies/ExtractDataFunction.js');

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
var data = require(".././dependencies/dataForUserRestrictedLogin.json");

describe('Verify Super Admin User Layout', function() {

    var Obj = new LoginPage(); // initialize an object//
    var logged = new dashPage();
    var search = new iSearchPanel();
    var category = new CategoryPage();

    var EC = protractor.ExpectedConditions;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;


    it('should display sugestive error messages', function() {

        browser.get('http://localhost:8100/#/login');

        field_cleaner(Obj);

        var currentDate = Date();
        var formatedDate = new Array();
        extract_data(formatedDate, currentDate);
        formatedDate = formatedDate.join("");

        addCredentials(Obj, data.superAdminH, data.superAdminU, data.superAdminP);
        Obj.logbutton.click();

        //Firstpage's buttons 

        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 10000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.bigIncoming), 10000)
            .then(function() {
                expect(logged.bigIncoming.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.bigOutgoing), 10000)
            .then(function() {
                expect(logged.bigOutgoing.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.leftButton), 10000)
            .then(function() {
                expect(logged.leftButton.isPresent()).toBeTruthy();
            });
        logged.leftButton.click();

        browser.wait(EC.visibilityOf(logged.right_arrow), 10000)
            .then(function() {
                expect(logged.right_arrow.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.incoming), 10000)
            .then(function() {
                expect(logged.incoming.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.outgoing), 10000)
            .then(function() {
                expect(logged.outgoing.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.logoutButton), 10000)
            .then(function() {
                expect(logged.logoutButton.isPresent()).toBeTruthy();
            });

        //Incoming Layout Check

        logged.incoming.click();
        browser.ignoreSynchronization = false;

        expect(category.iHeader.isPresent()).toBeTruthy();
        expect(category.itimeDate.isPresent()).toBeTruthy();
        expect(category.itimeDate.getText()).toEqual(formatedDate);

        browser.wait(EC.visibilityOf(category.iemptyContent), 10000)
            .then(function() {
                expect(category.iemptyContent.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(category.isearchButton), 10000)
            .then(function() {
                expect(category.isearchButton.isPresent()).toBeTruthy();
            });

        search.isearchButton.click();
        expect(search.backButton.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.idomainSearch.isPresent()).toBeTruthy();
        expect(search.isenderSearch.isPresent()).toBeTruthy();
        expect(search.irecipientSearch.isPresent()).toBeTruthy();
        expect(search.ihourSearch.isPresent()).toBeTruthy();
        expect(search.iweekSearch.isPresent()).toBeTruthy();
        expect(search.imonthSearch.isPresent()).toBeTruthy();
        expect(search.iclearSearch.isPresent()).toBeTruthy();
        expect(search.istartSearch.isPresent()).toBeTruthy();
        expect(search.requirements.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();
        search.fromdate.click();
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.wait(EC.elementToBeClickable(search.todate), 10000)
            .then(function() {
                search.todate.click();
            });
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.navigate().back();

        //Outgoing Layout Check

        logged.leftButton.click();
        logged.outgoing.click();

        expect(category.oHeader.isPresent()).toBeTruthy();
        expect(category.otimeDate.isPresent()).toBeTruthy();
        expect(category.otimeDate.getText()).toEqual(formatedDate);
        browser.wait(EC.visibilityOf(category.oemptyContent), 10000)
            .then(function() {
                expect(category.oemptyContent.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(category.osearchButton), 10000)
            .then(function() {
                expect(category.osearchButton.isPresent()).toBeTruthy();
            });

        search.osearchButton.click();
        expect(search.backButton.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.idomainSearch.isPresent()).toBeTruthy();
        expect(search.isenderSearch.isPresent()).toBeTruthy();
        expect(search.irecipientSearch.isPresent()).toBeTruthy();
        expect(search.ihourSearch.isPresent()).toBeTruthy();
        expect(search.iweekSearch.isPresent()).toBeTruthy();
        expect(search.imonthSearch.isPresent()).toBeTruthy();
        expect(search.iclearSearch.isPresent()).toBeTruthy();
        expect(search.istartSearch.isPresent()).toBeTruthy();
        expect(search.requirements.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();
        search.fromdate.click();
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.wait(EC.elementToBeClickable(search.todate), 10000)
            .then(function() {
                search.todate.click();
            });
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000)
            .then(function() {
                search.calendarXButton.click();
            });

        browser.refresh();
    });
});