exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'authScreenKeepLogin.js',
        'authScreenUnsuccessfulAtempts_2.js',
        'authScreenUnsuccessfulAtempts_3.js',   
        'authScreenSuccessfulAtempt.js', 
        'authScreenUnsuccessfulAtempts.js'
    ],
    onPrepare: function() {
        browser.driver.manage().window().setSize(1680, 1050);
    },
    capabilities: {
        browserName: 'chrome',
        name: 'Mobile app tests',
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
