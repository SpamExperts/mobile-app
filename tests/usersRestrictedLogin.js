var PageData = function()   {

    this.logo = browser.findElement(by.className('se-icon'));
    this.hostname = browser.findElement(by.model('data.hostname'));
    this.username = browser.findElement(by.model('data.username'));
    this.password = browser.findElement(by.model('data.password'));
    this.logButton = browser.findElement(by.className('button button-block button-dark se-bold disable-user-behavior'));
}

var InputData = function(hostname, username, password)  {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
}

/*
    Test should check that different type of users are allowed or not to use the app. 
    If they are allowed, it tests that their role is displayed correctly and 
    they have access to the proper quarantine categories.
*/

describe('Verify User Restrictions', function() {

  it('Check:', function() {

    // Open page
    browser.get('http://localhost:8100/#/login'); 

    var role;
    var incoming;
    var outgoing;
    var menuButton;
    var logoutButton;
    var OKButton;

    var test = new PageData();
    var data = require('./dataForUserRestrictedLogin.json')
    
    var superAdminData = new InputData(data.superAdminH, data.superAdminU, data.superAdminP);
    var adminData = new InputData(data.adminH, data.adminU, data.adminP);
    var domainData = new InputData(data.domainH, data.domainU, data.domainP);
    var emailData = new InputData(data.emailH, data.emailU, data.emailP);


    //  Test for SuperAdminUser
    test.hostname.sendKeys(superAdminData.hostname);
    test.username.sendKeys(superAdminData.username);
    test.password.sendKeys(superAdminData.password);
    test.logButton.click();
    browser.sleep(500);

    role = browser.findElement(by.className("role ng-binding"));
    expect(role.getText()).toEqual("SUPER-ADMIN");

    incoming = element.all(by.className("text-center button-label ng-binding")).get(0);
    outgoing = element.all(by.className("text-center button-label ng-binding")).get(1);
    expect(incoming.getText()).toEqual("Incoming Filtering Quarantine");
    expect(outgoing.getText()).toEqual("Outgoing Filtering Quarantine");

    menuButton = browser.findElement(by.className("button button-icon icon ion-navicon"));
    menuButton.click();
    browser.sleep(500);

    logoutButton = element(by.css('button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior'));
    logoutButton.click();
    browser.sleep(500);

    OKButton = element(by.css(".button.ng-binding.button-positive"));
    OKButton.click();
    browser.sleep(500);

    //  Test for Domain User
    test.hostname.sendKeys(domainData.hostname);
    test.username.sendKeys(domainData.username);
    test.password.sendKeys(domainData.password);
    test.logButton.click();
    browser.sleep(500);

    role = browser.findElement(by.className("role ng-binding"));
    expect(role.getText()).toEqual("DOMAIN USER");

    incoming = element.all(by.className("text-center button-label ng-binding")).get(0);
    outgoing = element.all(by.className("text-center button-label ng-binding")).get(1);
    expect(incoming.getText()).toEqual("Incoming Filtering Quarantine");
    expect(outgoing.getText()).toEqual("Outgoing Filtering Quarantine");

    menuButton = browser.findElement(by.className("button button-icon icon ion-navicon"));
    menuButton.click();
    browser.sleep(500);

    logoutButton = element(by.css('button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior'));
    logoutButton.click();
    browser.sleep(500);

    OKButton = element(by.css(".button.ng-binding.button-positive"));
    OKButton.click();
    browser.sleep(500);

    //  Test for Email User
    test.hostname.sendKeys(emailData.hostname);
    test.username.sendKeys(emailData.username);
    test.password.sendKeys(emailData.password);
    test.logButton.click();
    browser.sleep(500);

    role = browser.findElement(by.className("role ng-binding"));
    expect(role.getText()).toEqual("EMAIL USER");

    incoming = element.all(by.className("text-center button-label ng-binding")).get(0);
    //outgoing = browser.findElement(by.className("text-center button-label ng-binding")).get(1);
    expect(incoming.getText()).toEqual("Incoming Filtering Quarantine");
    expect(element.all(by.className("text-center button-label ng-binding")).count()).toBe(1);

    menuButton = browser.findElement(by.className("button button-icon icon ion-navicon"));
    menuButton.click();
    browser.sleep(500);

    logoutButton = element(by.css('button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior'));
    logoutButton.click();
    browser.sleep(500);

    OKButton = element(by.css(".button.ng-binding.button-positive"));
    OKButton.click();
    browser.sleep(500);

    //  Test for AdminUser
    test.hostname.sendKeys(adminData.hostname);
    test.username.sendKeys(adminData.username);
    test.password.sendKeys(adminData.password);
    test.logButton.click();
    browser.sleep(500);

    var errorMessage = element(by.xpath('/html/body/div[3]/div/div[2]'));
    expect(errorMessage.getText()).toEqual("Sorry, admin users are not able to use this app yet. Please log in as a domain or email user.");

    var closingButton = element(by.xpath('/html/body/div[3]/div/div[3]/button'));
    closingButton.click();
    browser.sleep(500);

    test.hostname.clear();
    test.username.clear();
    test.password.clear();

  });

});