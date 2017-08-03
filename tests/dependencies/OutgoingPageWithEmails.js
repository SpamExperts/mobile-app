var omailButtons = function() {
    this.selectButton = element(by.css(".checkbox-square.checkbox-dark.no-border.item.item-checkbox.disable-user-behavior.ng-valid.ng-not-empty"));
    this.releaseButton = element.all(by.css(".button.button-clear")).get(0);
    this.removeButton = element.all(by.css(".button.button-clear")).get(1);
    this.moreActButton = element.all(by.css(".button.button-clear.disable-user-behavior")).get(0);
    this.mabUnselect = element.all(by.css(".button.button-clear.disable-user-behavior")).get(1);
    this.mabRelease = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior","Release")).get(0);
    this.mabRelAndTrain = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior","Release and train")).get(0)
    this.mabRemove = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior","Remove")).get(0)
    this.mailBody = element.all(by.css("ion-item.se-message.item.disable-user-behavior")).get(0);
    this.category = element.all(by.css(".metallic-border.main-class.ng-binding")).get(0);
    this.mailDate = element.all(by.css(".col.col-80.message-title.ng-binding")).get(0);
    this.accesNotPermited=element(by.cssContainingText(".ng-binding",'You are not allowed to view this message'));
};
module.exports=omailButtons;