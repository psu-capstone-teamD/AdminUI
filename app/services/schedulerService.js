angular.module('adminUI')
    .service('schedulerService', ['$rootScope', function ($rootScope) {
        this.videos = [
        ];

        // Set the default start time
        this.initialStartTime = '';
        $rootScope.playlistEmpty = true;

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
    }]);
