var LoginPage= function(){  //create an object with the 5 elements from the 
							//log in page, extracting their position. Will be useful in the future.

		
		this.hostname=element(by.model('data.hostname'));
		this.user=element(by.model('data.username'));
		this.password=element(by.model('data.password'));
		this.reminder=element.all(by.model('data.remember')).get(0);
		this.logbutton=element(by.css('.button.button-block.button-dark.se-bold.disable-user-behavior'));
	};
var AlertPop_up=function(){

	 this.alertBody= element(by.css('.popup-body')); 
     this.alertButton= element(by.css('button.ng-binding.button-positive'));
};
function log_check_close(Obj,alert){

 		 Obj.logbutton.click();
		 expect(alert.alertBody.getText()).toEqual('A record with the supplied identity could not be found.');
		 alert.alertButton.click(); //close the alert

}
function addCredentials(Obj){
	//The three fields should be provided with valid data
		 Obj.hostname.sendKeys('server1.test5.simplyspamfree.com');  
   		 Obj.user.sendKeys('inexistingUser');
   		 Obj.password.sendKeys('12345678');
}

//The error message that is checked it's the one the application returns at the moment the test are written. 
//If there will be an update the error message could be changed depending on the
//case it envolves.
//Here should be a feature allowing the soft to detect an inexisting user

describe('mobile app login page', function() {
	
	var Obj=new LoginPage(); // initialize an object//
	var alert= new AlertPop_up(); //initialize the Popup//

  		it('should not be able to login with an inexisting user', function() {
    	browser.get('http://localhost:8100/#/login');

    	 //The three fields should be provided with valid but deprecated data

    	 addCredentials(Obj);
		 log_check_close(Obj,alert);


   });
});