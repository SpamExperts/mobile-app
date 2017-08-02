var dashPage = function() {


    this.logoutButton = element(by.css("button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior"));
    this.incoming = element.all(by.css(".item-icon-right.menu-item.item.item-complex")).get(0);
    this.outgoing = element.all(by.css(".item-icon-right.menu-item.item.item-complex")).get(1);
    this.copyRight = element.all(by.cssContainingText("col.text-center.ng-binding",'© 2017 SpamExperts')).get(1);
    this.right_arrow = element(by.css(".button.button-icon.icon.ion-ios-arrow-right"));
    this.cancelButton = element(by.css(".button.ng-binding.button-default"));
    this.okButton = element(by.css(".button.ng-binding.button-positive"));

    this.leftButton = element.all(by.css(".button.button-icon.icon.ion-navicon")).get(0);
    this.bigIncoming = element.all(by.css(".button.button-full.menu-item")).get(0);
    this.bigOutgoing = element.all(by.css(".button.button-full.menu-item")).get(1);
    this.bigcopyRight = element.all(by.cssContainingText("col.text-center.ng-binding",'© 2017 SpamExperts')).get(0);

    this.role = element(by.css(".custom-header-spacing"));
    this.loginCheck = element(by.cssContainingText('.col.text-center','Your available products'));

};
module.exports = dashPage;