var dashPage = function() {
    this.leftButton = element.all(by.css(".button.button-icon.icon.ion-navicon.disable-user-behavior")).get(0);
    this.logoutButton = element(by.css("button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior"));
    this.loginCheck = element(by.cssContainingText('.col.text-center','Your available products'));
    this.incoming = element.all(by.css(".item-icon-right.menu-item.item.item-complex")).get(0);
    this.outgoing = element.all(by.css(".item-icon-right.menu-item.item.item-complex")).get(1);
    this.bigIncoming = element.all(by.css(".button.button-full.menu-item")).get(0);
    this.bigOutgoing = element.all(by.css(".button.button-full.menu-item")).get(1);
    this.right_arrow = element(by.css(".button.button-icon.icon.ion-ios-arrow-right"));
    this.copyRight = element(by.cssContainingText("col.text-center.ng-binding.firepath-matching-node",'© 2017 SpamExperts'));
    this.role = element(by.css(".custom-header-spacing"));
    this.cancelButton=element(by.css(".button.ng-binding.button-default"));
    this.okButton=element(by.css(".button.ng-binding.button-positive"));
};
module.exports=dashPage;