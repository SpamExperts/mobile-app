var LoginPage = require('.././dependencies/LoginPageObject.js');
var Dashboard = require('.././dependencies/DashPageObject');

function field_cleaner(test) {
    test.hostname.clear();
    test.user.clear();
    test.password.clear();
}

describe('Verify Successful Login', function() {

    it('Check:', function() {

        // Open page
        browser.get('http://localhost:8100/#/login');
        browser.ignoreSynchronization = false;

        // Take elements
        test = new LoginPage();
        dash = new Dashboard();

        var EC = protractor.ExpectedConditions;

        //  Clear log in page
        field_cleaner(test);

        //  Load valid user data
        data = require('.././dependencies/dataForUserRestrictedLogin.json');

        //  Log in
        test.hostname.sendKeys(data.superAdminH);
        test.user.sendKeys(data.superAdminU);
        test.password.sendKeys(data.superAdminP);
        test.logbutton.click();

        //  Check log in is successful
        browser.wait(EC.elementToBeClickable(dash.loginCheck), 5000).then(function() {
            expect(dash.loginCheck.isPresent()).toBe(true);
        });

        //  Check left button
        browser.wait(EC.visibilityOf(dash.leftButton), 5000).then(function() {
            expect(dash.leftButton.isPresent()).toBe(true);
        });

        //  Enter left menu
        browser.wait(EC.elementToBeClickable(dash.leftButton), 5000).then(function() {
            dash.leftButton.click();
        });

        //  Log out
        browser.wait(EC.elementToBeClickable(dash.logoutButton), 5000).then(function() {
            dash.logoutButton.click();
        });

        browser.wait(EC.elementToBeClickable(dash.okButton), 5000).then(function() {
            dash.okButton.click();
        });

        browser.refresh();

    });
});