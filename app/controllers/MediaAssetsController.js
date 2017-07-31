// Define the MediaAssetsController on the adminUI module
angular.module('adminUI')
	.controller('MediaAssetsController', ['$scope', 'S3Service', '$q', function ($scope, S3Service, $q) {
    $scope.mediaAssets = [];
    $scope.S3Objects = [];
		
	$scope.retrieveS3Objects = function(){
        var retrieve = S3Service.getItemsInBucket($scope.S3Objects);
        retrieve.then(function(result) {
            $scope.S3Objects = result;
            $scope.S3Objects.forEach(function(obj) {
                $scope.mediaAssets.push({thumbnail: null, title: obj.title, date: obj.date, url: obj.url});
            });
        });
    };

      // Generates a 80 x 60 thumbnail image given a file
    $scope.generateThumbnail = function (url) {
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
        video.src = url;
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
        console.log("in screenshot");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.width = 'inherit';
        canvas.style.height = 'inherit';
        $(video).remove();
        $(canvas).remove();
        return canvas.toDataURL(canvas);
    }
}]);