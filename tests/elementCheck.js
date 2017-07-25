var LoginPage = function() { //create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.

    this.logo = element(by.xpath("//img[contains(@class,'se-icon')]"));
    this.hostname = element(by.xpath("//input[contains(@ng-model,'data.hostname')]"));
    this.user = element(by.xpath("//input[contains(@ng-model,'data.username')]"));
    this.password = element(by.xpath("//input[contains(@ng-model,'data.password')]"));
    this.reminder = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logbutton = element(by.xpath("//button[contains(@on-tap,'login(data)')]"));
};


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