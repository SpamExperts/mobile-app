var LoginPage = function() { //create an object with the 6 elements from the log in page, extracting their position. Will be useful in the future.

    this.logo = element(by.xpath("//img[contains(@class,'se-icon')]"));
    this.hostname = element(by.xpath("//input[contains(@ng-model,'data.hostname')]"));
    this.user = element(by.xpath("//input[contains(@ng-model,'data.username')]"));
    this.password = element(by.xpath("//input[contains(@ng-model,'data.password')]"));
    this.reminder = element.all(by.xpath("//label[contains(@ng-model,'data.remember')]")).get(0);
    this.logbutton = element(by.xpath("//button[contains(@on-tap,'login(data)')]"));
};
var dashPage = function() {
    this.leftButton = element(by.xpath("//button[contains(@class,'button button-icon icon ion-navicon')]"));
    this.logoutButton = element(by.xpath("//button[contains(@on-tap,'logout()')]"));
    this.loginCheck = element(by.xpath("//h4[contains(.,'Your available products')]"));
    this.incoming=element(by.xpath("//a[contains(.,'Incoming Filtering Quarantine')]"));
    this.outgoing=element(by.xpath("//a[contains(.,'Outgoing Filtering Quarantine')]"));
    this.bigIncoming=element(by.xpath("//a[@ui-sref='main.incomingLogSearch']"));
    this.bigOutgoing=element(by.xpath("//a[@ui-sref='main.outgoingLogSearch']"));

    
    this.ioleftButton=element(by.xpath("//button[@class='button button-icon icon ion-navicon disable-user-behavior']"));
    this.ibuttonMessage=element(by.xpath("//div[contains(.,'Incoming spam messages')]"));
    this.obuttonMessage=element(by.xpath("//div[contains(.,'Outgoing spam messages')]"));
    this.iRefresher=element(by.xpath("//ion-item[@ng-if='!loadingEntries && !messageEntries.length']"));
    this.oRefresher=element(by.xpath("//ion-item[@ng-if='!loadingEntries && !messageEntries.length']"));

};


var iSearchPanel= function(){

this.isearchButton=element.all(by.xpath("//button[@on-tap='toggleRightMenu($event)']")).get(1);
this.idomainSearch=element(by.xpath("//input[contains(@placeholder,'Domain')]"));
this.isenderSearch=element(by.xpath("//input[contains(@placeholder,'Sender')]"));
this.irecipientSearch=element(by.xpath("//input[contains(@placeholder,'Recipient')]"));
this.ihourSearch= element(by.xpath("//button[contains(@on-tap,'past24Hours()')]"));
this.iweekSearch=element(by.xpath("//button[contains(@on-tap,'pastWeek()')]"));
this.imonthSearch=element(by.xpath("//button[contains(@on-tap,'pastMonth()')]"));
this.iclearSearch=element(by.xpath("//button[contains(@on-tap,'clearSearch()')]"));
this.istartSearch=element(by.xpath("//button[contains(@on-tap,'doSearch()')]"));
};


var dashAlert = function() {
    this.alertButtonOk = element(by.xpath("//button[contains(@class,'button ng-binding button-positive')]"));
};
function field_cleaner(Obj) {
    Obj.hostname.clear();
    Obj.password.clear();
    Obj.user.clear();
}
function addCredentials(Obj) {
    //The three fields should be provided with valid data
field_cleaner(Obj);
    Obj.hostname.sendKeys('server1.test13.simplyspamfree.com');
    Obj.user.sendKeys('mobile_app');
    Obj.password.sendKeys('wer123');
}
describe('mobile app login page', function() {
    
    var Obj = new LoginPage(); // initialize an object//
    var alert = new dashAlert(); //initialize the Popup//
    var logged=new dashPage();
    var search=new iSearchPanel();

   

    it('should display sugestive error messages', function() {
        
        browser.get('http://localhost:8100/#/login');
        addCredentials(Obj);
        Obj.logbutton.click();
        expect(logged.loginCheck.isPresent()).toBeTruthy();

    logged.bigIncoming.click();
 	expect(logged.ibuttonMessage.isPresent()).toBeTruthy();
    browser.navigate().back();
  
	logged.bigOutgoing.click();
	expect(logged.obuttonMessage.isPresent()).toBeTruthy();
	search.isearchButton.click();

    search.idomainSearch.sendKeys('cutotulaltceva');
    search.isenderSearch.sendKeys('ceva');
    search.irecipientSearch.sendKeys('altceva');
    	console.log('4');


    search.ihourSearch.click();
	console.log('x');

    search.iweekSearch.click();
    search.imonthSearch.click();
    search.iclearSearch.click();
    search.istartSearch.click();












  

});
});