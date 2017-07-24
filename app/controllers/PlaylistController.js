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

    // Stores the file's thumbnail for access 
    $scope.fileThumbnail = null;

    // Stores the files start time 
    $scope.startTime = "";

    $scope.videoLength = 0;

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
            $scope.videoLength = video.duration;
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

    // Generates a 80 x 60 thumbnail image given a file
    var generateThumbnail = function (file) {
        var deferred = $q.defer();
        var video = document.createElement('video');
        
        video.addEventListener("loadeddata", function () {
            $scope.fileThumbnail = screenshot(this);
            deferred.resolve($scope.fileThumbnail);
        });
        video.style.display = "none";

        video.src = URL.createObjectURL(file);
        return deferred.promise;
    }

    // Capture the first frame of the video
    // Essentially, it creates an invisible canvas and loads
    // the video into it. Then, it captures the first frame,
    // removes the elements, and returns the thumbnail as
    // a data URL
    function screenshot(video) {
        var canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 60;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.width = 'inherit';
        canvas.style.height = 'inherit';
        $(video).remove();
        $(canvas).remove();
        return canvas.toDataURL(canvas);
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
                    generateDuration.then(function () {
                        // If there is an empty playlist, set the start time
                        // to 24 hours after upload
                        if ($scope.videos.length === 0) {
                            console.log(1);
                            var date = new Date();
                            date.setDate(date.getDate() + 1);
                            $scope.startTime = date;
                            console.log(2);
                        }
                        // Otherwise, set teh next video to begin right after the previous video
                        else {
                            var lastDate = new Date($scope.videos[$scope.videos.length - 1].date);
                            var duration = $scope.videos[$scope.videos.length - 1].totalSeconds;
                            lastDate.setSeconds(lastDate.getSeconds() + duration);
                            $scope.startTime = lastDate;
                        }
                    }, function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        var thumb = generateThumbnail($scope.file);
                        thumb.then(function () {
                            // Add video to playlist UI and increment video count
                            $scope.videos.push({ title: $scope.title, file: $scope.file.name, category: $scope.category, order: $scope.order, duration: $scope.fileDuration, thumbnail: $scope.fileThumbnail, date: $scope.startTime, totalSeconds: $scope.videoLength});
                            $scope.videoCount = $scope.videoCount + 1;
                        })
                    })
                    .then( function () {
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