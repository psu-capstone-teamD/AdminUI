// Define the ConfigController on the adminUI module
angular.module('adminUI')
	.controller('ConfigController', ['$scope', 'schedulerService', 'BXFGeneratorService', function ($scope, schedulerService, BXFGeneratorService) {
		
	$scope.selectedOptions = []; 
	
	$scope.options = {
		"startModes": ["Fixed", "Duration"],
		"endModes": ["Fixed", "Duration"],
		"scheduleTypes": ["Primary", "NonPrimary"],
		"channelTypes": ["digital_television", "home_media"],
	};
	
	$scope.selectedOptions = JSON.parse(JSON.stringify(schedulerService.configOptions));

	$scope.saveConfig = function(){
		schedulerService.saveConfig($scope.selectedOptions);
		BXFGeneratorService.setConfig($scope.selectedOptions);
		toastr.success("Success","Configuration Saved");
	}
}]);