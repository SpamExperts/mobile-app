var PageData = function()   {
    this.logo = browser.findElement(by.xpath("//img[contains(@src,'logo.svg')]"));
    this.hostname = browser.findElement(by.xpath("//input[contains(@placeholder,'Hostname')]"));
    this.username = browser.findElement(by.xpath("//input[contains(@placeholder,'User')]"));
    this.password = browser.findElement(by.xpath("//input[contains(@placeholder,'Password')]"));
    this.rememberButton = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logButton = browser.findElement(by.xpath("//button[contains(.,'Log in')]"));
};

var InputData = function(hostname, username, password)  {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
}


describe('Verify Data Type', function() {

  it('Check:', function() {

    // Open page
    browser.get('http://localhost:8100/#/login'); 

    var test = new PageData();
    var dataFile = require('./dataForSuccessfulLogin.json')
    var data = new InputData(dataFile.hostname, dataFile.username, dataFile.password);

    test.hostname.sendKeys(data.hostname);
    test.username.sendKeys(data.username);
    test.password.sendKeys(data.password);
    test.rememberButton.click();
    test.logButton.click();

    browser.sleep(700);
    var success = browser.findElement(by.xpath("//h4[contains(.,'Your available products')]"));
    expect(success.getTagName()).toBe('h4');
    browser.sleep(700);
    
    var menuButton = browser.findElement(by.xpath("//button[contains(@class,'button button-icon icon ion-navicon')]"));
	menuButton.click();

    var logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    logoutButton.click();
    browser.sleep(800);

    var OKButton = element(by.xpath("//button[contains(.,'OK')]"));
    OKButton.click();
    browser.sleep(800);

    test.hostname.clear();
    test.username.clear();
    test.password.clear();
    test.rememberButton.click();
  });

});