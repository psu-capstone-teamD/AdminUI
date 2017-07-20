// Define the PlaylistController on the adminUI module
angular.module('adminUI')
	.controller('PlaylistController', ['$scope', 'S3Service', function PlaylistController($scope, S3Service) {
    $scope.videos = [

    ];

    $scope.videoCount = 0;
    $scope.uploadProgress = 0;
	

	
    //Prefilled Credentials
    $scope.creds = {
        bucket: 'pdxteamdkrakatoa',
        access_key: 'REPLACE ME',
        secret_key: 'REPLACE ME'
    }
	
    // Resets form
    function resetForm() {
        $('#addAsset').modal('hide');
        $scope.title = null;
        document.getElementById('file').value = null;
        $scope.category = "";
        $scope.order = "";
	}

    $scope.upload = function () {
		//AWS config might need to be moved to AdminUI Config part
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = 'us-west-2';
		if($scope.file)
		{
			
			//Workaround for updating upload progress, still have async issue
			$scope.$on('progressEvent', function (event, data) {
				if (data.total != 0)
					$scope.uploadProgress = Math.round(data.loaded * 100/ data.total);
				$scope.$digest();
			});
			
			
			S3Service.setBucket($scope.file);
			var retVal = S3Service.upload($scope.file);
			console.log(retVal);
		    if(retVal == 0)
		    {
		        // Add video to playlist UI and increment video count
		        $scope.videos.push({ title: $scope.title, file: $scope.file.name, category: $scope.category, order: $scope.order });
		        $scope.videoCount = $scope.videoCount + 1;

				// Upload Finished
				// Reset The Progress Bar
				// Clear form in modal
				setTimeout(function() {
				resetForm();
				$scope.uploadProgress = 0;
				$scope.$digest();
				}, 2000)
				
				$scope.$on(destroy, 'progressEvent');
		        return true;
		    }
			else
			{	
		        return false;
		    }
		    
			
			


		}
		else {
			//No File selected
		    toastr.error('Please select a file to upload.', 'No File Selected');
            return false;
		}
    }
}]);
