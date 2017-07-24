exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'elementCheck.js',
        'dataType.js',
        'keepLogin.js',
        'alertCheck.js',
        'inexistingUser.js',
        'successfulLogin.js',
        'usersRestrictedLogin.js'
    ],
    onPrepare: function() {
        browser.driver.manage().window().setSize(1680, 1050);
    },
    capabilities: {
        browserName: 'chrome',
        name: 'Unnamed Job',
        count: 1,
        shardTestFiles: false,
        maxInstances: 10,
        chromeOptions: {
            'mobileEmulation': {
                'deviceName': 'Galaxy S5'
            }
        }
    },


}