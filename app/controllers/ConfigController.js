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
	
	$scope.inputRedirectDNS = schedulerService.inputRedirectDNS;
	
	$scope.livestreamURL = schedulerService.livestreamURL;
	
	$scope.selectedOptions = JSON.parse(JSON.stringify(schedulerService.configOptions));

	$scope.saveConfig = function(){
		if($scope.inputRedirectDNS === schedulerService.inputRedirectDNS) {
			schedulerService.saveConfig($scope.selectedOptions);
			BXFGeneratorService.setConfig($scope.selectedOptions);
			schedulerService.livestreamURL = $scope.livestreamURL;
			toastr.success("Saving Finished","Configuration Saved");
		}
		else {
			var temp = $scope.inputRedirectDNS;
			if(isNumeric(temp.second) 
				&& isNumeric(temp.third)
				&& isNumeric(temp.fourth)
				&& isNumeric(temp.port)) {
					if(isBelowIPLimit(temp.second)
						&& isBelowIPLimit(temp.third)
						&& isBelowIPLimit(temp.fourth)) {
							if(isNonLoopback(temp.second, temp.third, temp.fourth))
							{
								toastr.error("Please enter a loopback IP address for the DNS.", "Error");
							}
							else {
								schedulerService.saveConfig($scope.selectedOptions);
								BXFGeneratorService.setConfig($scope.selectedOptions);
								schedulerService.livestreamURL = $scope.livestreamURL;
								schedulerService.inputRedirectDNS = $scope.inputRedirectDNS;
								$rootScope.redirectDNSChanged = true;
								toastr.success("Saving Finished","Configuration Saved");
							}
					}
					else {
						toastr.error("Invalid IP address value.", "Error");
					}
			}
			else {
				toastr.error("Non-numeric value entered for DNS.", "Error");
			}
				
		}
	}
	
	//For checking numeric value inputs
	function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	//For checking value is less than 255
	function isBelowIPLimit(n) {
		return parseInt(n) <= 255;
	}
	
	//For checking case for non-loopback ip (127.0.0.0)
	function isNonLoopback(z,x,c) {
		if(parseInt(z) == 0 && parseInt(x) == 0 && parseInt(c) == 0)
			return true;
		else
			return false;
	}
	
	
}]);