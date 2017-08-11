var LoginPage = require('.././dependencies/LoginPageObject.js');
var iSearchPanel = require('.././dependencies/SearchPanelObject.js');
var CategoryPage = require('.././dependencies/CategoryPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');

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

describe('Verify Super Admin User Layout', function() {

    var page = new LoginPage();
    var logged = new dashPage();
    var search = new iSearchPanel();
    var category = new CategoryPage();

    var EC = protractor.ExpectedConditions;

    //  This test needs more time than default in order to run
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;


    it('should display sugestive error messages', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear login page fields
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
        formatedDate = (((dayNumber.concat(" ", month)).concat(" - ", dayNumber)).concat(" ", month)).concat(" ", year);

        //  Log in 
        addCredentials(page, data.superAdminH, data.superAdminU, data.superAdminP);
        page.logbutton.click();

        //  Check dashboard page

        //  Check title
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 10000).then(function() {
            expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Check main incoming button
        expect(logged.bigIncoming.isPresent()).toBeTruthy();

        //  Check main outgoing button
        expect(logged.bigOutgoing.isPresent()).toBeTruthy();

        //  Check dashboard left button
        expect(logged.leftButton.isPresent()).toBeTruthy();

        //  Enter dashboard left menu
        logged.leftButton.click();

        //  Check left menu
        browser.wait(EC.visibilityOf(logged.right_arrow), 10000).then(function() {
            expect(logged.right_arrow.isPresent()).toBeTruthy();
        });

        expect(logged.incoming.isPresent()).toBeTruthy();
        expect(logged.outgoing.isPresent()).toBeTruthy();
        expect(logged.logoutButton.isPresent()).toBeTruthy();

        //  Check incoming page layout

        //  Enter incoming page
        logged.incoming.click();
        browser.ignoreSynchronization = false;

        //  Check incoming page elements
        expect(category.iHeader.isPresent()).toBeTruthy();
        expect(category.itimeDate.isPresent()).toBeTruthy();
        expect(category.itimeDate.getText()).toEqual(formatedDate);

        browser.wait(EC.visibilityOf(category.iemptyContent), 10000).then(function() {
            expect(category.iemptyContent.isPresent()).toBeTruthy();
        });
        browser.wait(EC.visibilityOf(category.isearchButton), 10000).then(function() {
            expect(category.isearchButton.isPresent()).toBeTruthy();
        });

        //  Enter Search Menu fron Incoming page
        search.isearchButton.click();

        //  Check Search Menu
        expect(search.backButton.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.domainSearch.isPresent()).toBeTruthy();
        expect(search.senderSearch.isPresent()).toBeTruthy();
        expect(search.recipientSearch.isPresent()).toBeTruthy();
        expect(search.hourSearch.isPresent()).toBeTruthy();
        expect(search.weekSearch.isPresent()).toBeTruthy();
        expect(search.monthSearch.isPresent()).toBeTruthy();
        expect(search.clearSearch.isPresent()).toBeTruthy();
        expect(search.startSearch.isPresent()).toBeTruthy();
        expect(search.requirements.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();

        search.fromdate.click();

        //  Check calendar from From field
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000).then(function() {
            search.calendarXButton.click();
        });

        browser.wait(EC.elementToBeClickable(search.todate), 10000).then(function() {
            search.todate.click();
        });

        //  Check calendar from To field
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000).then(function() {
            search.calendarXButton.click();
        });

        //  Go back to dashboard
        browser.navigate().back();

        //  Check Outgoing Page Layout

        //  Enter Outgoing Page
        logged.leftButton.click();
        logged.outgoing.click();

        //  Check Outgoing Page elements
        expect(category.oHeader.isPresent()).toBeTruthy();
        expect(category.otimeDate.isPresent()).toBeTruthy();
        expect(category.otimeDate.getText()).toEqual(formatedDate);
        browser.wait(EC.visibilityOf(category.oemptyContent), 10000).then(function() {
            expect(category.oemptyContent.isPresent()).toBeTruthy();
        });
        browser.wait(EC.visibilityOf(category.osearchButton), 10000).then(function() {
            expect(category.osearchButton.isPresent()).toBeTruthy();
        });

        //  Enter Search Menu from Outgoing Page 
        search.osearchButton.click();

        //  Check Search Menu
        expect(search.backButton.isPresent()).toBeTruthy();
        expect(search.fromdate.isPresent()).toBeTruthy();
        expect(search.todate.isPresent()).toBeTruthy();
        expect(search.domainSearch.isPresent()).toBeTruthy();
        expect(search.senderSearch.isPresent()).toBeTruthy();
        expect(search.recipientSearch.isPresent()).toBeTruthy();
        expect(search.hourSearch.isPresent()).toBeTruthy();
        expect(search.weekSearch.isPresent()).toBeTruthy();
        expect(search.monthSearch.isPresent()).toBeTruthy();
        expect(search.clearSearch.isPresent()).toBeTruthy();
        expect(search.startSearch.isPresent()).toBeTruthy();
        expect(search.requirements.isPresent()).toBeTruthy();
        expect(search.backToResults.isPresent()).toBeTruthy();

        search.fromdate.click();

        //  Check calendar from From field 
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000).then(function() {
            search.calendarXButton.click();
        });

        browser.wait(EC.elementToBeClickable(search.todate), 10000).then(function() {
            search.todate.click();
        });

        //  Check calendar from From field
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 10000).then(function() {
            search.calendarXButton.click();
        });

        browser.refresh();
    });
});