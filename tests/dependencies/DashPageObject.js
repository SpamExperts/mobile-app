var dashPage = function() {
    this.leftButton = element(by.css(".button.button-icon.icon.ion-navicon"));
    this.logoutButton = element(by.css("button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior"));
    this.loginCheck = element(by.cssContainingText('.col.text-center','Your available products'));
    this.incoming = element(by.css(".item-icon-right.menu-item.item.item-complex"));
    this.outgoing = element(by.css(".item-icon-right.menu-item.item.item-complex"));
    this.bigIncoming = element(by.css(".button.button-full.menu-item"));
    this.bigOutgoing = element(by.css(".button.button-full.menu-item"));
    this.right_arrow = element(by.css(".button.button-icon.icon.ion-ios-arrow-right"));
    this.copyRight = element(by.css("col.text-center.ng-binding.firepath-matching-node"));
    this.role = element(by.css(".custom-header-spacing"));
    this.cancelButton=element(by.css(".button.ng-binding.button-default"));
    this.okButton=element(by.css(".button.ng-binding.button-positive"));
};
module.exports=dashPage;