var LoginPage = function() {

    //	Create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.
    this.logo = element(by.css('.se-icon'));
    this.hostname = element(by.model('data.hostname'));
    this.user = element(by.model('data.username'));
    this.password = element(by.model('data.password'));
    this.reminder = element.all(by.model('data.remember')).get(0);
    this.logbutton = element(by.buttonText('Log in'));

};

module.exports = LoginPage;