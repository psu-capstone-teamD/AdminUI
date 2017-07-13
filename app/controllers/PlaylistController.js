// Define the PlaylistController on the adminUI module
angular.module('adminUI')
	.controller('PlaylistController', ['$scope', 'S3Service', function PlaylistController($scope, S3Service) {
    $scope.videos = [

    ];
	
    $scope.videoCount = 0;


    $scope.uploadProgress = 0;

	// Resets form
    function resetForm() {
        $scope.title = null;
        document.getElementById('file').value = null;
        $scope.category = "";
        $scope.order = "";
    }

    $scope.upload = function() {

		
		if($scope.file)
		{
			var retVal = S3Service.upload($scope.file);
		    if(retVal == 1 || retVal == 2)
		    {
		        return false;
		    }
		    else
		    {
                
		        // Add video to playlist UI and increment video count
		        $scope.videos.push({ title: $scope.title, file: $scope.file.name, category: $scope.category, order: $scope.order });
		        $scope.videoCount = $scope.videoCount + 1;

		        // Clear form in modal
		        resetForm();

		        return true;
		    }

		}
		else {
			//No File selected
		    toastr.error('Please select a file to upload.', 'No File Selected');
            return false
		}
	}

}]);