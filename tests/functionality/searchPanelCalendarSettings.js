var LoginPage = require('.././dependencies/LoginPageObject.js');
var SearchPanel = require('.././dependencies/SearchPanelObject.js');
var CategoryPanel = require('.././dependencies/CategoryPageObject.js');
var Dashboard = require('.././dependencies/DashPageObject');

function field_cleaner(test) {
    test.hostname.clear();
    test.user.clear();
    test.password.clear();
}

/**
 *  Build a time date in string format for Search Menu
 */
function buildDate(date, byDefault, head) {


    var month = months[date.getMonth()];
    var year = date.getFullYear().toString();

    monthNumber = (date.getMonth() + 1).toString();
    if (date.getMonth() + 1 < 10)
        monthNumber = "0".concat("", monthNumber);
    dayNumber = date.getDate().toString();
    if (date.getDate() < 10)
        dayNumber = "0".concat("", dayNumber);
    hourNumber = date.getHours().toString();
    if (date.getHours() < 10)
        hourNumber = "0".concat("", hourNumber);
    minuteNumber = date.getMinutes().toString();
    if (date.getMinutes() < 10)
        minuteNumber = "0".concat("", minuteNumber);

    var stringDate;

    if (head && byDefault)
        stringDate = (((dayNumber.concat(" ", month)).concat(" - ", dayNumber)).concat(" ", month)).concat(" ", year);
    else if (byDefault)
        stringDate = ((year.concat("-", monthNumber)).concat("-", dayNumber)).concat(" ", "00:00");
    else
        stringDate = (((year.concat("-", monthNumber)).concat("-", dayNumber)).concat(" ", hourNumber)).concat(":", minuteNumber);

    return stringDate;
}

/**
 *  Set date for from/to time date fields
 */

function setDate(button, input) {

    browser.wait(EC.elementToBeClickable(button), 5000).then(function() {
        button.click();
    });

    var day = input.getDate().toString();
    var year = input.getFullYear().toString();
    var hour = input.getHours().toString();
    var minute = input.getMinutes().toString();

    searchMenu.calendaryearField.clear();
    searchMenu.calendaryearField.sendKeys(year);

    var initCss = '[value="number:3"]';
    var finalCss = initCss.replace("3", input.getMonth());
    var monthField = element(by.css(finalCss));
    browser.wait(EC.elementToBeClickable(searchMenu.calendarmonthButton), 5000).then(function() {
        searchMenu.calendarmonthButton.click();
        monthField.click();
    });

    var initXPath;
    if (input.getDate() < 6)
        initXPath = "(//div[contains(@class, 'row calendar')]//div[contains(@class,'col') and contains(.,'6')])[2]";
    else
        initXPath = "(//div[contains(@class, 'row calendar')]//div[contains(@class,'col') and contains(.,'6')])[1]";
    var finalXPath = initXPath.replace("'6'", day);
    var dayField = element(by.xpath(finalXPath));
    browser.wait(EC.elementToBeClickable(dayField), 5000).then(function() {
        dayField.click();
    });

    searchMenu.calendarhourField.clear();
    searchMenu.calendarhourField.sendKeys(hour);
    searchMenu.calendarminuteField.clear();
    searchMenu.calendarminuteField.sendKeys(minute);

    browser.wait(EC.elementToBeClickable(searchMenu.calendarOkButton), 5000).then(function() {
        searchMenu.calendarOkButton.click();
    });
}

/**
 *  Build a time date in string format for incoming/outgoing head date
 */
function buildHeadDate(fromDate, toDate) {

    var from = fromDate;
    var to = toDate;

    var dayFrom = from.getDate().toString();
    var monthFrom = months[from.getMonth()];
    var dayFromNumber = from.getDate().toString();
    if (from.getDate() < 10)
        dayFromNumber = "0".concat("", dayFrom);

    var dayTo = to.getDate().toString();
    var monthTo = months[to.getMonth()];
    var yearTo = to.getFullYear().toString();
    var dayToNumber = to.getDate().toString();
    if (to.getDate() < 10)
        dayToNumber = "0".concat("", dayTo);

    var stringDate = (((dayFromNumber.concat(" ", monthFrom)).concat(" - ", dayToNumber)).concat(" ", monthTo)).concat(" ", yearTo);

    return stringDate;
}

/**
 *  Check default after cleanSearch
 */
function checkDefault(nr) {

    fromDate = buildDate(new Date(), true, false);
    toDate = buildDate(new Date(), false, false);
    headDate = buildDate(new Date(), true, true);

    expect(searchMenu.from.getText()).toContain(fromDate.substring(0, 13));
    expect(searchMenu.to.getText()).toContain(toDate.substring(0, 13));

    if (nr === 0)
        browser.wait(EC.elementToBeClickable(searchMenu.backButton), 5000).then(function() {
            searchMenu.backButton.click();
        });

    expect(incomingPage.itimeDate.getText()).toEqual(headDate);
}

describe('Verify Calendar Setting', function() {

    it('Check:', function() {

        //  Test input date
        var inputFrom = new Date("2015-03-17T04:13:00Z");
        var inputTo = new Date("2016-10-07T18:05:00Z");

        //  Time variables
        monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        EC = protractor.ExpectedConditions;
        fromDate = new Date();
        toDate = new Date();

        //  Open page
        browser.get('http://localhost:8100/#/login');

        // Take elements
        test = new LoginPage();
        dash = new Dashboard();
        searchMenu = new SearchPanel();
        incomingPage = new CategoryPanel();

        //  Load user data
        data = require('.././dependencies/dataForUserRestrictedLogin.json');

        //  Clear login fields
        field_cleaner(test);

        //  Login
        test.hostname.sendKeys(data.domainH);
        test.user.sendKeys(data.domainU);
        test.password.sendKeys(data.domainP);
        test.logbutton.click();

        //  Enter Incoming Page
        browser.wait(EC.elementToBeClickable(dash.bigIncoming), 5000).then(function() {
            dash.bigIncoming.click();
        });

        //  Enter Search Menu
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 10000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Check default Setup
        checkDefault(0);

        //  Set From Calendar
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 5000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Set date for From field
        setDate(searchMenu.from, inputFrom);

        //  Build string date
        fromDate = buildDate(inputFrom, false, false);

        //  Check from date without minutes
        expect(searchMenu.from.getText()).toContain(fromDate.substring(0, 13));

        //  Build string date
        toDate = buildDate(new Date(), false, false);

        //  Check date without minutes
        expect(searchMenu.to.getText()).toContain(toDate.substring(0, 13));

        //  Keep settings
        browser.wait(EC.elementToBeClickable(searchMenu.startSearch), 5000).then(function() {
            searchMenu.startSearch.click();
        });

        //  Check changes made in the time date of incoming page
        browser.wait(EC.visibilityOf(incomingPage.itimeDate), 5000).then(function() {
            expect(incomingPage.itimeDate.getText()).toEqual(buildHeadDate(inputFrom, new Date()));
        });

        //  Go back
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 10000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Clear settings
        browser.wait(EC.elementToBeClickable(searchMenu.clearSearch), 5000).then(function() {
            searchMenu.clearSearch.click();
        });

        //  Keep settings
        browser.wait(EC.elementToBeClickable(searchMenu.startSearch), 5000).then(function() {
            searchMenu.startSearch.click();
        });

        //  Check changes made in the time date of incoming page
        checkDefault(1);

        // Set To Calendar
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 10000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Set date for To field
        setDate(searchMenu.to, inputTo);

        //  Build string date
        toDate = buildDate(inputTo, false, false);

        //  Check to date without minutes        
        expect(searchMenu.to.getText()).toContain(toDate.substring(0, 13));

        //  Build string date
        fromDate = buildDate(new Date(), true, false);

        //  Check date without minutes
        expect(searchMenu.from.getText()).toContain(fromDate.substring(0, 13));

        //  Keep settings
        browser.wait(EC.elementToBeClickable(searchMenu.startSearch), 5000).then(function() {
            searchMenu.startSearch.click();
        });

        //  Check changes made in the time date of incoming page
        browser.wait(EC.visibilityOf(incomingPage.itimeDate), 5000).then(function() {
            expect(incomingPage.itimeDate.getText()).toEqual(buildHeadDate(new Date(), inputTo));
        });

        //  Go back
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 10000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Clear settings
        browser.wait(EC.elementToBeClickable(searchMenu.clearSearch), 5000).then(function() {
            searchMenu.clearSearch.click();
        });

        //  Keep settings
        browser.wait(EC.elementToBeClickable(searchMenu.startSearch), 5000).then(function() {
            searchMenu.startSearch.click();
        });

        //  Check changes made in the time date of incoming page
        checkDefault(2);

        // Set From & To Calendar
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 10000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Set date for From field
        setDate(searchMenu.from, inputFrom);

        //  Build string date
        fromDate = buildDate(inputFrom, false, false);

        //  Check date without minutes
        expect(searchMenu.from.getText()).toContain(fromDate.substring(0, 13));

        //  Set date for To field
        setDate(searchMenu.to, inputTo);

        //  Build string date
        toDate = buildDate(inputTo, false, false);

        //  Check date without minutes
        expect(searchMenu.to.getText()).toContain(toDate.substring(0, 13));

        //  Keep settings
        browser.wait(EC.elementToBeClickable(searchMenu.startSearch), 5000).then(function() {
            searchMenu.startSearch.click();
        });

        //  Check changes made in the time date of incoming page
        browser.wait(EC.visibilityOf(incomingPage.itimeDate), 5000).then(function() {
            expect(incomingPage.itimeDate.getText()).toEqual(buildHeadDate(inputFrom, inputTo));
        });

        //  Go back
        browser.wait(EC.elementToBeClickable(incomingPage.isearchButton), 10000).then(function() {
            incomingPage.isearchButton.click();
        });

        //  Clear settings
        browser.wait(EC.elementToBeClickable(searchMenu.clearSearch), 5000).then(function() {
            searchMenu.clearSearch.click();
        });

        //  Keep settings
        browser.wait(EC.elementToBeClickable(searchMenu.startSearch), 5000).then(function() {
            searchMenu.startSearch.click();
        });

        //  Check changes made in the time date of incoming page
        checkDefault(3);

        browser.refresh();
    });

});