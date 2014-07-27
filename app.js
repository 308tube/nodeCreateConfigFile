/**
 * Small app that will create encrypted config files for
 * your nodejs applications.
 * 
 * Will require cryptr
 * 		https://www.npmjs.org/package/cryptr
 * 		"npm install cryptr"
 * 
 * For instructions on how to use, please read the README.md
 */
var fs = require('fs')
	, Cryptr = require("cryptr")
	, fsCConfig = {};

/*
 * Javascript object you want to convert into a config file.
 * Adjust the javascript object to your needs, this will be
 * converted into a json string and saved to a config file.
 */
fsCConfig.configObject = {
	user: 'user',
	password: 'password',
	server: 'server'
};

//Config file name you want to use
fsCConfig.configFileName = "config.json";

/*
 * Secret key
 * Define your own when creating your file
 * You will also need this key for your application 
 * will read the encrypted config file.
 */
fsCConfig.cryptr = new Cryptr('makeUpYourOwnSecretKey');

/**
 * Method to create a config file
 */
fsCConfig.createConfigFile = function() {
	
	var data = JSON.stringify(fsCConfig.configObject)
		, encryptedString = fsCConfig.cryptr.encrypt(data);
	
	console.log('Encrypted json string: ' + encryptedString);

	fs.writeFile('./'+fsCConfig.configFileName, encryptedString, function (err) {
		if (err) {
			console.log('Error creating config file');
			console.log(err.message);
			return;
		}
		
		console.log('Config saved successfully, file name: ' + fsCConfig.configFileName);
		fsCConfig.loadConfigFile(); //read newly created config file
	});
};

/**
 * Method to read the config file, to make sure its working correctly
 */
fsCConfig.loadConfigFile = function() {
	
	var data = fs.readFileSync('./'+fsCConfig.configFileName)
		, myObj = ""
		, decryptedString = "";
	
	try {
		decryptedString = fsCConfig.cryptr.decrypt(data);
		myObj = JSON.parse(decryptedString);
		
		console.log("Retrieve data from " + fsCConfig.configFileName);
		console.dir(myObj);
		
		return myObj;
	}
	catch (err) {
		console.log('Error reading config file');
		console.log(err);
	}
};

//run this application
fsCConfig.createConfigFile();

