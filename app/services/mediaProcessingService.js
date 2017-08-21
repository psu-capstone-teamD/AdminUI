/* Copyright 2017 PSU Capstone Team D
This code is available under the "MIT License".
Please see the file LICENSE in this distribution for license terms.*/

angular.module('adminUI')
    .service('mediaProcessingService', ['$rootScope', '$q', function ($rootScope, $q) {

    this.video;
    // Generates a 80 x 60 thumbnail image given a file
    this.generateThumbnail = function (file, isFromS3) {
        var deferred = $q.defer();
        this.video = document.createElement('video');
        this.video.id = 'video';

        // Set the current time to the half-way point for thumbnail generation
        //this.video.addEventListener("loadedmetadata", function() {
        this.video.onloadedmetadata = function() {
            this.currentTime = this.duration / 2;
        };
        
        // Once the video is loaded in the browser, generate the thumbnail
        //this.video.addEventListener("loadeddata", function () {
        this.video.onloadeddata = function() {
            $rootScope.fileThumbnail = $rootScope.screenshot(this);
            deferred.resolve($rootScope.fileThumbnail);
        };
        this.video.style.display = "none";
        if (isFromS3) {
            this.video.src = file;
        }
        else {
            this.video.src = URL.createObjectURL(file);
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
        this.video = document.createElement('video');
        this.video.preload = 'metadata';
        this.video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(this.src);
            var totalSeconds = this.duration;
            $rootScope.videoLength = this.duration;
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
            this.video.src = file;
        }
        else {
            this.video.src = URL.createObjectURL(file);
        }
        return deferred.promise;
    }

    // Attaches a leading zero if the length is less than 10
    $rootScope.prependLeadingZero = function(num) {
        return (num < 10 && num > 0) ? "0" + num : num;
    }
}]);