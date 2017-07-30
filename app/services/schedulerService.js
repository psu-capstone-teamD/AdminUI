angular.module('adminUI')
    .service('schedulerService', ['$rootScope', function ($rootScope) {
        this.videos = [
        ];

		//Used default values for the selected items of each Config selection options
		this.selectedOptions = [
			{name : "screenResolution", value : "480p"},
			{name : "aspectRatio", value : "4:3"},
			{name : "endMode", value : "Fixed"},
			{name : "startMode", value : "Fixed"},
			{name : "eventType", value : "Primary"},
		];
		
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
			for(var i = 0; i < selectedOptions.length; i++) {
				this.selectedOptions[i].value = selectedOptions[i];
			}
		}
    }]);
