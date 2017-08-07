var LoginPage=require('.././dependencies/LoginPageObject.js');


describe('mobile app login page', function() {

    var Obj = new LoginPage(); // initialize an object//

    it('PageLayout checking', function() {

        browser.get('http://localhost:8100/#/login');


        expect(Obj.logo.isPresent()).toBeTruthy(); //checking the presence of the logo//
        expect(Obj.hostname.getText()).toEqual(''); //checking the hostname for being unfilled//
        expect(Obj.user.getText()).toEqual(''); //checking the username for being unfilled//
        expect(Obj.password.getText()).toEqual(''); //checking the password for being unfilled//
        expect(Obj.reminder.isSelected()).toBeFalsy(); //checking the box for being unchecked//
        expect(Obj.logbutton.isPresent()).toBeTruthy(); //checking the presence of the log in button
    });
});