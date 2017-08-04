var LoginPage = require('./dependencies/LoginPageObject.js');
var SearchPanel = require('./dependencies/SearchPanelObject.js');
var dashPage = require('./dependencies/DashPageObject.js');
var CategoryPage = require('./dependencies/CategoryPageObject.js');
var extract_data = require('./dependencies/ExtractDataFunction.js');

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
        var currentDate = Date();
        var formatedDate = new Array();
        extract_data(formatedDate, currentDate);
        formatedDate = formatedDate.join("");

        addCredentials(Obj, data.emailH, data.emailU, data.emailP);
        Obj.logbutton.click();

        //Incoming Layout Check
        browser.wait(EC.visibilityOf(logged.bigLoginCheck), 20000)
            .then(function() {
                expect(logged.bigLoginCheck.isPresent()).toBeTruthy();
            });
        browser.wait(EC.visibilityOf(logged.bigIncoming), 20000)
            .then(function() {
                expect(logged.bigIncoming.isPresent()).toBeTruthy();
            });
             expect(logged.bigOutgoing.isPresent()).toBeFalsy();
        browser.wait(EC.visibilityOf(logged.leftButton), 20000)
            .then(function() {
                expect(logged.leftButton.isPresent()).toBeTruthy();


            });
            browser.sleep(1000);
             logged.leftButton.click();
        browser.wait(EC.visibilityOf(logged.right_arrow), 20000)
            .then(function() {
                expect(logged.right_arrow.isPresent()).toBeTruthy();
            });

        browser.wait(EC.visibilityOf(logged.incoming), 20000)
            .then(function() {
                expect(logged.incoming.isPresent()).toBeTruthy();
            });

            expect(logged.outgoing.isPresent()).toBeFalsy();

        browser.wait(EC.visibilityOf(logged.logoutButton), 20000)
            .then(function() {
                expect(logged.logoutButton.isPresent()).toBeTruthy();
            });
        logged.incoming.click();
        browser.ignoreSynchronization = true;

       
        expect(category.itimeDate.isPresent()).toBeTruthy();
        expect(category.itimeDate.getText()).toEqual(formatedDate);

        browser.wait(EC.visibilityOf(search.isearchButton), 20000)
            .then(function() {
                expect(search.isearchButton.isPresent()).toBeTruthy();
            });

        search.isearchButton.click();

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
        search.fromdate.click();
        
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 20000)
            .then(function() {
                search.calendarXButton.click();
            });
            
        browser.sleep(800);
        browser.wait(EC.elementToBeClickable(search.todate), 20000)
            .then(function() {
        search.todate.click();
            });
        expect(search.calendarHead.isPresent()).toBeTruthy();
        expect(search.calendar.isPresent()).toBeTruthy();
        expect(search.calendarXButton.isPresent()).toBeTruthy();
        expect(search.calendarOkButton.isPresent()).toBeTruthy();
        browser.wait(EC.visibilityOf(search.calendarXButton), 20000)
            .then(function() {
                search.calendarXButton.click();
            });
        browser.refresh();
        browser.refresh();
    });
});
