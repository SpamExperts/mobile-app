var PageData = function() {
    this.logo = element(by.xpath("//img[contains(@src,'logo.svg')]"));
    this.hostname = element(by.xpath("//input[contains(@placeholder,'Hostname')]"));
    this.username = element(by.xpath("//input[contains(@placeholder,'User')]"));
    this.password = element(by.xpath("//input[contains(@placeholder,'Password')]"));
    this.rememberButton = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logButton = element(by.xpath("//button[contains(.,'Log in')]"));
};

var InputData = function(hostname, username, password) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
};

var HttpBackend = require('httpbackend');
var backend = null;


var test = new PageData();
var dataFile = require('./dataForSuccessfulLogin.json');
var data = new InputData(dataFile.hostname, dataFile.username, dataFile.password);


describe('Verify Successful Login', function() {

    beforeEach(function() {
        backend = new HttpBackend(browser);
        browser.manage().timeouts().implicitlyWait(2000);
    });

    afterEach(function() {
        backend.clear();
    });

    it('Check if popup if the user does not exist', function() {
        browser.ignoreSynchronization = true;

        backend.whenGET('/rest/auth/token').respond({
            "success": true,
            "body": {
                "messageQueue": {
                    "error": ["A record with the supplied identity could not be found."],
                    "notice": [],
                    "success": []
                }
            },
            "userData": []
        });

        // Open page
        browser.get('http://localhost:8100/#/login');

        test.hostname.clear();
        test.username.clear();
        test.password.clear();

        test.hostname.sendKeys(data.hostname);
        test.username.sendKeys(data.username);
        test.password.sendKeys(data.password);
        test.rememberButton.click();
        test.logButton.click();

        var alert = {
            alertBody: element(by.xpath("//div[contains(@class,'popup-body')]")),
            alertButton: element(by.xpath("//button[contains(@ng-click,'event)')]"))
        };

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(alert.alertButton), 20000)
            .then(function() {
                expect(alert.alertBody.getText()).toEqual('A record with the supplied identity could not be found.');
                alert.alertButton.click(); //close the alert
            });
    });


    it('Check login worked:', function() {
        browser.ignoreSynchronization = true;

        backend.whenGET('/rest/auth/token').respond({
            "success": true,
            "body": {
                "messageQueue": []
            },
            "userData": {
                "id": "5",
                "username": "example.com",
                "email": "test@example.com",
                "role": "domain",
                "internal": "0",
                "status": "active",
                "domainslimit": "0",
                "permissions": "0",
                "api_admin_id": null,
                "lastlogin": "2017-07-27 17:22:28",
                "is_trial": "0",
                "show_preview": "0",
                "login_notification_type": null,
                "parentid": null,
                "is_using_mobile": true
            },
            "token": "27c34cd2286c1a5e9ac3dbc724b357403926ba43"
        });

        // Open page
        browser.get('http://localhost:8100/#/login');


        test.hostname.clear();
        test.username.clear();
        test.password.clear();

        test.hostname.sendKeys(data.hostname);
        test.username.sendKeys(data.username);
        test.password.sendKeys(data.password);
        test.rememberButton.click();
        test.logButton.click();

        // Check if dashboard is displayed

    });

});