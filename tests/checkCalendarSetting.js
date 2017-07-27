var PageData = function()   {
    this.logo = element(by.xpath("//img[contains(@src,'logo.svg')]"));
    this.hostname = element(by.xpath("//input[contains(@placeholder,'Hostname')]"));
    this.username = element(by.xpath("//input[contains(@placeholder,'User')]"));
    this.password = element(by.xpath("//input[contains(@placeholder,'Password')]"));
    this.rememberButton = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logButton = element(by.xpath("//button[contains(.,'Log in')]"));
}

function field_cleaner(test) {
    test.hostname.clear();
    test.password.clear();
    test.username.clear();
}

function buildDate(date, byDefault, head){

    var day = date.getDate().toString();
    var month = months[date.getMonth()];
    var year = date.getFullYear().toString();

    monthNumber = (date.getMonth() + 1).toString();
    if(date.getMonth() + 1 < 10)
        monthNumber = "0".concat("", monthNumber);
    dayNumber = date.getDate().toString();
    if(date.getDate() < 10)
        dayNumber = "0".concat("", dayNumber);
    hourNumber = date.getHours().toString();
    if(date.getHours() < 10)
        hourNumber = "0".concat("", hourNumber);
    minuteNumber = date.getMinutes().toString();
    if(date.getMinutes() < 10)
        minuteNumber = "0".concat("", minuteNumber);

    var stringDate;

    if(head && byDefault)
        stringDate = (((dayNumber.concat(" ", month)).concat(" - ", dayNumber)).concat(" ", month)).concat(" ", year);
    else    if(byDefault)
                stringDate = ((year.concat("-", monthNumber)).concat("-",dayNumber)).concat(" ","00:00");
            else
                stringDate = (((year.concat("-", monthNumber)).concat("-",dayNumber)).concat(" ",hourNumber)).concat(":", minuteNumber);

    return stringDate;
}

function setDate(button, input){

    browser.wait(EC.elementToBeClickable(button), 5000).then(function(){
        button.click();
    });

    var day = input.getDate().toString();
    var month = monthsLong[input.getMonth()];
    var year = input.getFullYear().toString();
    var hour = input.getHours().toString();
    var minute = input.getMinutes().toString();

    var yearField = element(by.xpath("//input[contains(@ng-model,'bind.year')]"));

    var initXPath = "//option[contains(@label,'February')]";
    var finalXPath = initXPath.replace("February", month);
    var monthField = element(by.xpath(finalXPath));
    browser.wait(EC.elementToBeClickable(monthField), 5000).then(function(){
        monthField.click();
    });

    initXPath = "//div[contains(@class,'col') and contains(.,'18')]";
    finalXPath = initXPath.replace("18", day);
    var dayField = element(by.xpath(finalXPath));
    browser.wait(EC.elementToBeClickable(dayField), 5000).then(function(){
        dayField.click();
    });

    var hourField = element(by.xpath("//input[@ng-model='bind.hour']"));
    var minuteField = element(by.xpath("//input[@ng-model='bind.minute']"));

    yearField.clear();
    yearField.sendKeys(year);
    hourField.clear();
    hourField.sendKeys(hour);
    minuteField.clear();
    minuteField.sendKeys(minute);

    var OKButton = element(by.xpath("//button[contains(.,'OK')]"));
    browser.wait(EC.elementToBeClickable(OKButton), 5000).then(function(){
        OKButton.click();
    });
}

function buildHeadDate(fromDate, toDate){

    var from = fromDate;
    var to = toDate;

    if(toDate === null)
        to = new Date();
    if(fromDate === null)
        from = new Date();

    var dayFrom = from.getDate().toString();
    var monthFrom = months[from.getMonth()];
    var dayFromNumber = from.getDate().toString();
    if(from.getDate() < 10)
        dayFromNumber = "0".concat("", dayFrom);

    var dayTo = to.getDate().toString();
    var monthTo = months[to.getMonth()];
    var yearTo = to.getFullYear().toString();
    var dayToNumber = to.getDate().toString();
    if(to.getDate() < 10)
        dayToNumber = "0".concat("", dayTo);

    var stringDate = (((dayFromNumber.concat(" ", monthFrom)).concat(" - ", dayToNumber)).concat(" ", monthTo)).concat(" ", yearTo);
    return stringDate;
}

function checkDefault(nr){

    fromDate = buildDate(new Date(), true, false);
    toDate = buildDate(new Date(), false, false);
    headDate = buildDate(new Date(), true, true);

    expect(fromButton.getText()).toEqual(fromDate);
    expect(toButton.getText()).toEqual(toDate);

    if(nr == 0)
        browser.wait(EC.elementToBeClickable(backButton), 5000).then(function(){
            backButton.click();
        });

    pageDate = element(by.xpath("//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')]"));
    expect(pageDate.getText()).toEqual(headDate);
}

describe('Verify Calendar Setting', function() {

  it('Check:', function() {

    var inputFrom = new Date("2015-03-25T04:13:00Z");
    var inputTo = new Date("2016-11-08T18:05:00Z");

    monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    EC = protractor.ExpectedConditions;
    fromDate = undefined;
    toDate = undefined;
    headDate = undefined;

    //  Open page
    browser.get('http://localhost:8100/#/login');

    var test = new PageData();
    var data = require('./dataForUserRestrictedLogin.json');
    var hostname = data.domainH;
    var username = data.domainU;
    var password = data.domainP;

    //  Login
    field_cleaner(test);
    test.hostname.sendKeys(hostname);
    test.username.sendKeys(username);
    test.password.sendKeys(password);
    test.logButton.click();

    //  Enter Incoming Page
    var incomingButton = element(by.xpath("//a[contains(@ui-sref,'main.incomingLogSearch')]"));
    browser.wait(EC.elementToBeClickable(incomingButton), 5000).then(function(){
        incomingButton.click();
    });

    pageDate = element(by.xpath("//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')]"));

    //  Enter Search Menu
    var searchButton = element(by.xpath("(//button[contains(@on-tap,'toggleRightMenu($event)')])[1]"));
    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    //  Take From, To, Search, Clear and Back Buttons
    fromButton = element.all(by.xpath("//div[contains(@class,'time ng-binding')]")).get(0);
    toButton = element.all(by.xpath("//div[contains(@class,'time ng-binding')]")).get(1);
    var doSearch = element(by.xpath("//button[contains(@on-tap,'doSearch()')]"));
    var doClear = element(by.xpath("//button[@on-tap='clearSearch()']"));
    backButton = element(by.xpath("//button[contains(@menu-toggle,'right')]"));

    //  Check default Setup
    checkDefault(0);

    //  Set From Calendar
    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    setDate(fromButton, inputFrom);

    fromDate = buildDate(inputFrom, false, false);
    toDate = buildDate(new Date(), false, false);
    expect(fromButton.getText()).toEqual(fromDate);
    expect(toButton.getText()).toEqual(toDate);

    browser.wait(EC.elementToBeClickable(doSearch), 5000).then(function(){
        doSearch.click();
    });

    headDate = buildHeadDate(inputFrom, null);
    pageDate = element(by.xpath("//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')]"));
    browser.wait(EC.visibilityOf(pageDate), 5000).then(function(){
            expect(pageDate.getText()).toEqual(headDate);
    });

    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    browser.wait(EC.elementToBeClickable(doClear), 5000).then(function(){
        doClear.click();
    });

    browser.wait(EC.elementToBeClickable(doSearch), 5000).then(function(){
        doSearch.click();
    });

    checkDefault(1);

    // Set To Calendar
    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    setDate(toButton, inputTo);
    fromDate = buildDate(new Date(), true, false);
    toDate = buildDate(inputTo, false, false);

    expect(fromButton.getText()).toEqual(fromDate);
    expect(toButton.getText()).toEqual(toDate);

    browser.wait(EC.elementToBeClickable(doSearch), 5000).then(function(){
        doSearch.click();
    });

    headDate = buildHeadDate(null, inputTo);
    pageDate = element(by.xpath("//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')]"));
    browser.wait(EC.visibilityOf(pageDate), 5000).then(function(){
            expect(pageDate.getText()).toEqual(headDate);
    });

    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    browser.wait(EC.elementToBeClickable(doClear), 5000).then(function(){
        doClear.click();
    });

    browser.wait(EC.elementToBeClickable(doSearch), 5000).then(function(){
        doSearch.click();
    });

    checkDefault(2);

    // Set From & To Calendar
    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    setDate(fromButton, inputFrom);
    setDate(toButton, inputTo);

    fromDate = buildDate(inputFrom, false, false);
    toDate = buildDate(inputTo, false, false);

    expect(fromButton.getText()).toEqual(fromDate);
    expect(toButton.getText()).toEqual(toDate);

    browser.wait(EC.elementToBeClickable(doSearch), 5000).then(function(){
        doSearch.click();
    });


    headDate = buildHeadDate(inputFrom, inputTo);
    pageDate = element(by.xpath("//div[contains(@class,'col col-30 col-center text-right top-date ng-binding')]"));
    browser.wait(EC.visibilityOf(pageDate), 5000).then(function(){
            expect(pageDate.getText()).toEqual(headDate);
    });
    
    browser.wait(EC.elementToBeClickable(searchButton), 10000).then(function(){
        searchButton.click();
    });

    browser.wait(EC.elementToBeClickable(doClear), 5000).then(function(){
        doClear.click();
    });

    browser.wait(EC.elementToBeClickable(doSearch), 5000).then(function(){
        doSearch.click();
    });

    checkDefault(3);

    //  Log out
    browser.navigate().back();

    var menuButton = element(by.xpath("(//ion-header-bar//button[contains(@class,'ion-navicon')])[1]"));
    browser.wait(EC.elementToBeClickable(menuButton), 5000).then(function(){
       menuButton.click();
    });

    var logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    var OKButton = element(by.xpath("//button[contains(.,'OK')]"));
    browser.wait(EC.elementToBeClickable(logoutButton), 5000).then(function(){
        logoutButton.click();
    });
    browser.wait(EC.elementToBeClickable(OKButton), 5000).then(function(){
        OKButton.click();
    });
    browser.wait(EC.visibilityOf(test.logButton), 5000).then(function(){
        browser.sleep(800);
        test.hostname.clear();
        test.username.clear();
        test.password.clear();
    });

  });

});