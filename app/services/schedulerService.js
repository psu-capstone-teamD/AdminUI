angular.module('adminUI')
    .service('schedulerService', ['$rootScope', function ($rootScope) {
        this.videos = [
        ];

        // Set the default start time
        this.initialStartTime = '';

        this.playlistChanged = function() {
            console.log('received');
            var videoCount = this.videos.length;
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
        };
    }]);
