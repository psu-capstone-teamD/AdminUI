angular.module('adminUI')
    .service('mediaProcessingService', ['$rootScope', '$q', function ($rootScope, $q) {
    // Generates a 80 x 60 thumbnail image given a file
    this.generateThumbnail = function (file, isFromS3) {
        var deferred = $q.defer();
        var video = document.createElement('video');

        // Set the current time to the half-way point for thumbnail generation
        video.addEventListener("loadedmetadata", function() {
            this.currentTime = this.duration / 2;
        }, false);
        
        // Once the video is loaded in the browser, generate the thumbnail
        video.addEventListener("loadeddata", function () {
            $rootScope.fileThumbnail = $rootScope.screenshot(this);
            deferred.resolve($rootScope.fileThumbnail);
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
    $rootScope.screenshot = function(video) {
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
    
    // Finds the duration of the file and converts it to HH:MM:SS format
    this.findDuration = function(file, isFromS3){
        var deferred = $q.defer();
        var video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(this.src);
            var totalSeconds = video.duration;
            $rootScope.videoLength = video.duration;
            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor(totalSeconds % 3600 / 60);
            var seconds = Math.floor(totalSeconds % 3600 % 60);

            var hh = hours > 0 ? $rootScope.prependLeadingZero(hours) + ":" : "00:";
            var mm = minutes > 0 ? $rootScope.prependLeadingZero(minutes) + ":" : "00:";
            var ss = seconds > 0 ? $rootScope.prependLeadingZero(seconds) : "00";
            
            $rootScope.fileDuration = hh + mm + ss;
            deferred.resolve($rootScope.fileDuration);
        }
        if(isFromS3) {
            video.src = file;
        }
        else {
            video.src = URL.createObjectURL(file);
        }
        return deferred.promise;
    }

    // Attaches a leading zero if the length is less than 10
    $rootScope.prependLeadingZero = function(num) {
        return (num < 10 && num > 0) ? "0" + num : num;
    }
}]);