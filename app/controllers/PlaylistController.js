// Define the PlaylistController on the adminUI module
controllers.controller('PlaylistController', function ($scope, $q) {
    $scope.videos = [

    ];
    $scope.videoCount = 0;

    $scope.uploadProgress = 0;
    // Prefilled Credentials
    // Prefilled Credentials
    $scope.creds = {
        bucket: 'pdxteamdkrakatoa',
        access_key: 'REPLACE ME',
        secret_key: 'REPLACE ME'
    }

    // Stores the file duration for access
    $scope.fileDuration = "";

    // Resets form
    function resetForm() {
        $('#addAsset').modal('hide');
        $scope.title = null;
        document.getElementById('file').value = null;
        $scope.category = "";
        $scope.order = "";
    }
    
    // Finds the duration of the file and converts it to HH:MM:SS format
    var findDuration = function (file){
        var deferred = $q.defer();
        var video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(this.src);
            var totalSeconds = video.duration;
            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor(totalSeconds % 3600 / 60);
            var seconds = Math.floor(totalSeconds % 3600 % 60);

            var hh = hours > 0 ? prependLeadingZero(hours) + ":" : "00:";
            var mm = minutes > 0 ? prependLeadingZero(minutes) + ":" : "00:";
            var ss = seconds > 0 ? prependLeadingZero(seconds) : "00";
            
            $scope.fileDuration = hh + mm + ss;
            deferred.resolve($scope.fileDuration);
        }
        video.src = URL.createObjectURL(file);
        return deferred.promise;
    }

    // Attaches a leading zero if the length is less than 10
    function prependLeadingZero(num) {
        return num < 10 ? "0" + num : num;
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
                    var generateDuration = findDuration($scope.file);
                    generateDuration.then(function (_duration) {
                        // Add video to playlist UI and increment video count
                        $scope.videos.push({ title: $scope.title, file: $scope.file.name, category: $scope.category, order: $scope.order, duration: _duration });
                        $scope.videoCount = $scope.videoCount + 1;
                    }, function (error) {
                        console.log(error);
                    }).then( function () {
                        // Upload Successfully Finished
                        // Reset The Progress Bar
                        setTimeout(function () {
                            // Clear form in modal
                            resetForm();
                            $scope.uploadProgress = 0;
                            $scope.$digest();
                        }, 1000);
                    });
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
});