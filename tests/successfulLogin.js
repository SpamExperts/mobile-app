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
    var dataFile = require('./dataForSuccessfulLogin.json')
    var data = new InputData(dataFile.hostname, dataFile.username, dataFile.password);

    test.hostname.sendKeys(data.hostname);
    test.username.sendKeys(data.username);
    test.password.sendKeys(data.password);
    test.rememberButton.click();
    test.logButton.click();

    browser.sleep(500);
    var success = browser.findElement(by.className('dashboard'));
    expect(success.getTagName()).toBe('div');
  });

});