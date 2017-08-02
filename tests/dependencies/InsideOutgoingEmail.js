var omailLayout = function() {
    this.sentLabel = element(by.xpath("(//td[contains(@class,'header-name')])[1]"));
    this.fromLabel = element(by.xpath("(//td[contains(@class,'header-name')])[2]"));
    this.toLabel = element(by.xpath("(//td[contains(@class,'header-name')])[3]"));
    this.releaseBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[2]"));
    this.removeBtn = element(by.xpath("(//button[contains(@class,'button button-clear')])[3]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.plainType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Plain')]"));
    this.normalType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Normal')]"));
    this.rawType = element(by.xpath("//div[contains(@class,'user') and contains(.,'Raw')]"));
    this.date = element(by.xpath("//h5[@class='ng-binding']"));
    this.mailContent = element(by.css(".scroll-view.ionic-scroll.scroll-y"));
};
module.exports=omailLayout;