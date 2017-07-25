// Define the PlaylistController on the adminUI module
angular.module('adminUI')
	.controller('PlaylistController', ['$scope', 'S3Service', '$q', 'uuid', function PlaylistController($scope, S3Service, $q, uuid) {

    $scope.videos = [

    ];

    $scope.videoCount = 0;

    $scope.uploadProgress = 0;

    // Stores the file duration for access
    $scope.fileDuration = "";

    // Stores the file's thumbnail for access 
    $scope.fileThumbnail = null;

    // Stores the files start time 
    $scope.startTime = "";

    // Stores the length of the video
    $scope.videoLength = 0;

    // Resets form
    function resetForm() {
        $('#addAsset').modal('hide');
        $scope.title = null;
        document.getElementById('file').value = null;
        $scope.category = "";
        $scope.order = "";
        $scope.uploadProgress = 0;
        $scope.$digest();
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

        // Set the current time to the half-way point for thumbnail generation
        video.addEventListener("loadedmetadata", function() {
            this.currentTime = this.duration / 2;
        }, false);
        
        // Once the video is loaded in the browser, generate the thumbnail
        video.addEventListener("loadeddata", function () {
            $scope.fileThumbnail = screenshot(this);
            deferred.resolve($scope.fileThumbnail);
        }, false);
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
		//AWS config might need to be moved to AdminUI Config part
        //AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        //AWS.config.region = 'us-west-2';

			//Workaround for updating upload progress, still have async issue
			$scope.$on('progressEvent', function (event, data) {
				if (data.total != 0)
					$scope.uploadProgress = Math.round(data.loaded * 100/ data.total);
				$scope.$digest();
			}, 3000);
		if($scope.file)
		{
            S3Service.setBucket($scope.file);
            var upload = S3Service.upload($scope.file);
			upload.then(
				function (result) {
                    var generateDuration = findDuration($scope.file);
                    generateDuration.then(function (result) {
                        // If there is an empty playlist, set the start time
                        // to 24 hours after upload
                        if ($scope.videos.length === 0) {
                            var date = new Date();
                            date.setDate(date.getDate() + 1);
                            $scope.startTime = date;
                        }
                        // Otherwise, set the next video to begin right after the previous video
                        else {
                            var lastDate = new Date($scope.videos[$scope.videos.length - 1].date);
                            var duration = $scope.videos[$scope.videos.length - 1].totalSeconds;
                            lastDate.setSeconds(lastDate.getSeconds() + duration);
                            $scope.startTime = lastDate;
                        }
                    }, function (error) {
                        console.log(error);
                    })
                    .then(function (result) {
                        var thumb = generateThumbnail($scope.file);
                        thumb.then(function (result) {
                            // Add video to playlist UI and increment video count
                            $scope.videos.push({ title: $scope.title, file: $scope.file.name, category: $scope.category, order: $scope.order, duration: $scope.fileDuration, thumbnail: $scope.fileThumbnail, date: $scope.startTime, totalSeconds: $scope.videoLength, uuid: uuid.v4()});
                            $scope.videoCount = $scope.videoCount + 1;
                            $scope.$on('$destroy', 'progressEvent');
                        })
                        .then(function (result) {
                            // Put Finished
                            // Reset The Progress Bar
                            // Clear form in modal
                            setTimeout(function() {
                                resetForm();
                                $scope.uploadProgress = 0;
                                $scope.$digest();
                            }, 750);
                            return true;
                        })
                    })
			}, function(error) {
					$scope.$on('$destroy', 'progressEvent');
					// Put Finished
					// Reset The Progress Bar
					// Clear form in modal
					setTimeout(function() {
                        resetForm();
                        $scope.uploadProgress = 0;
                        $scope.$digest();
                    }, 750);
                return false;
			});
		}
		else {
			//No File selected
		    toastr.error('Please select a valid file to upload.', 'No File Selected');
            return false;
        }
    }
}]);

