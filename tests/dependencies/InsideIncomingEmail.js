var imailLayout = function() {
    this.sentLabel = element.all(by.cssContainingText(".header-name","sent")).get(0);
    this.fromLabel = element.all(by.cssContainingText(".header-name","from")).get(0);
    this.toLabel = element.all(by.cssContainingText(".header-name","to")).get(0);
    this.releaseBtn =  element.all(by.css(".button.button-clear")).get(0);
    this.removeBtn = element.all(by.css(".button.button-clear")).get(1);
    this.moreActButton = element(by.cssContainingText(".button.button-clear.disable-user-behavior","More"));
    this.mabRelease =element(by.cssContainingText(".item.ng-binding.disable-user-behavior",'Release'));
    this.plainType = element.all(by.cssContainingText(".tab-item.disable-user-behavior","Plain")).get(0);
    this.normalType = element.all(by.cssContainingText(".tab-item.disable-user-behavior",'Normal')).get(0);
    this.rawType =element.all(by.cssContainingText(".tab-item.disable-user-behavior",'Raw')).get(0);
    this.mabWhiteAndRelease=element(by.cssContainingText(".item.ng-binding.disable-user-behavior",'Whitelist and release'));
    this.mabRelAndTrain = element(by.cssContainingText(".item.ng-binding.disable-user-behavior",'Release and train'));
    this.mabRemove=element(by.cssContainingText(".item.ng-binding.disable-user-behavior",'Remove'));
    this.mabBlackAndRemove=element(by.cssContainingText(".item.ng-binding.disable-user-behavior",'Blacklist and remove'));
    this.mailContent = element(by.css(".scroll-view.ionic-scroll.scroll-y"));
};
module.exports=imailLayout;