exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        './screen/authScreenKeepLogin.js',
        './screen/authScreenUnsuccessfulAtempts_2.js',
        './screen/authScreenUnsuccessfulAtempts_3.js',   
        './screen/authScreenSuccessfulAtempt.js', 
        './screen/authScreenUnsuccessfulAtempts.js'
    ],
    onPrepare: function() {
        browser.driver.manage().window().setSize(350, 780);
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
