var LoginPage = function() { //create an object with the 5 elements from the 
    //log in page, extracting their position. Will be useful in the future.


    this.hostname = element(by.model('data.hostname'));
    this.user = element(by.model('data.username'));
    this.password = element(by.model('data.password'));
    this.reminder = element.all(by.model('data.remember')).get(0);
    this.logbutton = element(by.css('.button.button-block.button-dark.se-bold.disable-user-behavior'));
};
var dashPage = function() {
    this.leftButton = element(by.css('.button.button-icon.icon.ion-navicon'));
    this.logoutButton = element(by.css('button.button-block.button-light.metallic-border.log-out-button.disable-user-behavior'));
    this.loginCheck = element(by.css('.dashboard'));
    this.incoming=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[1]/ion-content/div[2]/ion-content/div[1]/div[2]/div/ion-list/div/div[1]/ion-item/a'));
    this.bigIncoming=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[1]/ion-content/div[2]/ion-content/div[1]/div[2]/div[1]/a'));
    this.bigOutgoing=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[1]/ion-content/div[2]/ion-content/div[1]/div[2]/div[2]/a'));

    this.outgoing=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[1]/ion-content/div[2]/ion-content/div[1]/div[2]/div/ion-list/div/div[2]/ion-item/a'));
    this.ioleftButton=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-header-bar/div[1]/button'));
    this.ibuttonMessage=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-header-bar/div[2]/div/div[1]/div'));
    this.obuttonMessage=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-header-bar/div[2]/div/div[1]/div'));
    this.iRefresher=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[2]/ion-content/div[1]/ion-list/div/ion-item'));
    this.oRefresher=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-content/div[1]/ion-list/div/ion-item'));
   

};


var iSearchPanel= function(){

this.isearchButton=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu-content/ion-nav-view/ion-view[3]/ion-header-bar/div[3]/button'));
this.idomainSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[1]/div/div/label[1]/span[2]/input'));
this.isenderSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[1]/div/div/label[2]/span[2]/input'));
this.irecipientSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[1]/div/div/label[3]/span[2]/input'));
this.ihourSearch= element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[1]/div/div/label[4]/div/button[1]'));
this.iweekSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[1]/div/div/label[4]/div/button[2]'));
this.imonthSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[1]/div/div/label[4]/div/button[3]'));
this.iclearSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[2]/div/button[2]'));
this.istartSearch=element(by.xpath('/html/body/ion-nav-view/ion-side-menus/ion-side-menu[2]/ui-view/ion-view/ion-content/div[1]/div[2]/div/button[1]'));
};


var dashAlert = function() {
    this.alertButtonOk = element(by.css('.button.ng-binding.button-positive'));
};
function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}
function addCredentials(Obj) {
    //The three fields should be provided with valid data

    Obj.hostname.sendKeys('server1.test39.simplyspamfree.com');
    Obj.user.sendKeys('mobile_app');
    Obj.password.sendKeys('wer123');
}
describe('mobile app login page', function() {
    
    var Obj = new LoginPage(); // initialize an object//
    var alert = new dashAlert(); //initialize the Popup//
    var logged=new dashPage();
    var search=new iSearchPanel();

   

    it('should display sugestive error messages', function() {
        
        browser.get('http://localhost:8101/#/login');
        addCredentials(Obj);
        Obj.logbutton.click();
        expect(logged.loginCheck.isPresent()).toBeTruthy();
      
    logged.bigIncoming.click();
    browser.navigate().back();
	logged.bigOutgoing.click();

	browser.sleep(1000);
	search.isearchButton.click();
	browser.sleep(1000);
    search.idomainSearch.sendKeys('cutotulaltceva');
    search.isenderSearch.sendKeys('ceva');
    search.irecipientSearch.sendKeys('altceva');
    search.ihourSearch.click();
    search.iweekSearch.click();
    search.imonthSearch.click();
    search.iclearSearch.click();
    search.istartSearch.click();












  

});
});