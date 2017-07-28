exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [       
         'keepLogin.js',
         'alertCheck.js',
         'inexistingUser.js',
         'elementCheck.js', // border
        // 'usersRestrictedLogin.js',
         //'dataType.js',
         //'successfulLogin.js',
        'superAdminLayout.js',
  		  'emailUserLayout.js',
        'checkTimeButtons.js',
        //'domainUserLayout.js',
        'emailCheckCategory.js',
      
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