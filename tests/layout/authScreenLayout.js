var LoginPage = require('.././dependencies/LoginPageObject.js');


describe('Verify Login page Layout', function() {

    //  Initialize login page
    var page = new LoginPage();

    it('Login Page Layout checking', function() {

        //  Open app
        browser.get('http://localhost:8100/#/login');

        //  Checking the presence of the logo
        expect(page.logo.isPresent()).toBeTruthy();

        //  Checking the hostname for being unfilled
        expect(page.hostname.getText()).toEqual('');

        //  Checking the username for being unfilled
        expect(page.user.getText()).toEqual('');

        //  Checking the password for being unfilled
        expect(page.password.getText()).toEqual('');

        //  Checking the box for being unchecked
        expect(page.reminder.isSelected()).toBeFalsy();

        //  Checking the presence of the log in button 
        expect(page.logbutton.isPresent()).toBeTruthy();

    });
});