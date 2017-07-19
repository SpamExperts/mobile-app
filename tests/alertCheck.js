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
     this.alertButton= element(by.css('.button.ng-binding.button-positive'));
};
//At the moment the app returns just 1 type of message when the fields are empty
//or inappropriate
function log_check_close(Obj,alert,message){

 		 Obj.logbutton.click();
		 expect(alert.alertBody.getText()).toEqual(message);
		 alert.alertButton.click(); //close the alert
		 
		 Obj.hostname.clear(); //clear the hostname field for the next test
		 Obj.user.clear();
}

 //clear all the fields for assuring a clean and appropriate test
function field_cleaner(Obj){
		 Obj.hostname.clear();
   		 Obj.password.clear();
   		 Obj.user.clear();
}


//The error message that is checked it's the one the application returns at the moment the test are written. 
//If there will be an update the error message could be changed depending on the
//case it envolves.

describe('mobile app login page', function() {
	
	var Obj=new LoginPage(); // initialize an object//
	var alert= new AlertPop_up(); //initialize the Popup//
	var msg='Please check your credentials!';

  		it('should display sugestive error messages', function() {
    	browser.get('http://localhost:8100/#/login');
		
		//click the log in button with empty fields
   		 log_check_close(Obj,alert,msg);
   		

		 //click the log in button just with the hostname field, filled
   		 Obj.hostname.sendKeys('example.com');
   		 log_check_close(Obj,alert,msg);

   	     //click the log in button just with the user field, filled
   		 Obj.user.sendKeys('adminTest');
   	     log_check_close(Obj,alert,msg);
   		
   		//click the log in button just with the password field, filled
   		 Obj.password.sendKeys('qwertyuiop');
   		 log_check_close(Obj,alert,msg);

   		 field_cleaner(Obj);

   		 //click the log in button just with the hostname and user field, filled
   		 Obj.hostname.sendKeys('example.com');
   		 Obj.user.sendKeys('adminTest');
   		 log_check_close(Obj,alert,msg);

   		  
   		 field_cleaner(Obj);

   		 //click the log in button just with the password and user field, filled
   		 Obj.password.sendKeys('12345678');
   		 Obj.user.sendKeys('adminTest');
   		 log_check_close(Obj,alert,msg);

   		
   	   	 field_cleaner(Obj);

   		 //click the log in button just with the hostname and password field, filled
 		 Obj.hostname.sendKeys('example.com');
   		 Obj.password.sendKeys('12345678');
   		 log_check_close(Obj,alert,msg);




});
});