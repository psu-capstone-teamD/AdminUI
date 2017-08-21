/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

angular.module('adminUI')
    .service('schedulerService', ['$rootScope', function ($rootScope) {
        this.videos = [
        ];

        this.videoCount = null;
		//Used default values for the selected items of each Config selection options
		this.configOptions = {
			"startMode": "Duration",
			"endMode": "Duration",
			"scheduleType": "Primary",
			"scheduleName": "Default Name",
			"channelType": "digital_television",
			"channelShortName": "Default Name"
		};
		
        // Set the default start time
        this.initialStartTime = '';

        // Mark whether or not the playlist is empty
        $rootScope.playlistEmpty = true;

        // Check whether the playlist has been published to Live
        $rootScope.playlistPublished = false;

        // Store video title counts in case the same title is used
        this.videoTitleCounts = {};
		
		// Output URL to get the livestream.
		this.livestreamURL = 'http://delta-1-yanexx65s8e5.live.elementalclouddev.com/in_put/testoutput.m3u8';
		
        // Store the videos currently running in Live
        var currentlyRunningVideos = [];

        // Used for debugging purposes
        this.getCurrentlyRunningVideos = function() {
            return currentlyRunningVideos;
        }

        // Used for debugging purposes
        this.setCurrentlyRunningVideos = function(list) {
            if(list === undefined || list === null) {
                return -1;
            }
            if(list.length !== 0) {
                currentlyRunningVideos = [];
                list.forEach(function(item) {
                    currentlyRunningVideos.push(item);
                });
            }
            else {
                return -1;
            }
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
            if(titleToReturn === undefined || titleToReturn === null) {
                titleToReturn = "Video";
            }
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

        
        // Check if the video is among the uuids given.
        // If so, change the video's status
        this.setVideoStatus = function(uuids, status) {
            var result = -1; 
            this.videos.forEach(function(video) {
                var index = -1;

                // If the uuids don't even exist, return -1
                if(uuids === undefined || uuids === null) {
                    return -1
                }

                if( uuids.length !== 0) {
                    // Check for a match in the list of uuids
                    for(var i = 0; i < uuids.length; ++i) {
                        if (uuids[i].replace(/,\s*$/, "") === video.uuid) {
                            index = i;
                        }
                    }
                }

                // If there was a match, switch the status
                if(index !== -1) {

                    // Check if the video status is already the same. If not,
                    // add it to the runnig queue (if running)
                    if(video.liveStatus !== status) {
                        video.liveStatus = status;
                        video.locked = true;
                        // Push the video the list of UUIDs
                        if(status === "running") {
                            currentlyRunningVideos.push({uuid: video.uuid, order: video.order});
                        }
                        result = parseInt(video.order);
                        return result;
                    }
                }
            });
            
            return result;
        };

        this.checkForRemoval = function(runningUUIDs) {
            // Nothing to remove
            if(runningUUIDs.length === 0 && currentlyRunningVideos.length === 0) {
                return [];
            }

            // If there is nothing running anymore, but there are still running videos
            // in the queue, they need to be cleared
            else if(runningUUIDs.length === 0 && currentlyRunningVideos.length !== 0) {
                var toReturn = [];
                currentlyRunningVideos.forEach(function(video) {
                    toReturn.push(video.order);
                })
                currentlyRunningVideos = [];
                return toReturn;
            }
            else {
                // If there was nothing running, there is nothing to remove
                if(currentlyRunningVideos.length === 0) {
                    return [];
                }
                else {
                    // If Live's running event != local running event,
                    // get the order of the first item in the queue and then
                    // remove it
                    if(runningUUIDs[0] !== currentlyRunningVideos[0].uuid) {
                        var toReturn = [];
                        var order = currentlyRunningVideos[0].order;
                        toReturn.push(order);
                        currentlyRunningVideos.shift();
                        return toReturn;
                    }
                    // Otherwise, nothing to delete
                    else {
                        return [];
                    }
                }
            }
        };

    }]);
