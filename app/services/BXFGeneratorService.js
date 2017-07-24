angular.module('adminUI')
	.service('BXFGeneratorService', function() {
	
	var configSettings = [];	//Variable for storing values such as stream settings
	var videoSchedule = [];		//Variable for storing the video schedule/ playlist details
	
	//function to set configSettings values
	//Called by ConfigController
	this.setConfig = function(configSettings) {
		angular.copy(configSettings, this.configSettings);
	};
	
	//function to set videoSchedule values
	//Called by PlaylistController
	this.setSchedule = function(videoSchedule) {
		angular.copy(schedule, this.videoSchedule);
	};
	
	//Getters to be used when switching views (e.g. switch views from config.html to index.html)
	//Called by activate function in controllers
	//Called by ConfigController
	this.getConfig = function( ) {
		return configSettings;
	};
	
	//Called by PlaylistController
	this.getSchedule = function( ) {
		return videoSchedule;
	};
	
	
	//Placeholder function for generating the BXF using values in configSettings and videoSchedule
	//Returns the BXF file
	this.generateBXF = function( ) {
		//Code Here
	};

});