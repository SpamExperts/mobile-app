 var emailPopup = function() {

     this.cancelButton = element(by.css('.button.ng-binding.button-default'));
     this.okButton = element(by.css('.button.ng-binding.button-positive'));
     this.alertHead = element(by.css('.popup-title.ng-binding'));
     this.alertBody = element.all(by.css('.popup-body>span')).get(0);

 };
 module.exports = emailPopup;