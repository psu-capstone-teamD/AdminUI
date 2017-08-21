/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

// Define the ConfigController on the adminUI module
angular.module('adminUI')
	.controller('ConfigController', ['$scope', 'schedulerService', 'BXFGeneratorService', 'lambdaService', function ($scope, schedulerService, BXFGeneratorService, lambdaService) {
		
	$scope.selectedOptions = []; 
	
	$scope.options = {
		"startModes": ["Fixed", "Duration"],
		"endModes": ["Fixed", "Duration"],
		"scheduleTypes": ["Primary", "NonPrimary"],
		"channelTypes": ["digital_television", "home_media"],
	};
	
	$scope.deltaInputURL = lambdaService.deltaInputURL;
	
	$scope.livestreamURL = schedulerService.livestreamURL;
	
	$scope.selectedOptions = JSON.parse(JSON.stringify(schedulerService.configOptions));

	$scope.saveConfig = function(){
		schedulerService.saveConfig($scope.selectedOptions);
		BXFGeneratorService.setConfig($scope.selectedOptions);
		schedulerService.livestreamURL = $scope.livestreamURL;
		lambdaService.deltaInputURL = $scope.deltaInputURL;
		toastr.success("Saving Finished","Configuration Saved");
	}
}]);