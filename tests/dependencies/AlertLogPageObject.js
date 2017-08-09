var AlertPop_up = function() {

    this.alertHead = element(by.css('.popup-title.ng-binding'));
    this.alertBody = element(by.css('.popup-body>span'));
    this.alertButton = element(by.css('[ng-click="$buttonTapped(button, $event)"]'));

};

module.exports = AlertPop_up;