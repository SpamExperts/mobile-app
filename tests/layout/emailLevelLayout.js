var LoginPage = require('.././dependencies/LoginPageObject.js');
var SearchPanel = require('.././dependencies/SearchPanelObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');
var CategoryPage = require('.././dependencies/CategoryPageObject.js');

function field_cleaner(page) {
    page.hostname.clear();
    page.password.clear();
    page.user.clear();
}

function addCredentials(page, host, user, pwd) {
    //  The three fields should be provided with valid data
    page.hostname.sendKeys(host);
    page.user.sendKeys(user);
    page.password.sendKeys(pwd);
}

//  Load user data
var data = require(".././dependencies/dataForUserRestrictedLogin.json");

describe('Verify Email User Layout', function() {

    var page = new LoginPage();
    var logged = new dashPage();
    var search = new SearchPanel();
    var category = new CategoryPage();
    var EC = protractor.ExpectedConditions;

    it('should display sugestive error messages', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear fields
        field_cleaner(page);

        //  Set variables to build time date
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

        //  Build string time date
        var buildDate = (((dayNumber.concat(" ", month)).concat(" - ", dayNumber)).concat(" ", month)).concat(" ", year);

        //  Log in
        addCredentials(page, data.emailH, data.emailU, data.emailP);
        page.logbutton.click();

        //  Check incoming page layout

        //  Check main title
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 5000).then(function() {
            expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Check main incoming button
        browser.wait(EC.visibilityOf(logged.bigIncoming), 5000).then(function() {
            expect(logged.bigIncoming.isPresent()).toBeTruthy();
        });

        //  Check main outgoing button is not present
        expect(logged.bigOutgoing.isPresent()).toBeFalsy();

        //  Check dashboard left button
        browser.wait(EC.visibilityOf(logged.leftButton), 5000).then(function() {
            expect(logged.leftButton.isPresent()).toBeTruthy();
        });

        logged.leftButton.click();

        //  Check left dashboard page
        browser.wait(EC.visibilityOf(logged.right_arrow), 5000).then(function() {
            expect(logged.right_arrow.isPresent()).toBeTruthy();
        });
        expect(logged.incoming.isPresent()).toBeTruthy();
        expect(logged.outgoing.isPresent()).toBeFalsy();
        expect(logged.logoutButton.isPresent()).toBeTruthy();

        //  Enter Incoming menu page
        logged.incoming.click();

        browser.ignoreSynchronization = false;

        //  Check time date
        expect(category.itimeDate.isPresent()).toBeTruthy();
        expect(category.itimeDate.getText()).toEqual(buildDate);

        browser.wait(EC.visibilityOf(search.isearchButton), 5000).then(function() {
            expect(search.isearchButton.isPresent()).toBeTruthy();
            search.isearchButton.click();
        });

        //  Check Search Menu panel
        expect(search.backButton.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.senderSearch.isPresent()).toBeTruthy();
        expect(search.domainSearch.isPresent()).toBeFalsy();
        expect(search.recipientSearch.isPresent()).toBeFalsy();
        expect(search.hourSearch.isPresent()).toBeTruthy();
        expect(search.weekSearch.isPresent()).toBeTruthy();
        expect(search.monthSearch.isPresent()).toBeTruthy();
        expect(search.clearSearch.isPresent()).toBeTruthy();
        expect(search.startSearch.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();

        search.from.click();

        //  Check calendar from From field
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 5000).then(function() {
            search.calendarXButton.click();
        });

        browser.wait(EC.elementToBeClickable(search.todate), 5000).then(function() {
            search.to.click();
        });

        //  Check calendar from Ton field
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 5000).then(function() {
            search.calendarXButton.click();
        });

        browser.refresh();
    });
});