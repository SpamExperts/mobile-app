var omailLayout = function() {
    this.sentLabel = element.all(by.cssContainingText(".header-name", "sent")).get(0);
    this.fromLabel = element.all(by.cssContainingText(".header-name", "from")).get(0);
    this.toLabel = element.all(by.cssContainingText(".header-name", "to")).get(0);
    this.releaseBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[2]"));
    this.removeBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[3]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.plainType = element.all(by.cssContainingText(".tab-item.disable-user-behavior", "Plain")).get(0);
    this.normalType = element.all(by.cssContainingText(".tab-item.disable-user-behavior", 'Normal')).get(0);
    this.rawType = element.all(by.cssContainingText(".tab-item.disable-user-behavior", 'Raw')).get(0);
    this.date = element(by.xpath("//h5[@class='ng-binding']"));
    this.mailContent = element(by.css(".scroll-view.ionic-scroll.scroll-y"));
};

module.exports = omailLayout;