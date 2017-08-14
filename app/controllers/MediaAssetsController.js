// Define the MediaAssetsController on the adminUI module
angular.module('adminUI')
	.controller('MediaAssetsController', ['$scope','$rootScope', 'S3Service', '$q', 'mediaAssetsService', 'schedulerService', function ($scope, $rootScope, S3Service, $q, mediaAssetsService, schedulerService) {
    $scope.mediaAssets = mediaAssetsService.mediaAssets;
    $scope.S3Objects = [];
    $scope.currentURL = "";
    $scope.currentFileName = "";
    $scope.videoCount = schedulerService.videos.length;
		
	$scope.retrieveS3Objects = function(bucket){
        if(bucket === undefined || bucket === null) {
            bucket = new AWS.S3();
        }
        var retrieve = S3Service.getItemsInBucket($scope.S3Objects, bucket); // Get the items in the S3 bucket
        retrieve.then(function(result) {
            $scope.S3Objects = result;
            // Check if the items exist already. If not, clear the mediaAssets and push the new results
            if(!mediaAssetsService.playlistsAreEqual($scope.S3Objects)) {
                var hold = [];
                $scope.S3Objects.forEach(function(obj) {
                        hold.push({thumbnail: null, title: obj.title, date: obj.date, url: obj.url, tag: obj.tag});
                });
                $scope.mediaAssets = hold;
                mediaAssetsService.mediaAssets = $scope.mediaAssets;
            }
        });
    };

    // Keeps track of the current S3 video a user has clicked
    $scope.updateCurrentS3Video = function(fileName, fileURL) {
        if(fileName === null) {
            $scope.currentFileName = "";
        }
        else {
            $scope.currentFileName = fileName;
        }
        if(fileURL === null) {
            $scope.currentURL = "";
        }
        else {
            $scope.currentURL = fileURL;
        }
    }

    // Add a file from S3 to the playlist
    $scope.addFile = function() {
       toastr.info("Adding file to playlist...", "In Progress");
       S3Service.handleS3Media({fileName: $scope.currentFileName, fileURL: $scope.currentURL, title: $scope.title, category: $scope.category, date: $scope.videoStartTime, order: $scope.order });
       $rootScope.$emit('addS3ToPlaylist', null);
    }

    // Reset the form
    $scope.resetMediaAssetForm = function() {
        try {
            $('#addAssetFromS3').modal('hide');
        }
        catch (err) {
            console.log("Failed to hide the modal!");
        }
        $scope.title = null;
        $scope.category = "";
        $scope.order = "";
        $scope.uploadProgress = 0;
        $scope.startTime = "";
        $scope.videoStartTime = "";
        schedulerService.playlistChanged();
        $scope.$digest();
    }

    // When the PlaylistController signals that the asset has
    // been added, notify the user and clear the form
    //$rootScope.$on('S3AddFinished', function(event, args) {
    $scope.$on('S3AddFinished', function(event, args) {
        toastr.success("Media file added to playlist", "Success");
        $scope.resetMediaAssetForm();
    });

    $scope.$on('VideoCountChanged', function(event, count) {
        $scope.videoCount = count;
    });
}]);