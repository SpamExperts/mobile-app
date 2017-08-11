# ![](img/se_logo.png) SpamExperts mobile app tests

### Setup Protractor

- Use npm to install Protractor globally with:
```bash
npm install -g protractor
```
- This will install two command line tools, `protractor` and `webdriver-manager`. Try running `protractor --version` to make sure it's working. The `webdriver-manager` is a helper tool to easily get an instance of a Selenium Server running. Use it to download the necessary binaries with:
```bash
webdriver-manager update
```
- Now start up a server with:
```bash
webdriver-manager start
```
- This will start up a Selenium Server and will output a bunch of info logs. Your Protractor test will send requests to this server to control a local browser. Leave this server running throughout the tutorial. You can see information about the status of the server at `http://localhost:4444/wd/hub`.

### Running the tests
	
- open a terminal and run the following command:
```bash
$ wget https://raw.githubusercontent.com/SpamExperts/mobile-app/master/src/scripts/appDev.sh && bash appDev.sh <android | ios> <proxy_server>
$ # appDev.sh <android | ios> <proxy_server>
```
`<proxy-server>` should be the address of the server used for testing

- open `spamexperts_mobile_app` project folder with your IDE and register the VCS root
- run `$ ionic serve --address localhost` from your command line to open the local server


- for running all tests:
```bash
$ protractor mobileConf.js 
```
- for running a specific test:
```bash
$ protractor mobileConf.js --specs <specsFile>
```
### Update
Some tests have a .json file attached to them. They take their testing data from there.
Input data needs updated in the .json file. 