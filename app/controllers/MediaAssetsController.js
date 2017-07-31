// Define the MediaAssetsController on the adminUI module
angular.module('adminUI')
	.controller('MediaAssetsController', ['$scope', 'schedulerService', 'S3Service', function ($scope, schedulerService, S3Service) {
    $scope.S3Objects = [];
		
	$scope.testStuff = function(){
        console.log($scope.S3Objects);
        var test = S3Service.getItemsInBucket($scope.S3Objects);
        test.then(function(result) {
            $scope.S3Objects = result;
            console.log($scope.S3Objects);
        });
    }

    
}])