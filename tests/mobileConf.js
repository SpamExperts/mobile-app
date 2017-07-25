exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [       
        'keepLogin.js',
        'alertCheck.js',
        'dashPageButtons.js',
        'inexistingUser.js',
        'elementCheck.js', // border
        'dataType.js',
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