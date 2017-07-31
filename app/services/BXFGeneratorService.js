
angular.module('adminUI')
	.service('BXFGeneratorService', function() {
	
	this.configSettings = [];	//Variable for storing values such as stream settings
	this.videoSchedule = [];		//Variable for storing the video schedule/ playlist details
	
	//function to set configSettings values
	//Called by ConfigController
	this.setConfig = function(configSettings) {
		angular.copy(configSettings, this.configSettings);
	};
	
	//function to set videoSchedule values
	//Called by PlaylistController
	this.setSchedule = function(videoSchedule) {
		angular.copy(videoSchedule, this.videoSchedule);
	};
	
	//Getters to be used when switching views (e.g. switch views from config.html to index.html)
	//Called by activate function in controllers
	//Called by ConfigController
	this.getConfig = function( ) {
		return this.configSettings;
	};
	
	//Called by PlaylistController
	this.getSchedule = function( ) {
		return this.videoSchedule;
	};
	
	
	//Placeholder function for generating the BXF using values in configSettings and videoSchedule
	//Returns the BXF file
	this.generateBXF = function( ) {
		//Code Here
	};

});