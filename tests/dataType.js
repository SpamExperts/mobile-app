// spec.js
var PageData = function()	{

	this.logo = browser.findElement(by.className('se-icon'));
	this.hostname = browser.findElement(by.model('data.hostname'));
	this.username = browser.findElement(by.model('data.username'));
	this.password = browser.findElement(by.model('data.password'));
	this.rememberButton = element.all(by.model('data.remember')).get(0);
	this.logButton = browser.findElement(by.className('button button-block button-dark se-bold disable-user-behavior'));
}

var InputData = function(hostname, username, password)	{
	this.hostname = hostname;
	this.username = username;
	this.password = password;
}

function add() {

	var array = [];

	array.push(new InputData("test", "????", "qwe12"));				// Should say hostaname not correct
	array.push(new InputData("test", "????", "Qwe.23"));			// Should say hostname not correct
	array.push(new InputData("test", "username56", "qwe12"));		// Should say hostname not correct
	array.push(new InputData("test", "username56", "Qwe.23"));		// Should say hostname not correct
	array.push(new InputData("test.whatever.example.com", "????", "qwe12"));	// Should say username not correct
	array.push(new InputData("test.example.net", "????", "Qwe.23"));			// Should say username not correct
	array.push(new InputData("example.com", "username56", "Qw.12"));			// Should say password not correct - less that 6 chr.
	array.push(new InputData("example.com", "username56", "username56."));		// Should say password not correct - contains username
	array.push(new InputData("example.com", "username56", "Qwe123"));			// Should say password not correct - do not contain symbols
	array.push(new InputData("example.com", "mobile-app", "Qwe.23"));			// Successful !

	return array;
}

describe('Verify Page Layout', function() {

  it('Check:', function() {

    // Open page
    browser.get('http://192.168.1.152:8100/#/login'); 

    var test = new PageData();

    test.logButton.click();
    browser.sleep(500);
    var alert = element(by.css('.popup-body'));
    var alertButton = element(by.css('.button.ng-binding.button-positive'));
    browser.sleep(500);
    alertButton.click();
    browser.sleep(500);

    var data = [];
    data = add();

    for (var i = 0; i < data.length-1; i++){
    	var item = data[i];

    	//console.log(i);
    	test.hostname.sendKeys(item.hostname);
    	test.username.sendKeys(item.username);
    	test.password.sendKeys(item.password);
    	test.logButton.click();
    	browser.sleep(500);
    	expect(alert.getText()).toEqual('Oops! Something went wrong! Please try again later!');
    	alertButton.click();
    	browser.sleep(500);
    	test.hostname.clear();
    	test.username.clear();
    	test.password.clear();
    	browser.sleep(500);
    }

    	var item = data[i];
        test.hostname.sendKeys(item.hostname);
    	test.username.sendKeys(item.username);
    	test.password.sendKeys(item.password);
    	test.logButton.click();
    	browser.sleep(500);
    	expect(alert.getText()).toEqual('Oops! Something went wrong! Please try again later!');
    	alertButton.click();

  });

});