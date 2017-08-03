var LoginPage = require('./dependencies/LoginPageObject.js');
var AlertPage = require('./dependencies/AlertLogPageObject.js');
var Dashboard = require('./dependencies/DashPageObject');

var InputData = function(hostname, username, password)  {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
}

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

    var data = require('./dependencies/dataForUserRestrictedLogin.json');
    var EC = protractor.ExpectedConditions;
    //browser.ignoreSynchronization = true;
    
    var superAdminData = new InputData(data.superAdminH, data.superAdminU, data.superAdminP);
    var adminData = new InputData(data.adminH, data.adminU, data.adminP);
    var domainData = new InputData(data.domainH, data.domainU, data.domainP);
    var emailData = new InputData(data.emailH, data.emailU, data.emailP);


    //  Test for SuperAdmin User   
    field_cleaner(test);   
    test.hostname.sendKeys(superAdminData.hostname);
    test.user.sendKeys(superAdminData.username);
    test.password.sendKeys(superAdminData.password);
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

    dash.logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    browser.wait(EC.elementToBeClickable(dash.logoutButton), 5000).then(function(){
        dash.logoutButton.click();
    });

    dash.okButton = element(by.xpath("//button[contains(.,'OK')]"));
    browser.wait(EC.elementToBeClickable(dash.okButton), 5000).then(function(){
        dash.okButton.click();
    });
 
    //  Test for Domain User 
    field_cleaner(test);
    test.hostname.sendKeys(domainData.hostname);
    test.user.sendKeys(domainData.username);
    test.password.sendKeys(domainData.password);
    test.logbutton.click();

    browser.wait(EC.visibilityOf(dash.bigRole), 5000).then(function(){   
        expect(dash.bigRole.getText()).toEqual("DOMAIN USER");
    });
 
    expect(dash.bigIncoming.isPresent()).toBe(true);
    expect(dash.bigOutgoing.isPresent()).toBe(true);

    dash.leftButton = element(by.xpath("//ion-header-bar//button[contains(@class,'ion-navicon')]"));
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
    test.hostname.sendKeys(emailData.hostname);
    test.user.sendKeys(emailData.username);
    test.password.sendKeys(emailData.password);
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
    test.hostname.sendKeys(adminData.hostname);
    test.user.sendKeys(adminData.username);
    test.password.sendKeys(adminData.password);
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