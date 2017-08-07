var LoginPage = require('.././dependencies/LoginPageObject.js');
var AlertPage = require('.././dependencies/AlertLogPageObject.js');
var Dashboard = require('.././dependencies/DashPageObject');

function field_cleaner(test) {
    test.hostname.clear();
    test.user.clear();
    test.password.clear();
}

/*
    Test should check that different type of users are allowed or not to use the app.
    If they are allowed, it tests that their dash.role is displayed correctly and
    they have access to the proper quarantine categories.
*/

describe('Verify User Restrictions', function() {

  it('Check:', function() {

    // Open page
    browser.get('http://localhost:8100/#/login');

    //	Take elements
    test = new LoginPage();
    dash = new Dashboard();
	alert = new AlertPage();

    var data = require('.././dependencies/dataForUserRestrictedLogin.json');
    var EC = protractor.ExpectedConditions;

    //  Test for SuperAdmin User
    field_cleaner(test);
    test.hostname.sendKeys(data.superAdminH);
    test.user.sendKeys(data.superAdminU);
    test.password.sendKeys(data.superAdminP);
    test.logbutton.click();

    browser.wait(EC.visibilityOf(dash.bigRole), 5000).then(function(){
        expect(dash.bigRole.getText()).toEqual("SUPER-ADMIN");
    });

    expect(dash.bigIncoming.isPresent()).toBe(true);
    expect(dash.bigOutgoing.isPresent()).toBe(true);

    browser.wait(EC.visibilityOf(dash.leftButton), 5000).then(function(){
       expect(dash.leftButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(dash.leftButton), 5000).then(function(){
       dash.leftButton.click();
    });

    browser.wait(EC.elementToBeClickable(dash.logoutButton), 5000).then(function(){
        dash.logoutButton.click();
    });

    browser.wait(EC.elementToBeClickable(dash.okButton), 5000).then(function(){
        dash.okButton.click();
    });

    //  Test for Domain User
    field_cleaner(test);
    test.hostname.sendKeys(data.domainH);
    test.user.sendKeys(data.domainU);
    test.password.sendKeys(data.domainP);
    test.logbutton.click();

    browser.wait(EC.visibilityOf(dash.bigRole), 5000).then(function(){
        expect(dash.bigRole.getText()).toEqual("DOMAIN USER");
    });

    expect(dash.bigIncoming.isPresent()).toBe(true);
    expect(dash.bigOutgoing.isPresent()).toBe(true);

    browser.wait(EC.visibilityOf(dash.leftButton), 5000).then(function(){
       expect(dash.leftButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(dash.leftButton), 5000).then(function(){
       dash.leftButton.click();
    });

    browser.wait(EC.elementToBeClickable(dash.logoutButton), 5000).then(function(){
        dash.logoutButton.click();
    });

    browser.wait(EC.elementToBeClickable(dash.okButton), 5000).then(function(){
        dash.okButton.click();
    });

    //  Test for Email User
    field_cleaner(test);
    test.hostname.sendKeys(data.emailH);
    test.user.sendKeys(data.emailU);
    test.password.sendKeys(data.emailP);
    test.logbutton.click();

    browser.wait(EC.visibilityOf(dash.bigRole), 5000).then(function(){
        expect(dash.bigRole.getText()).toEqual("EMAIL USER");
    });

    expect(dash.bigIncoming.isPresent()).toBe(true);
    expect(dash.bigOutgoing.isPresent()).toBe(false);

    browser.wait(EC.visibilityOf(dash.leftButton), 5000).then(function(){
       expect(dash.leftButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(dash.leftButton), 5000).then(function(){
       dash.leftButton.click();
    });

    browser.wait(EC.elementToBeClickable(dash.logoutButton), 5000).then(function(){
        dash.logoutButton.click();
    });

    browser.wait(EC.elementToBeClickable(dash.okButton), 5000).then(function(){
        dash.okButton.click();
    });

    //  Test for AdminUser
    field_cleaner(test);
    test.hostname.sendKeys(data.adminH);
    test.user.sendKeys(data.adminU);
    test.password.sendKeys(data.adminP);
    test.logbutton.click();

    browser.wait(EC.visibilityOf(alert.alertBody), 5000).then(function(){
        expect(alert.alertHead.getText()).toEqual("Error logging in!");
        expect(alert.alertBody.getText()).toEqual("Sorry, admin users are not able to use this app yet. Please log in as a domain or email user.");
    });

    browser.wait(EC.elementToBeClickable(alert.alertButton), 5000).then(function(){
        alert.alertButton.click();
    });

    browser.wait(EC.visibilityOf(test.logbutton), 5000).then(function(){
		field_cleaner(test);
    });

  });
});
