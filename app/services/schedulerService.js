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

        this.videoTitleCounts = {};

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
        }

        // Given a list and key, iterate through the list
        // and return the index of the key in that list (if it exists)
        this.findIndex = function(list, key) {
            if(list === null || list.length === 0) {
                return -1;
            }
            var count = list.length;
            for(var i = 0; i < count; ++i) {
                if(list[i] === key) {
                    return i;
                }
            }
            return -1;
        }
        
        this.setVideoStatus = function(uuids, status) {
            this.videos.forEach(function(video) {
                var index = this.findIndex(uuids, video.uuid);
                if(index !== -1) {
                    this.videos[index].liveStatus = status;
                }
            });
            return;
        }
    }]);
