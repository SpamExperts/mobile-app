var LoginPage = require('.././dependencies/LoginPageObject.js');
var SearchPanel = require('.././dependencies/SearchPanelObject.js');
var CategoryPanel = require('.././dependencies/CategoryPageObject.js');
var Dashboard = require('.././dependencies/DashPageObject');

function field_cleaner(test) {
    test.hostname.clear();
    test.user.clear();
    test.password.clear();
}

function checkSearchMenu() {

    expect(search.backToResults.getText()).toEqual("Back to results");
    expect(search.searchTitle.getText()).toEqual("Search messages");
    expect(search.isenderSearch.isPresent()).toBe(true);
    expect(search.irecipientSearch.isPresent()).toBe(true);
    expect(search.dateTitle.isPresent()).toBe(true);
    expect(search.ihourSearch.getText()).toEqual("Past 24H");
    expect(search.iweekSearch.getText()).toEqual("Past Week");
    expect(search.imonthSearch.getText()).toEqual("Past Month");
    expect(search.customTitle.getText()).toEqual("Custom timeframe");
    expect(search.fromdate.getText()).toEqual("From date");
    expect(search.todate.getText()).toEqual("To date");
    expect(search.istartSearch.isPresent()).toBe(true);
    expect(search.iclearSearch.isPresent()).toBe(true);
    expect(search.from.getText()).toContain(fromDate);
    expect(search.to.getText()).toContain(toDate);

    browser.wait(EC.elementToBeClickable(search.from), 10000).then(function() {
        search.from.click();
    });

    browser.wait(EC.elementToBeClickable(search.calendarXButton), 10000).then(function() {
        expect(search.calendarHead.getText()).toEqual("Pick a date and a time");
        expect(search.calendar.isPresent()).toBe(true);
        expect(search.calendarOkButton.getText()).toEqual("OK");
        expect(search.calendarXButton.getText()).toEqual("Cancel");
        search.calendarXButton.click();
    });

    browser.wait(EC.elementToBeClickable(search.to), 10000).then(function() {
        search.to.click();
    });

    browser.wait(EC.elementToBeClickable(search.calendarXButton), 10000).then(function() {
        expect(search.calendarHead.getText()).toEqual("Pick a date and a time");
        expect(search.calendar.isPresent()).toBe(true);
        expect(search.calendarOkButton.getText()).toEqual("OK");
        expect(search.calendarXButton.getText()).toEqual("Cancel");
        search.calendarXButton.click();
    });
}

describe('Verify Domain User Layout', function() {

    it('Check:', function() {

        //  Open page
        browser.get('http://localhost:8100/#/login');

        EC = protractor.ExpectedConditions;

        // Take elements
        test = new LoginPage();
        dash = new Dashboard();
        search = new SearchPanel();
        category = new CategoryPanel();

        data = require('.././dependencies/dataForUserRestrictedLogin.json');

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

        buildDate = (((dayNumber.concat(" ", month)).concat(" - ", dayNumber)).concat(" ", month)).concat(" ", year);
        fromDate = ((year.concat("-", monthNumber)).concat("-", dayNumber)).concat(" ", "00");
        toDate = ((year.concat("-", monthNumber)).concat("-", dayNumber)).concat(" ", hourNumber);

        //  Login
        field_cleaner(test);
        test.hostname.sendKeys(data.domainH);
        test.user.sendKeys(data.domainU);
        test.password.sendKeys(data.domainP);
        test.logbutton.click();

        //  Check Dashboard
        var header = element.all(by.css('.text-center.ng-binding')).get(0);

        //  Check Header
        browser.wait(EC.visibilityOf(header), 10000).then(function() {
            expect(header.getText()).toEqual("Hello".concat(" ", data.domainU));
        });
        //  Check role
        expect(dash.bigRole.getText()).toEqual("DOMAIN USER");
        // Check categories
        expect(dash.bigIncoming.isPresent()).toBe(true);
        expect(dash.bigOutgoing.isPresent()).toBe(true);
        //  Check Title
        expect(dash.bigLoginCheck.isPresent()).toBe(true);
        //  Check copyRight
        expect(dash.bigcopyRight.getText()).toEqual("© 2017 SpamExperts");

        //  Enter Incoming Menu
        dash.bigIncoming.click();

        //  Check Incoming Page
        browser.wait(EC.visibilityOf(category.iHeader), 10000).then(function() {
            expect(category.iHeader.getText()).toEqual("Incoming spam messages");
        });
        expect(category.ileftButton.isPresent()).toBeTruthy();
        expect(category.iName.getText()).toEqual(data.domainU);
        expect(category.itimeDate.isPresent()).toBe(true);
        expect(category.itimeDate.getText()).toEqual(buildDate);

        //  Enter iSearch Menu
        browser.wait(EC.visibilityOf(category.isearchButton), 10000).then(function() {
            expect(category.isearchButton.isPresent()).toBe(true);
        });
        browser.wait(EC.elementToBeClickable(category.isearchButton), 10000).then(function() {
            category.isearchButton.click();
        });

        //  Check iSearch Menu
        browser.wait(EC.visibilityOf(search.backButton), 10000).then(function() {
            expect(search.backButton.isPresent()).toBe(true);
        });

        checkSearchMenu();

        //  Go back to dashboard
        browser.navigate().back();

        //  Enter Outgoing Menu
        browser.wait(EC.visibilityOf(dash.bigOutgoing), 10000).then(function() {
            dash.bigOutgoing.click();
        });
        //  Check Outgoing Page
        browser.wait(EC.visibilityOf(category.oHeader), 10000).then(function() {
            expect(category.oHeader.getText()).toEqual("Outgoing spam messages");
        });
        expect(category.oleftButton.isPresent()).toBeTruthy();
        expect(category.oName.getText()).toEqual(data.domainU);
        expect(category.otimeDate.isPresent()).toBe(true);
        expect(category.otimeDate.getText()).toEqual(buildDate);

        //  Enter outSearch Menu
        browser.wait(EC.visibilityOf(category.osearchButton), 10000).then(function() {
            expect(category.osearchButton.isPresent()).toBe(true);
        });
        browser.wait(EC.elementToBeClickable(category.osearchButton), 10000).then(function() {
            category.osearchButton.click();
        });

        //  Check outSearch Menu
        browser.wait(EC.visibilityOf(search.backButton), 10000).then(function() {
            expect(search.backButton.isPresent()).toBe(true);
        });

        checkSearchMenu();

        //  Go back to dashboard
        browser.navigate().back();

        //  Log out
        browser.wait(EC.visibilityOf(dash.leftButton), 10000).then(function() {
            expect(dash.leftButton.isPresent()).toBe(true);
        });
        browser.wait(EC.elementToBeClickable(dash.leftButton), 10000).then(function() {
            dash.leftButton.click();
        });

        var logHead = element(by.css('.title.text-center.ng-binding'));
        browser.wait(EC.visibilityOf(logHead), 10000).then(function() {
            expect(logHead.getText()).toEqual(data.domainU);
        });
        expect(dash.right_arrow.isPresent()).toBe(true);
        expect(dash.role.getText()).toEqual("DOMAIN USER");
        expect(dash.loginCheck.getText()).toEqual("Your available products");
        expect(dash.incoming.isPresent()).toBe(true);
        expect(dash.outgoing.isPresent()).toBe(true);
        expect(dash.copyRight.getText()).toEqual("© 2017 SpamExperts");

        browser.wait(EC.elementToBeClickable(dash.logoutButton), 10000).then(function() {
            dash.logoutButton.click();
        });

        browser.wait(EC.elementToBeClickable(dash.okButton), 10000).then(function() {
            dash.okButton.click();
        });

        browser.wait(EC.visibilityOf(test.logbutton), 10000).then(function() {
            field_cleaner(test);
            browser.refresh();
        });

    });
});
