// Define the ConfigController on the adminUI module
angular.module('adminUI')
	.controller('ConfigController', ['$scope', 'schedulerService', function ($scope, schedulerService) {
		
	$scope.selectedOptions = []; 
	
	$scope.options = {
		"formats": ["480p", "480i", " 720p ", "720i", "1080p", "1080i"],
		"aspectRatios": ["4:3", "16:9"],
		"startModes": ["fixed", "duration"],
		"endModes": ["fixed", "duration"],
		"scheduleTypes": ["primary", "nonprimary"],
		"channelTypes": ["digital_television", "home_media"],
		"channelOutOfBand": ["true", "false"],
		"channelCa": ["true", "false"],
		"channelStatus": ["active", "inactive"]
	};
	
	$scope.selectedOptions = JSON.parse(JSON.stringify(schedulerService.configOptions));

	$scope.saveConfig = function(){
		schedulerService.saveConfig($scope.selectedOptions);
		toastr.success("Beep Boop","Configuration Saved");
	}
}]);