// Define the PlaylistController on the adminUI module
angular.module('adminUI')
	.controller('PlaylistController', ['$scope', 'S3Service', function PlaylistController($scope, S3Service) {
    $scope.videos = [

    ];
	
    $scope.upload = function() {
		
		$scope.uploadProgress = S3Service.uploadProgress;
		
		if($scope.file)
		{
			S3Service.upload($scope.file);
		}
		else {
			//No File selected
			toastr.error('Please select a file to upload');
		}
	}

}]);