var omailButtons = function() {
    this.selectButton = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[2]/div[2]/label"));
    this.releaseButton = element(by.xpath("(//div[@ng-repeat='action in barActions'])[1]"));
    this.removeButton = element(by.xpath("(//div[@ng-repeat='action in barActions'])[2]"));
    this.moreActButton = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[1]"));
    this.mabUnselect = element(by.xpath("(//button[@class='button button-clear disable-user-behavior'])[2]"));
    this.mabRelease = element(by.xpath("(//li[@on-tap='processAction(action)'])[1]"));
    this.mabRelAndTrain = element(by.xpath("(//li[@on-tap='processAction(action)'])[2]"));
    this.mabRemove = element(by.xpath("(//li[@on-tap='processAction(action)'])[3]"));
    this.mailBody = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]"));
    this.category = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]/div[1]/div[2]/span"));
    this.mailDate = element(by.xpath("html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/div/ion-item[1]/div/div[1]/div[1]/div[1]"));
    this.popup = element(by.xpath("//div[contains(.,'Please filter the search using a domain')]"));
    this.closePopup = element(by.xpath("//i[contains(@class,'icon ion-close-round icon-accessory disable-user-behavior')]"));
};
module.exports = omailButtons;