angular.module('adminUI')
    .service('schedulerService', ['$rootScope', function ($rootScope) {
        this.videos = [
        ];

        this.videoCount = null;
		//Used default values for the selected items of each Config selection options
		this.configOptions = {
			"format": "1080i",
			"aspectRatio": "16:9",
			"startMode": "Duration",
			"endMode": "Duration",
			"scheduleType": "Primary",
			"scheduleName": "Default Name",
			"channelType": "digital_television",
			"channelOutOfBand": "true",
			"channelShortName": "Default Name",
			"channelCa": "false",
			"channelStatus": "active",
			"channelNumber": "0-1"
		};
		
        // Set the default start time
        this.initialStartTime = '';

        $rootScope.playlistEmpty = true;
        $rootScope.playlistPublished = false;

        this.videoTitleCounts = {};

        //var currentlyRunningVideos = [];
        //var currentlyRunningVideo = {};
        var currentlyRunningVideos = [];

        this.getCurrentlyRunningVideos = function() {
            return currentlyRunningVideos;
        }


        // When the playlist is updated, iterate through each video
        // and automatically calculate each video's start time
        this.playlistChanged = function() {
            var videoCount = this.videos.length;
            if (videoCount == 0) {
                this.initialStartTime = '';
                $rootScope.playlistEmpty = true;
            }
            else {
                $rootScope.playlistEmpty = false;
                for (var i = 0; i < videoCount; i++) {
                    if (i === 0) {
                        this.videos[i].date = this.initialStartTime;
                    }
                    else {
                        var prevDate = new Date(this.videos[i - 1].date);
                        var duration = this.videos[i - 1].totalSeconds;
                        prevDate.setSeconds(prevDate.getSeconds() + duration);
                        this.videos[i].date = new Date(prevDate);
                    }
                }
            }
        };

        // When a video is added, ensure the video titles do not conflict.
        // This will return the that should be used for the video.
        this.validateVideoTitle = function(videoTitle) {
            var titleToReturn = videoTitle;
            if (videoTitle in this.videoTitleCounts) {
                this.videoTitleCounts[videoTitle]++;
                titleToReturn = titleToReturn + "_" + this.videoTitleCounts[videoTitle];
            }
            else {
                this.videoTitleCounts[videoTitle] = 1;
            }
            return titleToReturn;
        };
		
		//Saves the selected config values
		this.saveConfig = function(selectedOptions){
			this.configOptions = JSON.parse(JSON.stringify(selectedOptions));
        };

        // Given a list and key, iterate through the list
        // and return the index of the key in that list (if it exists)
        $rootScope.findIndex = function(list, key) {
            if(list === null || list.length === 0) {
                return -1;
            }
            var count = list.length;
            var compare = key.replace(/,\s*$/, "");
            for(var i = 0; i < count; ++i) {
                if(list[i] === compare) {
                    return i;
                }
            }
            return -1;
        };
        
        // Check if the video is among the uuids given.
        // If so, change the video's status
        this.setVideoStatus = function(uuids, status) {
            this.videos.forEach(function(video) {
                //var index = $rootScope.findIndex(uuids, video.uuid);
                var index = -1;
                for(var i = 0; i < uuids.length; ++i) {
                    if (uuids[i].replace(/,\s*$/, "") === video.uuid) {
                        index = i;
                    }
                }
                if(uuids === null || uuids.length === 0) {
                    index = -1;
                }
                if(index !== -1) {
                    video.liveStatus = status;
                    // Push the video the list of UUIDs
                    if(status === "running") {
                        //video.videoPlayed = true;
                        console.log("set video status to true");
                        console.log(video.order);
                        currentlyRunningVideos.push({uuid: video.uuid, order: video.order});
                        console.log(currentlyRunningVideos);
                        return;
                        //currentlyRunningVideo = {uuid: video.uuid, order: video.order};
                    }
                }
            });
            return;
        };

        this.checkForRemoval = function(runningUUIDs) {
            // Nothing to remove
            if(runningUUIDs.length === 0 && currentlyRunningVideos.length === 0) {
                return [];
            }
            else if(runningUUIDs.length === 0 && currentlyRunningVideos.length !== 0) {
                var toReturn = [];
                console.log($rootScope.playlistPublished);
                if($rootScope.playlistPublished === true) {
                    $rootScope.playlistPublished = false;
                    currentlyRunningVideos.forEach(function(video) {
                        toReturn.push(video.order);
                    })
                    currentlyRunningVideos = [];
                }
                return toReturn;
            }
            else {
                if(currentlyRunningVideos.length === 0) {
                    return [];
                }
                else {
                    var toReturn = [];
                    console.log(currentlyRunningVideos);
                    var order = currentlyRunningVideos[0].order;
                    toReturn.push(order);
                    currentlyRunningVideos.slice(0, 1);
                    return toReturn;
                }
            }

            /*
            // Nothing to remove
            if(runningUUIDs.length === 0 && currentlyRunningVideos.length === 0) {
                console.log("Nothing to remove!!!!");
                return {status: false, videoOrder: -1};
            }
            else if(runningUUIDs.length === 0 && currentlyRunningVideos.length !== 0) {
                if($rootScope.playlistPublished === true) {
                    console.log("Live is done, remove all videos");
                    $rootScope.playlistPublished = false;
                    this.playlistChanged();
                    return {status: "remove", videoOrder: -1};
                }
                console.log("Live must be done playing, so remove the video");
                var returnOrder = currentlyRunningVideos[0].order;
                if(returnOrder !== undefined) {
                    this.videos[parseInt(returnOrder) - 1].videoPlayed = true;
                    currentlyRunningVideos.shift();
                    return {status: true, videoOrder: returnOrder};
                }
                else {
                return {status: false, videoOrder: -1};

                }
            }
            else {
                if(currentlyRunningVideos.length === 0) {
                    return {status: false, videoOrder: -1};

                }
                var length = runningUUIDs.length;
                var index = -1;
                for(var i = 0; i < length; ++i) {
                    if(currentlyRunningVideos[0].uuid === runningUUIDs[i].replace(/,\s*$/, "")) {
                        index = i;
                    }
                }
                
                // If there wasn't a match, the video is no longer running. Remove it
                if(index === -1) {
                    console.log("REMOVING");
                    console.log(currentlyRunningVideos);
                    currentlyRunningVideos.shift();
                    console.log(currentlyRunningVideos);
                    return {status: true, videoOrder: 1};
                }
                else {
                    return {status: false, videoOrder: -1};
                }
            }*/
            //var length = currentlyRunningVideos.length;
            //for(var i = 0; i < length; i++) {
                //var index = $rootScope.findIndex(runningUUIDs, currentlyRunningVideos[i].uuid);
                /*
            if(runningUUIDs !== [] && currentlyRunningVideo !== {})  {
                var index = -1;
                for(var i = 0; i < runningUUIDs.length; ++i) {
                    if(currentlyRunningVideo.uuid === runningUUIDs[i].replace(/,\s*$/, "")) {
                        index = i;
                    }
                }
                if((runningUUIDs === null || runningUUIDs.length === 0) && currentlyRunningVideo !== {} ) {
                    index = -1;
                }
                if(index === -1) {
                    console.log(index);
                    console.log('returned good');
                    //return {status: true, videoOrder: currentlyRunningVideo.order};
                    return {status: true, videoOrder: 1};
                }
                else {
                    //console.log(currentlyRunningVideos);
                    //currentlyRunningVideos.splice(index, 1);
                    currentlyRunningVideo = {};
                    //console.log('removed, after index: ', index);
                }
            }
           // }*/
            /*
            currentlyRunningVideos.forEach(function(obj){
                var index = $rootScope.findIndex(runningUUIDs, obj.uuid);
                if(index === -1) {
                    console.log(index);
                    console.log('returned good');
                    return {status: true, videoOrder: obj.order};
                }
                else {
                    console.log("removed");
                }
            });*/
        };

    }]);
