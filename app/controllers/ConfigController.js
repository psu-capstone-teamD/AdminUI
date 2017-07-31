// Define the ConfigController on the adminUI module
angular.module('adminUI')
	.controller('ConfigController', ['$scope', 'schedulerService', function ($scope, schedulerService) {
		
	$scope.selectedOptions = []; 
	
    $scope.screenResolutions = ["480p", "480i", " 720p ", "720i", "1080p", "1080i"];
	$scope.selectedOptions.push(schedulerService.selectedOptions[0].value);
	
	$scope.aspectRatios = ["4:3", "16:9"];
	$scope.selectedOptions.push(schedulerService.selectedOptions[1].value);
	
	$scope.startModes = ["Fixed", "Duration"];
	$scope.selectedOptions.push(schedulerService.selectedOptions[2].value);
	
	$scope.endModes = ["Fixed", "Duration"];
	$scope.selectedOptions.push(schedulerService.selectedOptions[3].value);
	
	$scope.eventTypes = ["Primary", "NonPrimary"];
	$scope.selectedOptions.push(schedulerService.selectedOptions[4].value);

	$scope.saveConfig = function(){
		schedulerService.saveConfig($scope.selectedOptions);
		toastr.success("Beep Boop","Configuration Saved");
	}
}]);