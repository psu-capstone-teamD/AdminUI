// Define the PlaylistController on the adminUI module
controllers.controller('PlaylistController', function ($scope) {
    $scope.videos = [

    ];
    $scope.videoCount = 0;
	$scope.newOrder = 0;
	
    $scope.uploadProgress = 0;
    //Prefilled Credentials
    // Prefilled Credentials
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
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = 'us-west-2';
        var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
        if ($scope.file) {
            var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };
            bucket.putObject(params, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                else {
                    // Add video to playlist UI and increment video count
                    $scope.videos.push({ title: $scope.title, file: $scope.file.name, category: $scope.category, order: $scope.order });
                    $scope.videoCount = $scope.videoCount + 1;
					
					//Set newOrder value to the specified order selected and call the reorder function with the incremented videoCount value as the old order
					$scope.newOrder = $scope.order;
					$scope.reorder($scope.videoCount);

                    // Upload Successfully Finished
                    // Reset The Progress Bar
                    setTimeout(function () {
                        // Clear form in modal
                        resetForm();
                        $scope.uploadProgress = 0;
                        $scope.$digest();
                    }, 1000);
                }
            })
                .on('httpUploadProgress', function (progress) {
                    $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
                    $scope.$digest();
                });
            return true;
        }
        else {
            return false;
        }
    }
	
	//Reorder videos
    $scope.reorder = function (oldOrder) {
		//Case: No video on list, no need to reorder
		if($scope.videoCount == 0)
			return 0;
		
		//Case: invalid input values
		if($scope.newOrder <= 0 || $scope.newOrder > $scope.videoCount)
			return 1;
		
		//Valid Cases
		var newIndex = $scope.newOrder - 1
		var oldIndex = oldOrder - 1;
		
		console.log(newIndex);
		console.log(oldIndex);
		
		//Case: new order value is the same as the old order value, do nothing
		if(oldOrder == $scope.newOrder)
		{
			console.log("Old == New");
			return 2;
		}
		else	
		//Case: New order value less than old Order value, increment every videos on index newIndex to oldIndex - 1
		if(newIndex < oldIndex)
		{
			console.log("New < Old");
			for(var i = newIndex; i <= oldIndex - 1; i++)
			{
				console.log(i);
				var currentVid = $scope.videos[i];
				currentVid.order = (parseInt(currentVid.order) + 1).toString();
			}
		}
		//Case: New order value greater than old Order value, decrement every videos on oldIndex + 1 to newIndex
		else 
		if(newIndex > oldIndex)
		{
			console.log("New > Old");
			for(var i = oldIndex + 1; i <= newIndex; i++)
			{
				console.log(i);
				var currentVid = $scope.videos[i];
				currentVid.order = (parseInt(currentVid.order) - 1).toString();
			}
		}

		//Set the new value for the target video.
		var targetVid = $scope.videos[oldIndex];
		targetVid.order = $scope.newOrder;
		$scope.videos = $scope.videos.sort(function(a, b) {
			return parseInt(a.order) - parseInt(b.order);
		});
		
		return 0;
    }
});