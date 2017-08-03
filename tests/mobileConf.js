exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [       
         'authScreenKeepLogin.js',
         'authScreenUnsuccessfulAtempts_2.js',
         'authScreenUnsuccessfulAtempts_3.js',
         
         'authScreenLayout.js', // border
        // 'usersRestrictedLogin.js',
         //'dataType.js',
         //'successfulLogin.js',
        'superAdminLevelLayout.js',
  		'emailLevelLayout.js',
        'searchPanelQuickSelect.js',
        'domainLevelFunctionality.js',
        'superAdminLevelFunctionality.js',
        //'domainUserLayout.js',
      
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
