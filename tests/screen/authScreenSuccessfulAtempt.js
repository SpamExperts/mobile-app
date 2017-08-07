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
    browser.ignoreSynchronization = true;

    // Take elements
    test = new LoginPage();
    dash = new Dashboard();

    var EC = protractor.ExpectedConditions;

    field_cleaner(test)

    data = require('.././dependencies/dataForUserRestrictedLogin.json');

    //  Login
    field_cleaner(test);
    test.hostname.sendKeys(data.superAdminH);
    test.user.sendKeys(data.superAdminU);
    test.password.sendKeys(data.superAdminP);
    test.logbutton.click();

    browser.wait(EC.elementToBeClickable(dash.loginCheck), 5000).then(function(){
        expect(dash.loginCheck.isPresent()).toBe(true);
    });
    
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

    browser.refresh();

  });

});