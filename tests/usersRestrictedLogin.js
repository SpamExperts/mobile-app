var LoginPage = require('./dependencies/LoginPageObject.js');

var InputData = function(hostname, username, password)  {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
}

function field_cleaner(test) {
    //browser.sleep(10000);
    test.hostname.clear();
    test.user.clear();
    test.password.clear();
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

    var test = new LoginPage();
    var data = require('./dataForUserRestrictedLogin.json');
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

    role = element(by.xpath("(//span[contains(.,'Super-Admin')])[1]"));
    browser.wait(EC.visibilityOf(role), 5000).then(function(){
        expect(role.getText()).toEqual("SUPER-ADMIN");
    });

    incoming = element.all(by.xpath("//a[contains(.,'Incoming Filtering Quarantine')]"));
    outgoing = element.all(by.xpath("//a[contains(.,'Outgoing Filtering Quarantine')]"));
    expect(incoming.isPresent()).toBe(true);
    expect(outgoing.isPresent()).toBe(true);
 
    menuButton = element(by.xpath("//ion-header-bar//button[contains(@class,'ion-navicon')]"));
    browser.wait(EC.visibilityOf(menuButton), 5000).then(function(){
       expect(menuButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(menuButton), 5000).then(function(){
       menuButton.click();
    });

    logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    browser.wait(EC.elementToBeClickable(logoutButton), 5000).then(function(){
        logoutButton.click();
    });

    OKButton = element(by.xpath("//button[contains(.,'OK')]"));
    browser.wait(EC.elementToBeClickable(OKButton), 5000).then(function(){
        OKButton.click();
    });
 
    //  Test for Domain User 
    field_cleaner(test);
    test.hostname.sendKeys(domainData.hostname);
    test.user.sendKeys(domainData.username);
    test.password.sendKeys(domainData.password);
    test.logbutton.click();

    role = element(by.xpath("(//span[contains(.,'Domain User')])[1]"));
    browser.wait(EC.visibilityOf(role), 5000).then(function(){   
        expect(role.getText()).toEqual("DOMAIN USER");
    });
 
    expect(incoming.isPresent()).toBe(true);
    expect(outgoing.isPresent()).toBe(true);

    menuButton = element(by.xpath("//ion-header-bar//button[contains(@class,'ion-navicon')]"));
    browser.wait(EC.visibilityOf(menuButton), 5000).then(function(){
       expect(menuButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(menuButton), 5000).then(function(){
       menuButton.click();
    });

    logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    browser.wait(EC.elementToBeClickable(logoutButton), 5000).then(function(){
        logoutButton.click();
    });

    OKButton = element(by.xpath("//button[contains(.,'OK')]"));
    browser.wait(EC.elementToBeClickable(OKButton), 5000).then(function(){
        OKButton.click();
    });
 
    //  Test for Email User
    field_cleaner(test);
    test.hostname.sendKeys(emailData.hostname);
    test.user.sendKeys(emailData.username);
    test.password.sendKeys(emailData.password);
    test.logbutton.click();


    role = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view/div/div/div/span"));
    browser.wait(EC.visibilityOf(role), 5000).then(function(){ 
        expect(role.getText()).toEqual("EMAIL USER");
    });

    expect(incoming.isPresent()).toBe(true);
    expect(outgoing.isPresent()).toBe(false);

    menuButton = element(by.xpath("//ion-header-bar//button[contains(@class,'ion-navicon')]"));
    browser.wait(EC.visibilityOf(menuButton), 5000).then(function(){
       expect(menuButton.isPresent()).toBe(true);
    });
    browser.wait(EC.elementToBeClickable(menuButton), 5000).then(function(){
       menuButton.click();
    });

    logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    browser.wait(EC.elementToBeClickable(logoutButton), 5000).then(function(){
        logoutButton.click();
    });

    OKButton = element(by.xpath("//button[contains(.,'OK')]"));
    browser.wait(EC.elementToBeClickable(OKButton), 5000).then(function(){
        OKButton.click();
    });
 
    //  Test for AdminUser
    field_cleaner(test);
    test.hostname.sendKeys(adminData.hostname);
    test.user.sendKeys(adminData.username);
    test.password.sendKeys(adminData.password);
    test.logbutton.click();

    var errorMessage = element(by.xpath('/html/body/div[3]/div/div[2]'));
    browser.wait(EC.visibilityOf(errorMessage), 5000).then(function(){ 
        expect(errorMessage.getText()).toEqual("Sorry, admin users are not able to use this app yet. Please log in as a domain or email user.");
    });

    var closingButton = element(by.xpath('/html/body/div[3]/div/div[3]/button'));
    browser.wait(EC.elementToBeClickable(closingButton), 5000).then(function(){ 
        closingButton.click();
    });

 
    browser.wait(EC.visibilityOf(test.logbutton), 5000).then(function(){
        test.hostname.clear();
        test.user.clear();
        test.password.clear();
    });

  });

});