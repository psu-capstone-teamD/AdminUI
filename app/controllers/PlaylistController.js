// Define the PlaylistController on the adminUI module
controllers.controller('PlaylistController', function PlaylistController($scope) {
    $scope.videos = [

    ];

    $scope.videoCount = 0;

    $scope.uploadProgress = 0;
  
    // Prefilled Credentials
    $scope.creds = {
        bucket: 'pdxteamdkrakatoa',
        access_key: 'REPLACE ME',
        secret_key: 'REPLACE ME'
    }

    // Resets form
    function resetForm() {
        $scope.title = null;
        document.getElementById('file').value = null;
        $scope.category = "";
        $scope.order = "";
    }

    $scope.upload = function() {
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = 'us-west-2';
        var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
        
        if($scope.file) {
            var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

            bucket.putObject(params, function(err, data) {
            if(err) {
                return false;
            }
            else {
                // Upload Successfully Finished
                // Reset The Progress Bar
                setTimeout(function() {
                $scope.uploadProgress = 0;
                $scope.$digest();
                }, 4000);
            }
            })
            .on('httpUploadProgress',function(progress) {
            $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
            $scope.$digest();
            });

            // Add video to playlist UI and increment video count
            $scope.videos.push({title:$scope.title, file:$scope.file.name, category:$scope.category, order:$scope.order});
            $scope.videoCount = $scope.videoCount + 1;

            // Clear form in modal
            resetForm();
            return true;
        }
        else {
            return false;
        }
    }
});