angular.module('adminUI')
    .controller('PlaylistController', ['$scope', 
                                       '$rootScope', 
                                       'S3Service', 
                                       'BXFGeneratorService', 
                                       '$q',
                                       '$interval', 
                                       'uuid', 
                                       'schedulerService', 
                                       'currentVideoStatusService', 
                                       'mediaAssetsService',
function PlaylistController($scope, $rootScope, S3Service, BXFGeneratorService, $q, $interval, uuid, schedulerService, currentVideoStatusService, mediaAssetsService) {


    $scope.videos = schedulerService.videos;
    $scope.videoCount = schedulerService.videos.length;

    $scope.uploadProgress = 0;

    // Stores the file duration for access
    $scope.fileDuration = "";

    // Stores the file's thumbnail for access 
    $scope.fileThumbnail = null;

    // Stores the files start time 
    $scope.startTime = "";

    // Stores the length of the video
    $scope.videoLength = 0;

    $scope.lastVideoOrder = 0;

    $scope.eventRunning = false;



    $rootScope.statusFilter = function(video) {
        return video.liveStatus === 'ok' || video.liveStatus === 'pending';
    };

    // When the MediaAssetController signals a video to be
    // added, the PlaylistController takes over control
    $rootScope.$on('addS3ToPlaylist', function(event, args) {
        args = S3Service.mediaObject;
        if (args === null) {
            return;
        }
       $scope.file = new Object();
       $scope.file.name = args.fileName;
       $scope.videoCount = schedulerService.videos.length;
       var videoTitle = args.title;
       var category = args.category;
       var date = args.videoStartTime; 
       var order = args.order;
       S3Service.mediaObject = null;
       


       var findDuration = $scope.findDuration(args.fileURL, true);
       findDuration.then(function(result) {
                // Set the the start time of the video. If this is the first video,
                // generate the start time based on user input. Otherwise, set it
                // to play after the previous video is finished.
                if ($scope.videos.length === 0) {
                    if (schedulerService.initialStartTime === '') {
                        schedulerService.initialStartTime = new Date();
                        switch ($scope.videoStartTime) {
                            case "00:00:30":
                                schedulerService.initialStartTime.setSeconds(schedulerService.initialStartTime.getSeconds() + 30);
                                break;
                            case "00:05:00":
                                schedulerService.initialStartTime.setMinutes(schedulerService.initialStartTime.getMinutes() + 5);
                                break;
                            case "00:10:00":
                                schedulerService.initialStartTime.setMinutes(schedulerService.initialStartTime.getMinutes() + 10);
                                break;
                            case "00:30:00":
                                schedulerService.initialStartTime.setMinutes(schedulerService.initialStartTime.getMinutes() + 30);
                                break;
                            case "01:00:00":
                                schedulerService.initialStartTime.setHours(schedulerService.initialStartTime.getHours() + 1);
                                break;
                            case "24:00:00":
                                schedulerService.initialStartTime.setDate(schedulerService.initialStartTime.getDate() + 1);
                                break;
                            default:
                                schedulerService.initialStartTime.setDate(schedulerService.initialStartTime.getDate() + 1);
                                break;
                        }
                        $scope.startTime = schedulerService.initialStartTime.getDate();
                    }
                    else {
                        $scope.startTime = schedulerService.initialStartTime.getDate();
                    }
                }
            }, function (error) {
                toastr.error("Error", error);
            })
            .then(function (result) {
                var bucket = new AWS.S3();
                var thumb = S3Service.retrieveThumbnail($scope.file.name, bucket);
                thumb.then(function (result) {
                    // Check if the user didn't put anything into the form
                    // Local variables are used so the form's values don't mutate
                    // in front of the user.
                    $scope.fileThumbnail = result;
                    var category = $scope.category;
                    if ($scope.category === null || $scope.category === "") {
                        category = "TV Show";
                    }
                    if (order === null || order === "") {
                        if ($scope.videoCount === null ) {
                            order = 1;
                            $scope.newOrder = order;
                        }
                        else {
                            order = $scope.videoCount + 1;
                        }
                    }
                    // Add video to playlist UI and increment video count
                    var videoTitle = schedulerService.validateVideoTitle(args.title);
                    $scope.videos.push({ title: videoTitle, 
                                         file: $scope.file.name, 
                                         category: category, 
                                         order: order, 
                                         duration: $scope.fileDuration, 
                                         thumbnail: $scope.fileThumbnail, 
                                         date: $scope.startTime, 
                                         totalSeconds: $scope.videoLength, 
                                         liveStatus: "ok", 
                                         videoPlayed: false,
                                         uuid: uuid.v4()});
                    $scope.videoCount = $scope.videoCount + 1;
                    $rootScope.$broadcast('VideoCountChanged', $scope.videoCount);
                    if(!$scope.verifyOrder()) {
                        $scope.reorder($scope.videoCount);
                    }
                })
            })
            .then(function (result) {
                // Put Finished
                // Reset The Progress Bar
                // Clear form in modal
                setTimeout(function() {
                    $rootScope.$broadcast('S3AddFinished', null);
                }, 1000);
                return true;
            });
    });

    // Resets form
    $scope.resetForm = function() {
        try {
            $('#addAsset').modal('hide');
        }
        catch (err) {
            console.log("Failed to hide the modal!");
        }
        $scope.title = null;
        try {
            document.getElementById('file').value = null;
        }
        catch (err) {
            console.log("Failed to reset the file!");
        }
        $scope.category = "";
        $scope.order = "";
        $scope.uploadProgress = 0;
        $scope.startTime = "";
        $scope.videoStartTime = "";
        $scope.file = null;
        schedulerService.playlistChanged();
    }
    
    // Finds the duration of the file and converts it to HH:MM:SS format
    $scope.findDuration = function(file, isFromS3){
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

            var hh = hours > 0 ? $scope.prependLeadingZero(hours) + ":" : "00:";
            var mm = minutes > 0 ? $scope.prependLeadingZero(minutes) + ":" : "00:";
            var ss = seconds > 0 ? $scope.prependLeadingZero(seconds) : "00";
            
            $scope.fileDuration = hh + mm + ss;
            deferred.resolve($scope.fileDuration);
        }
        if(isFromS3) {
            video.src = file;
        }
        else {
            video.src = URL.createObjectURL(file);
        }
        return deferred.promise;
    }

    // Generates a 80 x 60 thumbnail image given a file
    $scope.generateThumbnail = function (file, isFromS3) {
        var deferred = $q.defer();
        var video = document.createElement('video');

        // Set the current time to the half-way point for thumbnail generation
        video.addEventListener("loadedmetadata", function() {
            this.currentTime = this.duration / 2;
        }, false);
        
        // Once the video is loaded in the browser, generate the thumbnail
        video.addEventListener("loadeddata", function () {
            $scope.fileThumbnail = $scope.screenshot(this);
            deferred.resolve($scope.fileThumbnail);
        }, false);
        video.style.display = "none";
        if (isFromS3) {
            video.src = file;
        }
        else {
            video.src = URL.createObjectURL(file);
        }
        return deferred.promise;
    }

    // Capture the first frame of the video
    // Essentially, it creates an invisible canvas and loads
    // the video into it. Then, it captures the first frame,
    // removes the elements, and returns the thumbnail as
    // a data URL
    $scope.screenshot = function(video) {
        var canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 60;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.width = 'inherit';
        canvas.style.height = 'inherit';
        $(video).remove();
        $(canvas).remove();
        return canvas.toDataURL('image/jpeg');
    }

    // Attaches a leading zero if the length is less than 10
    $scope.prependLeadingZero = function(num) {
        return num < 10 ? "0" + num : num;
    }

    // Generates BXF from JSON Object and sends to Lambda
    $scope.publish = function() {
        BXFGeneratorService.generateBXF($scope.videos);
        $scope.lastVideoOrder = $scope.videoCount;
        $scope.eventRunning = true;
    }
    
    // Upload a video to the S3 bucket and add to the playlist
    $scope.upload = function () {
        //Workaround for updating upload progress, still have async issue
        $scope.$on('progressEvent', function (event, data) {
            if (data.total != 0)
                $scope.uploadProgress = Math.round(data.loaded * 100/ data.total);
            $scope.$digest();
        }, 3000);

		if($scope.file)
		{
            var bucket = S3Service.setBucket($scope.file);
            var upload = S3Service.upload($scope.file, bucket);
			upload.then(
				function (result) {
                    var generateDuration = $scope.findDuration($scope.file, false);
                    generateDuration.then(function (result) {
                        // Set the the start time of the video. If this is the first video,
                        // generate the start time based on user input. Otherwise, set it
                        // to play after the previous video is finished.
                        if ($scope.videos.length === 0) {
                            if (schedulerService.initialStartTime === '') {
                                schedulerService.initialStartTime = new Date();
                                switch ($scope.videoStartTime) {
                                    case "00:00:30":
                                        schedulerService.initialStartTime.setSeconds(schedulerService.initialStartTime.getSeconds() + 30);
                                        break;
                                    case "00:05:00":
                                        schedulerService.initialStartTime.setMinutes(schedulerService.initialStartTime.getMinutes() + 5);
                                        break;
                                    case "00:10:00":
                                        schedulerService.initialStartTime.setMinutes(schedulerService.initialStartTime.getMinutes() + 10);
                                        break;
                                    case "00:30:00":
                                        schedulerService.initialStartTime.setMinutes(schedulerService.initialStartTime.getMinutes() + 30);
                                        break;
                                    case "01:00:00":
                                        schedulerService.initialStartTime.setHours(schedulerService.initialStartTime.getHours() + 1);
                                        break;
                                    case "24:00:00":
                                        schedulerService.initialStartTime.setDate(schedulerService.initialStartTime.getDate() + 1);
                                        break;
                                    default:
                                        schedulerService.initialStartTime.setDate(schedulerService.initialStartTime.getDate() + 1);
                                        break;
                                }
                                $scope.startTime = schedulerService.initialStartTime.getDate();
                            }
                            else {
                                $scope.startTime = schedulerService.initialStartTime.getDate();
                            }
                        }
                    }, function (error) {
                        toastr.error("Error", error);
                    })
                    .then(function (result) {
                        toastr.info("Processing media data...", "Processing");
                        var thumb = $scope.generateThumbnail($scope.file, false);
                        thumb.then(function (result) {
                            // Check if the user didn't put anything into the form
                            // Local variables are used so the form's values don't mutate
                            // in front of the user.

                            // Uploads the thumbnail to S3 for future retrieval
                            var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket }});
                            var thumbnailBlob = $scope.convertDataURIToBlob($scope.fileThumbnail);
                            $scope.uploadThumbnailToS3(thumbnailBlob, $scope.file.name, bucket);
                                var category = $scope.category;
                                var order = $scope.order;
                                if ($scope.category === null || $scope.category === "") {
                                    category = "TV Show";
                                }
                                if ($scope.order === null || $scope.order === "") {
                                    if ($scope.videoCount === null) {
                                        order = 1;
                                        $scope.newOrder = order;
                                    }
                                    else {
                                        order = $scope.videoCount + 1;
                                    }
                                }
                                // Add video to playlist UI and increment video count
                                var videoTitle = schedulerService.validateVideoTitle($scope.title);
                                $scope.videos.push({ title: videoTitle, 
                                                     file: $scope.file.name, 
                                                     category: category, 
                                                     order: order, 
                                                     duration: $scope.fileDuration, 
                                                     thumbnail: $scope.fileThumbnail, 
                                                     date: $scope.startTime, 
                                                     totalSeconds: $scope.videoLength, 
                                                     liveStatus: "ok", 
                                                     videoPlayed: false,
                                                     uuid: uuid.v4()});
                                $scope.videoCount = $scope.videoCount + 1;
                                $rootScope.$broadcast('VideoCountChanged', $scope.videoCount);
                                if(!$scope.verifyOrder()) {
                                    $scope.reorder($scope.videoCount);
                                }
                            })
                            .then(function (result) {
                                // Put Finished
                                // Reset The Progress Bar
                                // Clear form in modal
                                setTimeout(function() {
                                    $scope.resetForm();
                                    $scope.uploadProgress = 0;
                                    $scope.$digest();
                                }, 750);
                                return true;
                            });
                    });
			}, function(error) {
					// Put Finished
					// Reset The Progress Bar
					// Clear form in modal
					setTimeout(function() {
                        $scope.resetForm();
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
	//Reorder videos
    $scope.reorder = function (oldOrder) {
		//Case: No video on list, no need to reorder
		if($scope.videoCount === 0)
            return 0;
        
        //Case: Video is locked 
        if($scope.videos[oldOrder - 1].liveStatus === "running") {
            return 0;
        }

        
		//Valid Cases
		var newIndex = $scope.newOrder - 1
		var oldIndex = oldOrder - 1;
        
		
		//Case: new order value is the same as the old order value, do nothing
		if(oldOrder == $scope.newOrder){
			return 2;
		}
		//Case: New order value less than old Order value, increment every videos on index newIndex to oldIndex - 1
		else if(newIndex < oldIndex) {
			for(var i = newIndex; i <= oldIndex - 1; i++)
			{
				var currentVid = $scope.videos[i];
				currentVid.order = (parseInt(currentVid.order) + 1).toString();
			}
		}
		//Case: New order value greater than old Order value, decrement every videos on oldIndex + 1 to newIndex
		else if(newIndex > oldIndex) {
			for(var i = oldIndex + 1; i <= newIndex; i++)
			{
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
        schedulerService.playlistChanged();
		return 0;
    }
    
    // Remove a video from the playlist
	$scope.remove = function (order) {
        if (order === null || order === undefined) {
            return -1;
        }
        var index = parseInt(order) - 1;
        
        // If the video is currently playing in Live, don't
        // allow for deletion
        if($scope.videos[index].liveStatus === "running" && $scope.videos[index].videoPlayed === false) {
            return -1;
        }
		
		for(var i = index + 1; i < $scope.videoCount; i++)
		{
			var currentVid = $scope.videos[i];
			currentVid.order = (parseInt(currentVid.order) - 1).toString();
		}
		$scope.videos.splice(index, 1);
        //$scope.videoCount = $scope.videoCount - 1;
        $scope.videoCount = schedulerService.videos.length;
        $rootScope.$broadcast('VideoCountChanged', $scope.videoCount);
        schedulerService.playlistChanged();
    };
    
    // Ensure the playlist is in correct order
    $scope.verifyOrder = function() {
        var count = $scope.videos.length;
        for(var i = 0; i < count; i++) {
            if(($scope.videos[i + 1] != null) && $scope.videos[i].order >= $scope.videos[i + 1].order) {
                return false;
            }
        }
        return true;
    }

    $scope.setRowColor = function(status) {
        switch(status) {
            case "running":
                return {'background-color': "#e0827b"} // Red
            case "pending":
                return {'background-color': "#eef27b"} // Yellow
            case "done":
                return {'background-color': '#42f483'} // Green
            default:
                break;
        }
    }

    $scope.markVideosAsDone = function(order) {
        if(order === 0) {
            return schedulerService.videos;
        }
        schedulerService.videos[order -1].liveStatus = "done";
        schedulerService.videos = $scope.markVideosAsDone(order - 1);
        return schedulerService.videos;
    }

    $scope.checkLiveStatus = function() {
        // If there is nothing in the playlist, no need to check
        if(schedulerService.videos.length === 0 || $scope.videos.length === 0 || $scope.eventRunning === false) {
            return 0;
        }

        var liveStatus = currentVideoStatusService.getLiveStatus();
        liveStatus.then(function(response) {
            if(response === "failure") {
                console.log("Something went wrong, couldn't ping the Lambda service");
                return 0;
            }
            if(response.errMessage !== undefined) {
                return -1;
            }
            console.log(response);
            if(response.statusCode !== "200") {
               // console.log("No event currently playing"); // <-- uncomment for debugging info
               /*
               var check = schedulerService.checkForRemoval([]);
               console.log(check);
                if(check.status === true) {
                    $scope.remove(check.videoOrder);
                }
                else if(check.status === "remove") {
                    console.log("clear all");
                    schedulerService.videos = [];
                    $scope.videos = schedulerService.videos;
                 //   return 1;
                }
                return 0;*/

                var toRemove = schedulerService.checkForRemoval([]);
                console.log("toRemove below");
                console.log(toRemove);
                console.log($scope.lastVideoOrder);
                toRemove.forEach(function(item) {
                  //  $scope.remove(item);
                    //$scope.videos[parseInt(item) - 1].liveStatus = "done";
                    $scope.videos = $scope.markVideosAsDone(parseInt(item));
                    console.log($scope.lastVideoOrder);
                    if(parseInt(item) === $scope.lastVideoOrder) {
                        console.log("switched eventRunning");
                        $scope.eventRunning = false;
                    }
                    /*
                    try {
                        $scope.videos[parseInt(item) - 2].liveStatus = "done";
                    }
                    catch (error){
                        console.log("there was no video to set to done");
                    }*/
                });
                console.log("done 400");
                return 0;
            }

            //var check = schedulerService.checkForRemoval(response.running.split(","));
            //if(check.status === true) {
             //   $scope.remove(check.videoOrder);
           // }

            if(response.running !== "") {
                // Split the uuids before passing on to schedulerService
                var uuids = response.running.split(",");
                schedulerService.setVideoStatus(uuids, "running");
            }
            if(response.pending !== "") {
                // Split the uuids before passing on to schedulerService
                var uuids = response.pending.split(",");
                schedulerService.setVideoStatus(uuids, "pending");
            }

                var toRemove = schedulerService.checkForRemoval([]);
                console.log("toRemove below");
                console.log(toRemove);
                console.log($scope.lastVideoOrder);
                toRemove.forEach(function(item) {
                  //  $scope.remove(item);
                    //$scope.videos[parseInt(item) - 1].liveStatus = "done";
                    $scope.videos = $scope.markVideosAsDone(parseInt(item));
                    console.log($scope.lastVideoOrder);
                    if(parseInt(item) === $scope.lastVideoOrder) {
                        console.log("switched eventRunning");
                        $scope.eventRunning = false;
                    }
                    /*
                    try {
                        $scope.videos[parseInt(item) - 2].liveStatus = "done";
                    }
                    catch (error){
                        console.log("there was no video to set to done");
                    }*/
                });

            console.log("done 200");
            return 1; 
        });

    }

    // Every 5 seconds, check the status of videos and update
    // the playlist accordingly
    var checkLive = $interval(function() {
        $scope.checkLiveStatus();
    }, 3500);

    // Ensure the interval doesn't keep spawning every time the 
    // Playlist view is refreshed
    $scope.$on('$destroy', function() {
        $interval.cancel(checkLive);
    });
}]);
