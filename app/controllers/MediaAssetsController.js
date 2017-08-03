// Define the MediaAssetsController on the adminUI module
angular.module('adminUI')
	.controller('MediaAssetsController', ['$scope', 'S3Service', '$q', 'mediaAssetsService', function ($scope, S3Service, $q, mediaAssetsService) {
    $scope.mediaAssets = mediaAssetsService.mediaAssets;
    $scope.S3Objects = [];
    $scope.currentURL = "";
    $scope.currentFileName = "";
		
	$scope.retrieveS3Objects = function(){
        $scope.mediaAssets = mediaAssetsService.mediaAssets;
        var retrieve = S3Service.getItemsInBucket($scope.S3Objects); // Get the items in the S3 bucket
        retrieve.then(function(result) {
            $scope.S3Objects = result;
            // Check if the items exist already. If not, clear the mediaAssets and push the new results
            if(!mediaAssetsService.playlistsAreEqual($scope.S3Objects)) {
                //$scope.mediaAssets = [];
                $scope.S3Objects.forEach(function(obj) {
                        $scope.mediaAssets.push({thumbnail: null, title: obj.title, date: obj.date, url: obj.url});
                });
            }
        });
    };

    $scope.updateCurrentS3Video = function(fileName, fileURL) {
        $scope.currentFileName = fileName;
        $scope.currentURL = fileURL;
    }
}]);