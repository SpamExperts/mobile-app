var LoginPage = require('.././dependencies/LoginPageObject.js');
var dashPage = require('.././dependencies/DashPageObject.js');

function addCredentials(page, host, user, pwd) {
    //The three fields should be provided with valid data
    page.hostname.sendKeys(host);
    page.user.sendKeys(user);
    page.password.sendKeys(pwd);
}

function field_cleaner(page) {
    page.hostname.clear();
    page.password.clear();
    page.user.clear();
}

//  Load user data
var data = require(".././dependencies/dataForUserRestrictedLogin");

/**
 *  The error message that is checked it's the one the application returns at the moment the test are written.
 *  If there will be an update the error message could be changed depending on the
 *  case it envolves.
 *  Here should be a feature allowing the soft to detect an inexisting user
 */
describe('Verify remember button', function() {

    var page = new LoginPage();
    var alreadyLogged = new dashPage();
    var EC = protractor.ExpectedConditions;

    it('should keep the user logged if the button is checked and not logged otherwise', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        //  Clear log in fields
        field_cleaner(page);

        //  For being able to login, the .json file must have valid user, and password on the second element of the arrays.
        addCredentials(page, data.superAdminH, data.superAdminU, data.superAdminP);

        //  Log in
        page.reminder.click();
        page.logbutton.click();

        //  Check the login was successful and dashboard is visible
        browser.wait(EC.visibilityOf(alreadyLogged.bigLoginCheck), 10000).then(function() {
            expect(alreadyLogged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        browser.refresh();

        //  Check the user is still logged 
        browser.wait(EC.visibilityOf(alreadyLogged.bigLoginCheck), 10000).then(function() {
            expect(alreadyLogged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Try log out
        alreadyLogged.leftButton.click();
        alreadyLogged.logoutButton.click();
        alreadyLogged.cancelButton.click();
        alreadyLogged.logoutButton.click();
        alreadyLogged.okButton.click();

        //  Clear log in page
        browser.wait(EC.visibilityOf(page.logbutton), 10000).then(function() {
            field_cleaner(page);
        });

        //  Disable remember function
        page.reminder.click();

        //  Log in
        addCredentials(page, data.superAdminH, data.superAdminU, data.superAdminP);
        page.logbutton.click();

        //  Check the login was successful and dashboard is visible
        browser.wait(EC.visibilityOf(alreadyLogged.bigLoginCheck), 10000).then(function() {
            expect(alreadyLogged.bigLoginCheck.isPresent()).toBeTruthy();
        });

        //  Check the user is not logged anymore
        browser.refresh();

        //  Clear log in fields
        field_cleaner(page);

        //  Check remember button is unchecked
        expect(alreadyLogged.bigLoginCheck.isPresent()).toBeFalsy();

    });
});