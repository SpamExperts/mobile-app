var msg1="Choosing 'Release and Train', for one or several messages, might adversely affect the ";
var msg2="quality of filtering for all the existing users.Please avoid any mistakes in your selection!";
var msg=msg1.concat(msg2);
var imailButtons = function() {

    this.selectButton = element(by.xpath("(//label[@ng-change='selectEntry($index, true)'])[1]"));
    this.releaseButton = element.all(by.css(".button.button-clear")).get(0);
    this.removeButton = element.all(by.css(".button.button-clear")).get(1);
    this.moreActButton = element.all(by.css(".button.button-clear.disable-user-behavior")).get(0);
    this.mabUnselect = element.all(by.css(".button.button-clear.disable-user-behavior")).get(1);
    this.mabRelease = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Release")).get(0);
    this.mabWhiteAndRelease = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Whitelist and release")).get(0);
    this.mabRelAndTrain = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Release and train")).get(0);
    this.mabRemove = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Remove")).get(0);
    this.mabBlackAndRemove = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Blacklist and remove")).get(0);
    this.mabPurgeQtn = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Purge Quarantine")).get(0);
    this.mabRemove = element.all(by.cssContainingText(".item.ng-binding.disable-user-behavior", "Remove")).get(0);
    this.mailBody = element(by.xpath("(//div[contains(@class,'col col-85')])[1]"));
    this.category = element.all(by.css(".metallic-border.main-class.ng-binding")).get(0);
    this.mailDate = element.all(by.css(".col.col-80.message-title.ng-binding")).get(0);
    this.popup = element(by.cssContainingText(".ng-binding", "Please filter the search using a domain"));
    this.closePopup = element(by.xpath("//i[contains(@class,'icon ion-close-round icon-accessory disable-user-behavior')]"));
    this.emailDeleteAction=element(by.cssContainingText('.ng-binding',"Deleting message(s). This might take a while depending on server load."));
    this.emailReleaseAction=element(by.cssContainingText('.ng-binding','Message(s) released succesfully'));
    this.emailRelAndTrain=element(by.cssContainingText('.ng-binding',msg));
};

module.exports = imailButtons;