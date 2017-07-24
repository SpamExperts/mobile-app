var PageData = function()   {

    this.logo = browser.findElement(by.className('se-icon'));
    this.hostname = browser.findElement(by.model('data.hostname'));
    this.username = browser.findElement(by.model('data.username'));
    this.password = browser.findElement(by.model('data.password'));
    this.rememberButton = element.all(by.model('data.remember')).get(0);
    this.logButton = browser.findElement(by.className('button button-block button-dark se-bold disable-user-behavior'));
}

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
    var dataFile = require('./dataFor_iU_kL.json')
    var data = new InputData(dataFile.domain[1], dataFile.username[1], dataFile.password[1]);

    test.hostname.sendKeys(data.hostname);
    test.username.sendKeys(data.username);
    test.password.sendKeys(data.password);
    test.rememberButton.click();
    test.logButton.click();

    browser.sleep(700);
    var success = browser.findElement(by.className('dashboard'));
    expect(success.getTagName()).toBe('div');
    browser.sleep(700);
    var menuButton = browser.findElement(by.className("button button-icon icon ion-navicon"));
	menuButton.click();

    var logoutButton = element(by.css('button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior'));
    logoutButton.click();
    browser.sleep(800);

    var OKButton = element(by.css(".button.ng-binding.button-positive"));
    OKButton.click();
    browser.sleep(800);
  });

});